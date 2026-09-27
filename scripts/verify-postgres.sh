#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
container="portfolio-pg-verify-$$"
backup_dir="$(mktemp -d)"
chmod 0700 "$backup_dir"
migration_password=portfolio_verify_migration_password_32_chars
runtime_password=portfolio_verify_runtime_password_32_chars
runtime_user=portfolio_app
host_port="$(python3 -c 'import socket; s=socket.socket(); s.bind(("127.0.0.1", 0)); print(s.getsockname()[1]); s.close()')"
admin_url="postgresql+psycopg://portfolio:${migration_password}@127.0.0.1:${host_port}/portfolio_verify"
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

export APP_ENV=test
export CONTACT_INTERNAL_TOKEN=postgres-release-verification-token-at-least-32-chars
export DATABASE_URL="$admin_url"
(
  cd "$root/backend"
  uv run alembic upgrade head
  uv run alembic check
)

docker exec "$container" psql -U portfolio -d portfolio_verify -v ON_ERROR_STOP=1 -c \
  "CREATE ROLE ${runtime_user} LOGIN PASSWORD '${runtime_password}';
   GRANT CONNECT ON DATABASE portfolio_verify TO ${runtime_user};
   GRANT USAGE ON SCHEMA public TO ${runtime_user};
   GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO ${runtime_user};
   GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA public TO ${runtime_user};
   ALTER DEFAULT PRIVILEGES FOR ROLE portfolio IN SCHEMA public
     GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO ${runtime_user};
   ALTER DEFAULT PRIVILEGES FOR ROLE portfolio IN SCHEMA public
     GRANT USAGE, SELECT, UPDATE ON SEQUENCES TO ${runtime_user};" >/dev/null

runtime_url="postgresql+psycopg://${runtime_user}:${runtime_password}@127.0.0.1:${host_port}/portfolio_verify"
(
  cd "$root/backend"
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

docker build -f "$root/infra/backup/Dockerfile" -t portfolio-pg-tools:verify "$root"
docker run --rm --user "$(id -u):$(id -g)" --network "container:$container" \
  -e "DATABASE_URL=$container_admin_url" -e BACKUP_DIR=/backups \
  -v "$backup_dir:/backups" portfolio-pg-tools:verify
backup_file="$(find "$backup_dir" -maxdepth 1 -type f -name 'portfolio-*.dump' -print -quit)"
[[ -n "$backup_file" ]] || { echo "Backup command did not create a dump" >&2; exit 1; }
backup_name="$(basename "$backup_file")"
docker exec "$container" createdb -U portfolio portfolio_restore
restore_url="postgresql://portfolio:${migration_password}@127.0.0.1:5432/portfolio_restore"
docker run --rm --user "$(id -u):$(id -g)" --network "container:$container" \
  -e "DATABASE_URL=$restore_url" \
  -e RESTORE_CONFIRM=restore-into-empty-database \
  -v "$backup_dir:/backups" \
  --entrypoint python3 portfolio-pg-tools:verify \
  /app/restore_postgres.py "/backups/$backup_name"

docker exec "$container" psql -U portfolio -d portfolio_restore -v ON_ERROR_STOP=1 -c \
  "GRANT CONNECT ON DATABASE portfolio_restore TO ${runtime_user};
   GRANT USAGE ON SCHEMA public TO ${runtime_user};
   GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO ${runtime_user};
   GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA public TO ${runtime_user};" >/dev/null

restored="$(docker exec "$container" psql -U portfolio -d portfolio_restore -Atc \
  "SELECT count(*) FROM inquiries i JOIN email_deliveries d ON d.inquiry_id=i.id WHERE i.request_id='restore-drill' AND d.status='pending';")"
[[ "$restored" == "1" ]] || { echo "Isolated restore omitted its verification marker" >&2; exit 1; }
docker exec -e "PGPASSWORD=$runtime_password" "$container" psql -h 127.0.0.1 \
  -U "$runtime_user" -d portfolio_restore -Atc \
  "SELECT count(*) FROM inquiries WHERE request_id='restore-drill';" | grep -qx '1'

echo "PostgreSQL role grants, Alembic upgrade/drift, integration tests, checksum backup, and isolated restore passed."
