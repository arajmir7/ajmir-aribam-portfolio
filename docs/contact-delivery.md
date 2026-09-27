# Contact and email delivery

The browser posts to same-origin Next.js `/api/contact`. Next.js checks origin and a streamed body-size limit, then forwards the request, request ID, idempotency key, and a single Vercel-derived client IP to FastAPI using the private Vercel service binding and server-only token. FastAPI validates the payload, applies a database-backed rate limit, and commits the inquiry with one unique `email_deliveries` row. It calls Resend only after that transaction commits.

A `200` response confirms durable inquiry storage, not mailbox delivery. If Resend fails, the inquiry remains stored, a safe fixed error code is saved, and the delivery remains retryable. Structured backend logs also retain the Resend HTTP status, sanitized error type/message, and provider request ID when supplied. Outbound requests identify this contact service with an explicit User-Agent and request JSON responses. The log sanitizer removes configured credentials, inquiry content, names, and addresses; the raw provider response is never stored or logged. State is `pending`, `attempting`, `sent`, or `failed`. The outbox records attempt count, retry time, timestamps, and provider message ID after acceptance. Public health exposes no database or email details; private API readiness requires the internal token.

Messages are plain text and include visitor name, email, topic, complete message, inquiry ID, UTC timestamp, and source origin. `CONTACT_EMAIL_FROM` must be a verified sender; the visitor address is `Reply-To`, never `From`. The subject strips control characters. Credentials and raw provider response bodies are never stored or logged.

Each delivery uses a stable Resend idempotency key based on its outbox UUID. Replays with an unchanged request key return the existing inquiry; changed payload with the same key returns `409`. Resend retains idempotency keys for a limited period, so exactly-once email across arbitrary delays cannot be promised. Retryable failures use bounded backoff. There is no persistent worker process: the request makes the first attempt, and an operator can dispatch due rows from a trusted shell.

Configure `RESEND_API_KEY`, `CONTACT_EMAIL_FROM`, and `CONTACT_EMAIL_TO` only on the backend service in the Vercel project. Use `arajmir7@gmail.com` as the owner recipient and a verified production-domain address as sender. Never put these values in `NEXT_PUBLIC_*` variables.

`make email-qa` uses disposable PostgreSQL and a loopback fake Resend service. It checks persisted success, duplicate replay, provider acceptance, provider ID recording, visitor `Reply-To`, simulated provider failure, safe response content, public health redaction, and foreign-origin rejection. CI does not use production credentials or send real mail.

In a restricted operator shell, inspect safe delivery metadata:

```sh
cd backend
uv run python -m app.maintenance email-status
uv run python -m app.maintenance deliveries --status pending --limit 50
uv run python -m app.maintenance deliveries --status failed --limit 50
uv run python -m app.maintenance retry-delivery --delivery-id '<delivery UUID>'
uv run python -m app.maintenance dispatch-pending --limit 50
```

Retry only after fixing the cause. `retry-delivery` immediately tries again with the same outbox identity and preserves the cumulative attempt count. To send one real test message, the owner must intentionally supply production configuration and run `uv run python -m app.maintenance resend-smoke --confirm-send`. This is never part of CI. A provider acceptance does not prove inbox placement; verify receipt and `Reply-To` separately.
