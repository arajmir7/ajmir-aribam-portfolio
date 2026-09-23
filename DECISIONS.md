# Decisions

## 001 — Separate content and inquiry concerns

The portfolio has mostly static editorial content. Next.js renders it with Server Components. A small private FastAPI service exists only for validated, persistent inquiries. This demonstrates a useful backend without inventing accounts or distributed infrastructure.

## 002 — Nonce CSP with dynamic pages

Per-request nonces keep scripts restricted without `unsafe-inline` in production. This gives up static page generation and edge caching for HTML; verify latency under the chosen deployment. The portrait and static assets remain cacheable.

## 003 — Database commit defines form success

SMTP is optional and may fail independently. The API acknowledges only after the inquiry record commits, then attempts SMTP after the response. Operators review pending notification records. This prevents a false success when storage fails and avoids delaying the browser response on SMTP latency.

## 004 — Source-first portfolio copy

Local repository implementations outrank resume marketing lines. Unverified business numbers, uptime, release counts and rankings are omitted. Case diagrams describe inspected code boundaries, not guessed live topology. `TODO_OWNER_VERIFY` remains in content source where confirmation is needed.
