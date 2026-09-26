#!/usr/bin/env bash
set -euo pipefail

container="portfolio-pg-verify-$$"
cleanup() { docker rm -f "$container" >/dev/null 2>&1 || true; }
trap cleanup EXIT

docker run -d --name "$container" --rm \
  -e POSTGRES_DB=portfolio_verify \
  -e POSTGRES_USER=portfolio \
  -e POSTGRES_PASSWORD=portfolio_verify \
  -p 127.0.0.1::5432 postgres:17-alpine >/dev/null

for attempt in {1..30}; do
  if docker exec "$container" pg_isready -U portfolio -d portfolio_verify >/dev/null 2>&1; then break; fi
  if [[ "$attempt" == 30 ]]; then echo "PostgreSQL did not become ready" >&2; exit 1; fi
  sleep 1
done

port="$(docker port "$container" 5432/tcp | sed -E 's/.*:([0-9]+)$/\1/')"
database_url="postgresql+psycopg://portfolio:portfolio_verify@127.0.0.1:${port}/portfolio_verify"
(
  cd backend
  DATABASE_URL="$database_url" uv run alembic upgrade head
  DATABASE_URL="$database_url" uv run alembic check
  TEST_DATABASE_URL="$database_url" uv run pytest -q tests/test_postgres_integration.py
)

docker exec "$container" psql -U portfolio -d portfolio_verify -v ON_ERROR_STOP=1 -c \
  "INSERT INTO inquiries (id, name, email, topic, message, request_id, created_at, notification_status)
   VALUES ('00000000-0000-0000-0000-000000000001', 'Restore Drill', 'restore@example.com',
   'question', 'Restore verification record.', 'restore-drill', now(), 'pending');" >/dev/null
docker exec "$container" pg_dump -U portfolio -d portfolio_verify -Fc -f /tmp/portfolio.dump
docker exec "$container" createdb -U portfolio portfolio_restore
docker exec "$container" pg_restore -U portfolio -d portfolio_restore /tmp/portfolio.dump
restored="$(docker exec "$container" psql -U portfolio -d portfolio_restore -Atc \
  "SELECT count(*) FROM inquiries WHERE request_id = 'restore-drill';")"
[[ "$restored" == "1" ]] || { echo "Restore drill did not recover the marker inquiry" >&2; exit 1; }
echo "PostgreSQL migration, concurrency, and restore drill passed."
