#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
workdir="$(mktemp -d)"
compose=(docker compose -f "$root/compose.yaml" -f "$root/infra/compose.dev.yaml")
export COMPOSE_PROJECT_NAME="portfolio_email_qa_$$"
export POSTGRES_PASSWORD=portfolio_email_qa_migration_password_32_chars
export DATABASE_RUNTIME_USER=portfolio_app
export DATABASE_RUNTIME_PASSWORD=portfolio_email_qa_runtime_password_32_chars
export CONTACT_INTERNAL_TOKEN=portfolio_email_qa_internal_token_32_chars
export APP_ENV=development
export BUILD_REVISION="$(git -C "$root" rev-parse --short HEAD)"
export PORTFOLIO_DB_PORT="$(python3 -c 'import socket; s=socket.socket(); s.bind(("127.0.0.1", 0)); print(s.getsockname()[1]); s.close()')"
export PORTFOLIO_MAIL_SMTP_PORT="$(python3 -c 'import socket; s=socket.socket(); s.bind(("127.0.0.1", 0)); print(s.getsockname()[1]); s.close()')"
export PORTFOLIO_MAIL_UI_PORT="$(python3 -c 'import socket; s=socket.socket(); s.bind(("127.0.0.1", 0)); print(s.getsockname()[1]); s.close()')"
export PORT="$(python3 -c 'import socket; s=socket.socket(); s.bind(("127.0.0.1", 0)); print(s.getsockname()[1]); s.close()')"
export PORTFOLIO_API_PORT="$(python3 -c 'import socket; s=socket.socket(); s.bind(("127.0.0.1", 0)); print(s.getsockname()[1]); s.close()')"
export NEXT_PUBLIC_SITE_URL="http://127.0.0.1:${PORT}"
export CONTACT_ALLOWED_ORIGIN="$NEXT_PUBLIC_SITE_URL"
export CONTACT_API_URL="http://127.0.0.1:${PORTFOLIO_API_PORT}"
export CONTACT_CLIENT_IP_HEADER=x-forwarded-for
export EMAIL_HOST=127.0.0.1
export EMAIL_PORT="$PORTFOLIO_MAIL_SMTP_PORT"
export EMAIL_USER=
export EMAIL_PASSWORD=
export EMAIL_FROM='Portfolio QA <no-reply@example.com>'
export EMAIL_TO=qa-inbox@example.com
export EMAIL_USE_TLS=false
export MIGRATION_DATABASE_URL="postgresql+psycopg://portfolio:${POSTGRES_PASSWORD}@127.0.0.1:${PORTFOLIO_DB_PORT}/portfolio"
export DATABASE_URL="$MIGRATION_DATABASE_URL"

dev_pid=""
cleanup() {
  if [[ -n "$dev_pid" ]]; then
    kill "$dev_pid" >/dev/null 2>&1 || true
    wait "$dev_pid" >/dev/null 2>&1 || true
  fi
  "${compose[@]}" down -v --remove-orphans >/dev/null 2>&1 || true
  rm -rf "$workdir"
}
trap cleanup EXIT

"${compose[@]}" up -d --wait postgres mailpit >/dev/null
(
  cd "$root/backend"
  uv run python -m app.maintenance prepare-runtime-role >/dev/null
  uv run alembic upgrade head >/dev/null
)
export DATABASE_URL="postgresql+psycopg://${DATABASE_RUNTIME_USER}:${DATABASE_RUNTIME_PASSWORD}@127.0.0.1:${PORTFOLIO_DB_PORT}/portfolio"

python3 "$root/scripts/dev.py" >"$workdir/dev.log" 2>&1 &
dev_pid=$!
for attempt in {1..60}; do
  if curl --silent --fail "$NEXT_PUBLIC_SITE_URL/api/health" -o "$workdir/health.json"; then
    break
  fi
  if [[ "$attempt" == 60 ]]; then
    echo "Local contact stack did not become ready." >&2
    exit 1
  fi
  sleep 1
done
python3 - "$workdir/health.json" <<'PY'
import json
import os
import sys

health = json.load(open(sys.argv[1]))
if health.get("status") != "ready" or health.get("database") != "ready":
    raise SystemExit("The local database did not report ready.")
if health.get("email_delivery") != "configured":
    raise SystemExit("The local Mailpit delivery configuration is not ready.")
PY

export QA_IDEMPOTENCY_KEY="$(
  cd "$root/frontend"
  PORTFOLIO_QA_ORIGIN="$NEXT_PUBLIC_SITE_URL" node --input-type=module <<'JS'
