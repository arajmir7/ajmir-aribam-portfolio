#!/usr/bin/env bash
set -euo pipefail

project="portfolio_verify_$$"
workdir="$(mktemp -d)"
headers="$workdir/headers"
port="$(python3 -c 'import socket; s=socket.socket(); s.bind(("127.0.0.1", 0)); print(s.getsockname()[1]); s.close()')"
export COMPOSE_PROJECT_NAME="$project"
export POSTGRES_PASSWORD=portfolio_compose_verify_migration_password_at_least_32_chars
export DATABASE_RUNTIME_USER=portfolio_app
export DATABASE_RUNTIME_PASSWORD=local-compose-app-db-password-at-least-32-chars
export CONTACT_INTERNAL_TOKEN=local-compose-token-at-least-32-characters
export NEXT_PUBLIC_SITE_URL=https://ajmiraribam.me
export CONTACT_ALLOWED_ORIGIN=https://ajmiraribam.me
export CONTACT_CLIENT_IP_HEADER=x-forwarded-for
export BUILD_REVISION="$(git rev-parse --short HEAD)"
export PORTFOLIO_WEB_PORT="$port"

cleanup() {
  docker compose down -v --remove-orphans >/dev/null 2>&1 || true
  rm -rf "$workdir"
}
trap cleanup EXIT

docker compose up -d --build --wait postgres
docker compose run --rm --build backend python -m app.maintenance prepare-runtime-role
docker compose run --rm --build backend alembic upgrade head
docker compose up -d --build --wait
curl --fail --silent --show-error "http://127.0.0.1:${port}/api/health" >/dev/null

curl --fail --silent --show-error -D "$headers" \
  "http://127.0.0.1:${port}/" -o /dev/null
for header in content-security-policy strict-transport-security x-content-type-options referrer-policy x-frame-options; do
  grep -qi "^${header}:" "$headers" || {
    echo "Local production response is missing $header." >&2
    exit 1
  }
done

status="$(curl --silent --show-error -o /dev/null -w '%{http_code}' \
  -H "Origin: ${CONTACT_ALLOWED_ORIGIN}" -H 'X-Forwarded-For: 198.51.100.41' -H 'Content-Type: application/json' \
  --data '{"name":"Compose Verification","email":"verify@example.com","topic":"project","message":"Verifying inquiry persistence in the isolated Compose topology.","website":""}' \
  "http://127.0.0.1:${port}/api/contact")"
[[ "$status" == 200 ]] || { echo "Contact smoke returned $status" >&2; exit 1; }

status="$(curl --silent --show-error -o /dev/null -w '%{http_code}' \
  -H "Origin: ${CONTACT_ALLOWED_ORIGIN}" -H 'X-Forwarded-For: 198.51.100.41' -H 'Content-Type: application/json' \
  --data '{}' "http://127.0.0.1:${port}/api/contact")"
[[ "$status" == 422 ]] || { echo "Invalid contact payload returned $status" >&2; exit 1; }

for attempt in 2 3 4 5; do
  status="$(curl --silent --show-error -o /dev/null -w '%{http_code}' \
    -H "Origin: ${CONTACT_ALLOWED_ORIGIN}" -H 'X-Forwarded-For: 198.51.100.41' -H 'Content-Type: application/json' \
    --data "{\"name\":\"Compose Verification ${attempt}\",\"email\":\"verify@example.com\",\"topic\":\"project\",\"message\":\"Rate limit verification ${attempt}.\"}" \
    "http://127.0.0.1:${port}/api/contact")"
  [[ "$status" == 200 ]] || { echo "Valid contact attempt ${attempt} returned $status" >&2; exit 1; }
done

status="$(curl --silent --show-error -o /dev/null -w '%{http_code}' \
  -H "Origin: ${CONTACT_ALLOWED_ORIGIN}" -H 'X-Forwarded-For: 198.51.100.41' -H 'Content-Type: application/json' \
  --data '{"name":"Compose Verification Limit","email":"verify@example.com","topic":"project","message":"This request should reach the rate limit."}' \
  "http://127.0.0.1:${port}/api/contact")"
[[ "$status" == 429 ]] || { echo "Rate limit request returned $status" >&2; exit 1; }

count="$(docker compose exec -T postgres psql -U portfolio -d portfolio -Atc 'select count(*) from inquiries')"
[[ "$count" == 5 ]] || { echo "Expected five persisted inquiries; found $count" >&2; exit 1; }

status="$(curl --silent --show-error -o /dev/null -w '%{http_code}' \
  -H 'Origin: https://wrong.example' -H 'Content-Type: application/json' \
  --data '{"name":"Cross Origin","email":"verify@example.com","topic":"project","message":"This message must be rejected by the public boundary."}' \
  "http://127.0.0.1:${port}/api/contact")"
[[ "$status" == 403 ]] || { echo "Cross-origin smoke returned $status" >&2; exit 1; }

echo "Compose readiness, security headers, contact persistence/validation/origin/rate limits passed."
