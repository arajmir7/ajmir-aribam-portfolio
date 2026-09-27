#!/usr/bin/env bash
set -euo pipefail

container="portfolio-pg-verify-$$"
backup_dir="$(mktemp -d)"
chmod 0700 "$backup_dir"
migration_password="portfolio_verify_migration_password_at_least_32_chars"
runtime_password="portfolio_verify_runtime_password_at_least_32_chars"
runtime_user="portfolio_app"
revision="$(git rev-parse --short HEAD)"
host_port="$(python3 -c 'import socket; s=socket.socket(); s.bind(("127.0.0.1", 0)); print(s.getsockname()[1]); s.close()')"
admin_url="postgresql://portfolio:${migration_password}@127.0.0.1:${host_port}/portfolio_verify"
container_admin_url="postgresql://portfolio:${migration_password}@127.0.0.1:5432/portfolio_verify"

cleanup() {
  docker rm -f "$container" >/dev/null 2>&1 || true
  rm -rf "$backup_dir"
}
trap cleanup EXIT

docker run -d --name "$container" --rm \
  -e POSTGRES_DB=portfolio_verify \
  -e POSTGRES_USER=portfolio \
  -e "POSTGRES_PASSWORD=$migration_password" \
  -p "127.0.0.1:${host_port}:5432" postgres:17-alpine >/dev/null

for attempt in {1..30}; do
  if docker exec "$container" pg_isready -U portfolio -d portfolio_verify >/dev/null 2>&1; then break; fi
  if [[ "$attempt" == 30 ]]; then echo "PostgreSQL did not become ready" >&2; exit 1; fi
  sleep 1
done

export APP_ENV=production
export MIGRATION_DATABASE_URL="$admin_url"
export DATABASE_RUNTIME_USER="$runtime_user"
export DATABASE_RUNTIME_PASSWORD="$runtime_password"
export CONTACT_INTERNAL_TOKEN=postgres-release-verification-token-at-least-32-chars
export BUILD_REVISION="$revision"
unset DATABASE_URL

(
  cd backend
  uv run python -m app.maintenance prepare-runtime-role
  uv run alembic upgrade head
  uv run alembic check
  runtime_url="$(uv run python -c 'from app.core.config import get_settings; print(get_settings().database_url)')"
  TEST_DATABASE_URL="$runtime_url" uv run pytest -q tests/test_postgres_integration.py
)

docker exec "$container" psql -U portfolio -d portfolio_verify -v ON_ERROR_STOP=1 -c \
  "WITH inquiry AS (
     INSERT INTO inquiries (id, name, email, topic, message, request_id, idempotency_key, created_at)
     VALUES ('00000000-0000-0000-0000-000000000001', 'Restore Drill', 'restore@example.com',
       'question', 'Restore verification record.', 'restore-drill', 'restore-drill-idempotency', now())
     RETURNING id
   )
   INSERT INTO email_deliveries (id, inquiry_id, status, attempt_count, created_at, next_attempt_at)
   SELECT '00000000-0000-0000-0000-000000000002', id, 'pending', 0, now(), now() FROM inquiry;" >/dev/null

docker build -f infra/backup/Dockerfile -t portfolio-backup:verify .
docker run --rm --user "$(id -u):$(id -g)" --network "container:$container" \
  -e "DATABASE_URL=$container_admin_url" -e BACKUP_DIR=/backups \
  -v "$backup_dir:/backups" portfolio-backup:verify
backup_file="$(find "$backup_dir" -maxdepth 1 -type f -name 'portfolio-*.dump' -print -quit)"
[[ -n "$backup_file" ]] || { echo "Backup job did not produce a dump" >&2; exit 1; }
backup_name="$(basename "$backup_file")"
docker exec "$container" createdb -U portfolio portfolio_restore

export MIGRATION_DATABASE_URL="postgresql://portfolio:${migration_password}@127.0.0.1:${host_port}/portfolio_restore"
(
  cd backend
  uv run python -m app.maintenance prepare-runtime-role
)
docker run --rm --network "container:$container" \
  -e "DATABASE_URL=postgresql://portfolio:${migration_password}@127.0.0.1:5432/portfolio_restore" \
  -e RESTORE_CONFIRM=restore-into-empty-database \
  -v "$backup_dir:/backups" \
  --entrypoint python3 portfolio-backup:verify \
  /app/restore_postgres.py "/backups/$backup_name"

restored="$(docker exec "$container" psql -U portfolio -d portfolio_restore -Atc \
  "SELECT count(*) FROM inquiries i JOIN email_deliveries d ON d.inquiry_id = i.id WHERE i.request_id = 'restore-drill' AND d.status = 'pending';")"
[[ "$restored" == "1" ]] || { echo "Restore drill did not recover the marker inquiry" >&2; exit 1; }
docker exec -e "PGPASSWORD=$runtime_password" "$container" psql -h 127.0.0.1 \
  -U "$runtime_user" -d portfolio_restore -Atc \
  "SELECT count(*) FROM inquiries WHERE request_id = 'restore-drill';" | grep -qx '1'
echo "PostgreSQL role separation, migrations, drift, API concurrency, portable backup, and isolated restore passed."
