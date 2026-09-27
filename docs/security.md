# Security and privacy

The browser posts only to the same-origin Next.js route. Next.js checks exact Origin and size, then calls FastAPI with a server-only token. FastAPI validates the payload and enforces the authoritative rate limit and persistence. Browser code never receives Neon or Resend credentials. Production fails closed when required database, token, origin, revision, or Resend configuration is missing or invalid.

Frontend rate-limit identity uses a single IP from Vercel's normalized `x-forwarded-for`; the code rejects proxy chains instead of guessing the trusted hop. FastAPI receives this address only over the authenticated frontend-to-API request. Do not place an unverified proxy/CDN in front of Vercel or change this trust boundary without review.

Store database URLs and API keys only in Vercel encrypted environment settings or an approved secret manager. The frontend token is server-side and must not use a `NEXT_PUBLIC_` name. Alembic credentials are used from a trusted shell only. Use distinct Neon migration/application roles and TLS; constrain runtime grants to application DML and sequences.

Contact requests are size-bounded, schema-validated, origin-checked, honeypot-checked, rate-limited in PostgreSQL, and idempotent. The inquiry and outbox commit atomically. Resend uses a verified sender, visitor `Reply-To`, plain-text content, stable idempotency keys, bounded retries, safe error codes, and persisted provider IDs. Logs omit message bodies, visitor addresses, authorization values, and provider responses.

Responses include nonce-based CSP, HSTS, frame denial, MIME-sniffing protection, strict referrer policy, and restrictive permissions policy. Local PostgreSQL is bound to loopback. There are no production database or Resend credentials in the repository.

Automated checks cannot verify account security, live DNS/TLS, Neon backup retention, real delivery, alert receipt, or legal/privacy compliance. Owners must configure and test those controls before launch. See [deployment](deployment.md) and [operations](operations.md).
