#!/usr/bin/env bash
set -euo pipefail

project="portfolio_verify_$$"
port="$(python3 -c 'import socket; s=socket.socket(); s.bind(("127.0.0.1", 0)); print(s.getsockname()[1]); s.close()')"
export COMPOSE_PROJECT_NAME="$project"
export POSTGRES_PASSWORD=portfolio_compose_verify
export CONTACT_INTERNAL_TOKEN=local-compose-token-at-least-32-characters
export NEXT_PUBLIC_SITE_URL="http://127.0.0.1:${port}"
export ALLOW_INSECURE_SITE_URL=true
export PORTFOLIO_WEB_PORT="$port"
export BUILD_REVISION=local-refactor-verification

cleanup() { docker compose down -v --remove-orphans >/dev/null 2>&1 || true; }
trap cleanup EXIT

docker compose up -d --build --wait
curl --fail --silent --show-error "http://127.0.0.1:${port}/api/health" >/dev/null

status="$(curl --silent --show-error -o /dev/null -w '%{http_code}' \
  -H "Origin: http://127.0.0.1:${port}" -H 'Content-Type: application/json' \
  --data '{"name":"Compose Verification","email":"verify@example.com","topic":"project","message":"Verifying inquiry persistence in the isolated Compose topology.","website":""}' \
  "http://127.0.0.1:${port}/api/contact")"
[[ "$status" == 200 ]] || { echo "Contact smoke returned $status" >&2; exit 1; }

count="$(docker compose exec -T postgres psql -U portfolio -d portfolio -Atc 'select count(*) from inquiries')"
[[ "$count" == 1 ]] || { echo "Expected one persisted inquiry; found $count" >&2; exit 1; }

status="$(curl --silent --show-error -o /dev/null -w '%{http_code}' \
  -H 'Origin: https://wrong.example' -H 'Content-Type: application/json' \
  --data '{"name":"Cross Origin","email":"verify@example.com","topic":"project","message":"This message must be rejected by the public boundary."}' \
  "http://127.0.0.1:${port}/api/contact")"
[[ "$status" == 403 ]] || { echo "Cross-origin smoke returned $status" >&2; exit 1; }

echo "Compose ready; contact persisted; foreign origin rejected."
