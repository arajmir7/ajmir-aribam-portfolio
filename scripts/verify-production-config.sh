#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$root/backend"

env \
  APP_ENV=production \
  VERCEL_ENV=production \
  MIGRATION_DATABASE_URL= \
  DATABASE_URL='postgresql+psycopg://portfolio_app:verification-only-password@ep-calm-sunset-pooler.us-east-2.aws.neon.tech/portfolio?sslmode=require' \
  CONTACT_INTERNAL_TOKEN='verification-only-internal-token-with-32-characters' \
  CONTACT_ALLOWED_ORIGIN='https://ajmiraribam.me' \
  VERCEL_GIT_COMMIT_SHA=0123456789abcdef0123456789abcdef01234567 \
  RESEND_API_KEY='re_verification_only_key_12345678901234567890' \
  CONTACT_EMAIL_FROM='Ajmir Aribam <contact@ajmiraribam.me>' \
  CONTACT_EMAIL_TO=arajmir7@gmail.com \
  uv run python -c 'from app.main import app; from app.core.config import get_settings; assert app.title == "Portfolio inquiry service"; assert get_settings().environment == "production"'

if env -u APP_ENV -u DATABASE_URL -u MIGRATION_DATABASE_URL \
  VERCEL_ENV=production \
  uv run python -c 'from app.core.config import get_settings; get_settings()' \
  >/dev/null 2>&1; then
  echo "Vercel production accepted missing configuration." >&2
  exit 1
fi

if env \
  APP_ENV=development \
  VERCEL_ENV=production \
  MIGRATION_DATABASE_URL= \
  uv run python -c 'from app.core.config import get_settings; get_settings()' \
  >/dev/null 2>&1; then
  echo "Vercel production accepted development mode." >&2
  exit 1
fi

echo "Production configuration loads with valid settings and fails closed when missing or downgraded."
