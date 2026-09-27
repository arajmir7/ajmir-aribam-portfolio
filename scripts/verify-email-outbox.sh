#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
workdir="$(mktemp -d)"
chmod 0700 "$workdir"
compose=(docker compose -f "$root/compose.yaml" -f "$root/infra/compose.dev.yaml")
export COMPOSE_PROJECT_NAME="portfolio_resend_qa_$$"
export POSTGRES_PASSWORD=portfolio_resend_qa_password_32_chars
export APP_ENV=test
export CONTACT_INTERNAL_TOKEN=portfolio_resend_qa_token_32_chars_min
export BUILD_REVISION="$(git -C "$root" rev-parse --short HEAD)"
export PORTFOLIO_DB_PORT="$(python3 -c 'import socket; s=socket.socket(); s.bind(("127.0.0.1", 0)); print(s.getsockname()[1]); s.close()')"
export PORT="$(python3 -c 'import socket; s=socket.socket(); s.bind(("127.0.0.1", 0)); print(s.getsockname()[1]); s.close()')"
export PORTFOLIO_API_PORT="$(python3 -c 'import socket; s=socket.socket(); s.bind(("127.0.0.1", 0)); print(s.getsockname()[1]); s.close()')"
export MOCK_RESEND_PORT="$(python3 -c 'import socket; s=socket.socket(); s.bind(("127.0.0.1", 0)); print(s.getsockname()[1]); s.close()')"
export NEXT_PUBLIC_SITE_URL="http://127.0.0.1:${PORT}"
export CONTACT_ALLOWED_ORIGIN="$NEXT_PUBLIC_SITE_URL"
export CONTACT_API_URL="http://127.0.0.1:${PORTFOLIO_API_PORT}"
export CONTACT_CLIENT_IP_HEADER=x-forwarded-for
export DATABASE_URL="postgresql+psycopg://portfolio:${POSTGRES_PASSWORD}@127.0.0.1:${PORTFOLIO_DB_PORT}/portfolio"
export RESEND_API_KEY=re_test_portfolio_local_only
export RESEND_API_URL="http://127.0.0.1:${MOCK_RESEND_PORT}"
export CONTACT_EMAIL_FROM='Ajmir Aribam QA <qa@example.com>'
export CONTACT_EMAIL_TO=qa-inbox@example.com
export MOCK_RESEND_CAPTURE="$workdir/resend-captured.json"

api_pid=""
web_pid=""
resend_pid=""
cleanup() {
  for pid in "$web_pid" "$api_pid" "$resend_pid"; do
    if [[ -n "$pid" ]]; then kill "$pid" >/dev/null 2>&1 || true; fi
  done
  for pid in "$web_pid" "$api_pid" "$resend_pid"; do
    if [[ -n "$pid" ]]; then wait "$pid" >/dev/null 2>&1 || true; fi
  done
  "${compose[@]}" down -v --remove-orphans >/dev/null 2>&1 || true
  rm -rf "$workdir"
}
trap cleanup EXIT

"${compose[@]}" up -d --wait postgres >/dev/null
(
  cd "$root/backend"
  uv run alembic upgrade head >/dev/null
)
python3 "$root/scripts/mock_resend.py" >"$workdir/resend.log" 2>&1 &
resend_pid=$!
for attempt in {1..30}; do
  if curl --silent "http://127.0.0.1:${MOCK_RESEND_PORT}/health" >/dev/null 2>&1; then break; fi
  if [[ "$attempt" == 30 ]]; then
    kill -0 "$resend_pid" 2>/dev/null || { echo "Local Resend mock did not start." >&2; exit 1; }
    break
  fi
  sleep 0.2
done
(
  cd "$root/backend"
  uv run uvicorn app.main:app --host 127.0.0.1 --port "$PORTFOLIO_API_PORT"
) >"$workdir/api.log" 2>&1 &
api_pid=$!
(
  cd "$root/frontend"
  npm run dev -- --hostname 127.0.0.1 --port "$PORT"
) >"$workdir/web.log" 2>&1 &
web_pid=$!

for attempt in {1..60}; do
  if curl --silent --fail "$NEXT_PUBLIC_SITE_URL/api/health" -o "$workdir/health.json"; then break; fi
  if [[ "$attempt" == 60 ]]; then
    cat "$workdir/api.log" "$workdir/web.log" >&2
    echo "The local PostgreSQL contact stack did not become ready." >&2
    exit 1
  fi
  sleep 1
done
python3 - "$workdir/health.json" <<'PY'
import json
import sys

health = json.load(open(sys.argv[1], encoding="utf-8"))
if health.get("status") != "ready":
    raise SystemExit("The private API readiness check did not pass.")