import { chromium } from "@playwright/test";

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage();
  const key = crypto.randomUUID();
  await page.addInitScript((value) => {
    Object.defineProperty(Crypto.prototype, "randomUUID", {
      configurable: true,
      value: () => value,
    });
  }, key);
  await page.goto(`${process.env.PORTFOLIO_QA_ORIGIN}/contact`);
  await page.getByLabel("Name", { exact: true }).fill("Portfolio Mailpit QA");
  await page.getByLabel("Email", { exact: true }).fill("visitor@example.com");
  await page.getByLabel("Topic").selectOption("question");
  const request = page.waitForRequest("**/api/contact");
  await page.getByLabel("Message").fill(`Local isolated QA marker ${key}.`);
  await page.getByRole("button", { name: /Send inquiry/ }).click();
  const contactRequest = await request;
  await page.getByRole("status").getByText("Your inquiry is safely recorded").waitFor();
  if (contactRequest.headers()["idempotency-key"] !== key) {
    throw new Error("The contact form did not forward the expected idempotency key.");
  }
  process.stdout.write(key);
} finally {
  await browser.close();
}
JS
)"
python3 - "$workdir/payload.json" <<'PY'
import json
import os
import sys

with open(sys.argv[1], "w") as payload_file:
    json.dump(
        {
            "name": "Portfolio Mailpit QA",
            "email": "visitor@example.com",
            "topic": "question",
            "message": f"Local isolated QA marker {os.environ['QA_IDEMPOTENCY_KEY']}.",
            "website": "",
        },
        payload_file,
    )
PY
status="$(curl --silent --show-error --output "$workdir/response.json" \
  --write-out '%{http_code}' \
  -H "Origin: $CONTACT_ALLOWED_ORIGIN" \
  -H 'X-Forwarded-For: 198.51.100.19' \
  -H "Idempotency-Key: $QA_IDEMPOTENCY_KEY" \
  -H 'Content-Type: application/json' \
  --data-binary "@$workdir/payload.json" \
  "$NEXT_PUBLIC_SITE_URL/api/contact")"
[[ "$status" == 200 ]] || { echo "Idempotent replay returned $status." >&2; exit 1; }

for attempt in {1..30}; do
  result="$("${compose[@]}" exec -T postgres psql -U portfolio -d portfolio -Atqc \
    "SELECT d.status || '|' || d.attempt_count || '|' || COALESCE(d.last_error, '') || '|' || count(*) OVER () || '|' || COALESCE(i.source_origin, '') || '|' || i.notification_status FROM inquiries i JOIN email_deliveries d ON d.inquiry_id = i.id WHERE i.idempotency_key = '$QA_IDEMPOTENCY_KEY';")"
  if [[ "$result" == "sent|1||1|$CONTACT_ALLOWED_ORIGIN|sent" ]]; then break; fi
  sleep 1
done
[[ "$result" == "sent|1||1|$CONTACT_ALLOWED_ORIGIN|sent" ]] || {
  echo "PostgreSQL did not show one sent delivery for the inquiry." >&2
  exit 1
}

python3 - "$PORTFOLIO_MAIL_UI_PORT" "$QA_IDEMPOTENCY_KEY" <<'PY'
import json
import os
import sys
import time
import urllib.error
import urllib.request

base = f"http://127.0.0.1:{sys.argv[1]}"
marker = sys.argv[2]
for _ in range(30):
    try:
        with urllib.request.urlopen(f"{base}/api/v1/messages", timeout=2) as response:
            inbox = json.load(response)
        messages = inbox.get("messages", [])
        if len(messages) == 1:
            message = messages[0]
            detail_id = message.get("ID")
            with urllib.request.urlopen(
                f"{base}/api/v1/message/{detail_id}", timeout=2
            ) as response:
                detail = json.load(response)
            if (
                detail.get("Subject") == "Portfolio enquiry — question — Portfolio Mailpit QA"
                and any(
                    recipient.get("Address") == "qa-inbox@example.com"
                    for recipient in detail.get("To", [])
                )
                and any(
                    recipient.get("Address") == "visitor@example.com"
                    for recipient in detail.get("ReplyTo", [])
                )
                and marker in detail.get("Text", "")
                and "Inquiry ID: " in detail.get("Text", "")
                and "Submitted at (UTC): " in detail.get("Text", "")
                and f"Origin: {os.environ['CONTACT_ALLOWED_ORIGIN']}" in detail.get("Text", "")
            ):
                print(f"Mailpit captured the expected test inquiry (message {detail_id}).")
                break
    except (OSError, urllib.error.URLError, json.JSONDecodeError):
        pass
    time.sleep(1)
else:
    raise SystemExit("Mailpit did not contain the expected test inquiry.")
PY

echo "PostgreSQL inquiry/outbox idempotency and local Mailpit delivery passed."
echo "With make dev, inspect its local test inbox at http://localhost:8025."
