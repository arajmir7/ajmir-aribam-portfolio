#!/usr/bin/env bash
set -euo pipefail

origin="${PRODUCTION_URL:-}"
expected_revision="${EXPECTED_REVISION:-}"

if [[ ! "$origin" =~ ^https://[^/]+$ ]]; then
  echo "PRODUCTION_URL must be one HTTPS origin without a trailing slash or path." >&2
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
grep -Fq "rel=\"canonical\" href=\"$origin/\"" "$workdir/home" || {
  echo "Homepage canonical does not match $origin/." >&2
  exit 1
}

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
if [[ -n "$expected_revision" ]]; then
  grep -Fq "\"revision\":\"$expected_revision\"" "$workdir/health" || {
    echo "Health revision does not match EXPECTED_REVISION." >&2
    exit 1
  }
fi

for asset in /icon.svg /apple-icon.png /opengraph-image; do
  fetch "$asset" "$workdir/asset-$(printf '%s' "$asset" | tr '/' '_')"
done

status="$(curl --silent --show-error --output /dev/null --write-out '%{http_code}' \
  --proto '=https' --tlsv1.2 --connect-timeout 10 --max-time 30 \
  "$origin/this-route-must-not-exist")"
[[ "$status" == "404" ]] || { echo "Unknown route returned $status instead of 404." >&2; exit 1; }

echo "Production smoke passed for $origin${expected_revision:+ at revision $expected_revision}."
