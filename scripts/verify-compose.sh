#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
compose=(docker compose -f "$root/compose.yaml" -f "$root/infra/compose.dev.yaml")
export COMPOSE_PROJECT_NAME="portfolio_compose_verify_$$"
export POSTGRES_PASSWORD=portfolio_compose_verify_password_32_chars
export PORTFOLIO_DB_PORT="$(python3 -c 'import socket; s=socket.socket(); s.bind(("127.0.0.1", 0)); print(s.getsockname()[1]); s.close()')"
export APP_ENV=test
export DATABASE_URL="postgresql+psycopg://portfolio:${POSTGRES_PASSWORD}@127.0.0.1:${PORTFOLIO_DB_PORT}/portfolio"

cleanup() { "${compose[@]}" down -v --remove-orphans >/dev/null 2>&1 || true; }
trap cleanup EXIT

"${compose[@]}" config --quiet
"${compose[@]}" up -d --wait postgres
(
  cd "$root/backend"
  uv run alembic upgrade head
  uv run alembic check
)
revision="$("${compose[@]}" exec -T postgres psql -U portfolio -d portfolio -Atqc \
  'SELECT version_num FROM alembic_version')"
[[ "$revision" == "003_resend_message_id" ]] || {
  echo "Compose database migration revision was $revision." >&2
  exit 1
}
echo "Local Compose PostgreSQL, Alembic upgrade, and schema drift checks passed at $revision."