if set(health) != {"status", "revision"}:
    raise SystemExit("Public health exposed internal service details.")
PY

success_key="$(python3 -c 'import uuid; print(uuid.uuid4())')"
success_payload='{"name":"Portfolio Resend QA","email":"visitor@example.com","topic":"question","message":"Local end-to-end delivery verification.","website":""}'
for attempt in 1 2; do
  status="$(curl --silent --show-error --output "$workdir/success-$attempt.json" \
    --write-out '%{http_code}' -H "Origin: $CONTACT_ALLOWED_ORIGIN" \
    -H 'X-Forwarded-For: 198.51.100.22' -H "Idempotency-Key: $success_key" \
    -H 'Content-Type: application/json' --data "$success_payload" \
    "$NEXT_PUBLIC_SITE_URL/api/contact")"
  [[ "$status" == 200 ]] || { echo "Valid contact request returned $status." >&2; exit 1; }
done

failure_key="$(python3 -c 'import uuid; print(uuid.uuid4())')"
failure_payload='{"name":"Portfolio Failure QA","email":"visitor@example.com","topic":"question","message":"QA_FORCE_RESEND_503 simulated provider outage.","website":""}'
status="$(curl --silent --show-error --output "$workdir/failure.json" \
  --write-out '%{http_code}' -H "Origin: $CONTACT_ALLOWED_ORIGIN" \
  -H 'X-Forwarded-For: 198.51.100.23' -H "Idempotency-Key: $failure_key" \
  -H 'Content-Type: application/json' --data "$failure_payload" \
  "$NEXT_PUBLIC_SITE_URL/api/contact")"
[[ "$status" == 200 ]] || { echo "Stored inquiry with provider error returned $status." >&2; exit 1; }
if grep -Eq 'simulated provider outage|re_test_portfolio_local_only' "$workdir/failure.json"; then
  echo "Contact response exposed provider details." >&2
  exit 1
fi

foreign_status="$(curl --silent --show-error -o /dev/null -w '%{http_code}' \
  -H 'Origin: https://foreign.example' -H 'Content-Type: application/json' --data '{}' \
  "$NEXT_PUBLIC_SITE_URL/api/contact")"
[[ "$foreign_status" == 403 ]] || { echo "Foreign origin returned $foreign_status." >&2; exit 1; }

success_state="$("${compose[@]}" exec -T postgres psql -U portfolio -d portfolio -Atqc \
  "SELECT count(*) || '|' || min(d.status) || '|' || min(d.attempt_count)::text || '|' || min(d.provider_message_id) || '|' || min(i.notification_status) FROM inquiries i JOIN email_deliveries d ON d.inquiry_id=i.id WHERE i.idempotency_key='$success_key';")"
[[ "$success_state" =~ ^1\|sent\|1\|qa_[[:alnum:]_-]+\|sent$ ]] || {
  echo "Expected one persisted, sent inquiry with a provider ID; received $success_state." >&2
  exit 1
}
failure_state="$("${compose[@]}" exec -T postgres psql -U portfolio -d portfolio -Atqc \
  "SELECT count(*) || '|' || min(d.status) || '|' || min(d.attempt_count)::text || '|' || min(d.last_error) || '|' || min(i.notification_status) FROM inquiries i JOIN email_deliveries d ON d.inquiry_id=i.id WHERE i.idempotency_key='$failure_key';")"
[[ "$failure_state" == "1|pending|1|resend_server_error|pending" ]] || {
  echo "Provider failure was not safely retained for retry: $failure_state." >&2
  exit 1
}

python3 - "$MOCK_RESEND_CAPTURE" "$success_key" <<'PY'
import json
import sys

messages = json.load(open(sys.argv[1], encoding="utf-8"))
if len(messages) != 1:
    raise SystemExit(f"Expected one provider email after replay; found {len(messages)}.")
provider_id, payload = messages[0]
if payload.get("to") != ["qa-inbox@example.com"]:
    raise SystemExit("Unexpected Resend QA recipient.")
if payload.get("reply_to") != "visitor@example.com":
    raise SystemExit("The visitor address was not set as Reply-To.")
if "Portfolio inquiry — question — Portfolio Resend QA" != payload.get("subject"):
    raise SystemExit("Unexpected email subject.")
if "Local end-to-end delivery verification." not in payload.get("text", ""):
    raise SystemExit("Email omitted the inquiry message.")
if not provider_id.startswith("qa_"):
    raise SystemExit("Fake provider omitted its message identifier.")
print(f"Fake Resend accepted one idempotent email ({provider_id}).")
PY

echo "Contact persistence, idempotent replay, Resend success/failure, private readiness, and origin rejection passed."
