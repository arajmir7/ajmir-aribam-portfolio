#!/usr/bin/env bash
set -euo pipefail

origin="${PRODUCTION_URL:-}"
expected_revision="${EXPECTED_REVISION:-}"

if [[ ! "$origin" =~ ^https://[^/]+$ ]]; then
  echo "PRODUCTION_URL must be one HTTPS origin without a trailing slash or path." >&2
  exit 1
fi
if [[ "$origin" != "https://ajmiraribam.me" ]]; then
  echo "PRODUCTION_URL must be https://ajmiraribam.me." >&2
  exit 1
fi
host="${origin#https://}"
if [[ "$host" == www.* ]]; then
  echo "PRODUCTION_URL must be the canonical apex origin, not its www alias." >&2
  exit 1
fi
if [[ ! "$expected_revision" =~ ^[0-9a-fA-F]{40}$ ]]; then
  echo "EXPECTED_REVISION must be the full deployed Git commit SHA." >&2
  exit 1
fi
workdir="$(mktemp -d)"
cleanup() { rm -rf "$workdir"; }
trap cleanup EXIT

fetch() {
  local path="$1"
  local output="$2"
  curl --fail --silent --show-error --location --proto '=https' --tlsv1.2 \
    --connect-timeout 10 --max-time 30 "$origin$path" --output "$output"
}

for path in / /work /engineering /about /contact /resume /notes /privacy; do
  file="$workdir/$(printf '%s' "$path" | tr '/' '_' | sed 's/^_$/home/')"
  fetch "$path" "$file"
  [[ -s "$file" ]] || { echo "$path returned an empty body" >&2; exit 1; }
done

curl --fail --silent --show-error --location --proto '=https' --tlsv1.2 \
  --connect-timeout 10 --max-time 30 --dump-header "$workdir/headers" \
  "$origin/" --output "$workdir/home"
for header in content-security-policy strict-transport-security x-content-type-options referrer-policy; do
  grep -qi "^${header}:" "$workdir/headers" || {
    echo "Homepage response is missing $header." >&2
    exit 1
  }
done
for header in permissions-policy x-frame-options; do
  grep -qi "^${header}:" "$workdir/headers" || {
    echo "Homepage response is missing $header." >&2
    exit 1
  }
done
grep -Eq "rel=\"canonical\" href=\"${origin}/?\"" "$workdir/home" || {
  echo "Homepage canonical does not match $origin/." >&2
  exit 1
}

check_redirect() {
  local url="$1"
  local path="$2"
  local headers="$3"
  local status
  local location
  status="$(curl --silent --show-error --output /dev/null --dump-header "$headers" \
    --write-out '%{http_code}' --max-redirs 0 --connect-timeout 10 --max-time 30 \
    "$url$path")"
  case "$status" in
    301|302|307|308) ;;
    *) echo "$url$path returned $status instead of a permanent redirect." >&2; exit 1 ;;
  esac
  location="$(awk 'tolower($1) == "location:" {sub(/\r$/, "", $2); print $2; exit}' "$headers")"
  case "$location" in
    "$origin"|"$origin/"|"$origin/"*) ;;
    *) echo "Redirect did not resolve to $origin: $location" >&2; exit 1 ;;
  esac
}

check_redirect "http://$host" "/about" "$workdir/http-redirect"
check_redirect "https://www.$host" "/work?canonical-check=1" "$workdir/www-redirect"

fetch /robots.txt "$workdir/robots"
fetch /sitemap.xml "$workdir/sitemap"
grep -Fq "$origin/sitemap.xml" "$workdir/robots" || {
  echo "robots.txt does not advertise the canonical sitemap." >&2
  exit 1
}
grep -Fq "<loc>$origin/</loc>" "$workdir/sitemap" || {
  echo "sitemap.xml does not contain the canonical homepage." >&2
  exit 1
}

fetch /api/health "$workdir/health"
grep -Eq '"status"[[:space:]]*:[[:space:]]*"ready"' "$workdir/health" || {
  echo "Public readiness endpoint is not ready." >&2
  exit 1
}
grep -Fq "\"revision\":\"$expected_revision\"" "$workdir/health" || {
  echo "Health revision does not match EXPECTED_REVISION." >&2
  exit 1
}
if grep -Eq '"(database|email_delivery|outbox)"[[:space:]]*:' "$workdir/health"; then
  echo "Public health endpoint exposed internal infrastructure state." >&2
  exit 1
fi

contact_status="$(curl --silent --show-error --output "$workdir/contact-error" \
  --write-out '%{http_code}' --proto '=https' --tlsv1.2 \
  --connect-timeout 10 --max-time 30 \
  -H "Origin: $origin" -H 'Content-Type: application/json' \
  --data '{}' "$origin/api/contact")"
[[ "$contact_status" == "422" ]] || {
  echo "Same-origin invalid contact payload returned $contact_status instead of 422." >&2
  exit 1
}
contact_status="$(curl --silent --show-error --output "$workdir/contact-origin-error" \
  --write-out '%{http_code}' --proto '=https' --tlsv1.2 \
  --connect-timeout 10 --max-time 30 \
  -H 'Origin: https://invalid-origin.example' -H 'Content-Type: application/json' \
  --data '{}' "$origin/api/contact")"
[[ "$contact_status" == "403" ]] || {
  echo "Foreign-origin contact request returned $contact_status instead of 403." >&2
  exit 1
}

for asset in /icon.svg /apple-icon.png /opengraph-image; do
  fetch "$asset" "$workdir/asset-$(printf '%s' "$asset" | tr '/' '_')"
done

status="$(curl --silent --show-error --output /dev/null --write-out '%{http_code}' \
  --proto '=https' --tlsv1.2 --connect-timeout 10 --max-time 30 \
  "$origin/this-route-must-not-exist")"
[[ "$status" == "404" ]] || { echo "Unknown route returned $status instead of 404." >&2; exit 1; }

echo "Production smoke passed for $origin at revision $expected_revision; redirects, routes, frontend revision, headers, SEO, assets, and contact rejection checked."
