# Security model

## Assets and threats

Assets: contact details/messages, service token, database credentials, SMTP credentials, public content integrity. Threats considered: spam and form flooding; stored-message leakage; direct API abuse; cross-site request forgery; XSS from attacker-controlled content; misconfigured proxy headers; credential disclosure; operational logs containing PII.

## Implemented controls

- The private FastAPI write route requires a constant-time compared internal token; Compose exposes neither API nor database publicly.
- Next accepts JSON only, caps body length, checks `Origin` against configured site origin, and forwards only to configured private service. Browser CORS is not enabled on the API.
- Pydantic rejects extra fields and bounds name, email, topic, message and honeypot. Backend validation is authoritative.
- A honeypot silently discards obvious bot submissions. Database-backed rate windows limit each supplied client IP identity to five inquiries per 15 minutes. This requires a trusted reverse proxy to overwrite IP headers.
- Each request has an ID; logs record event/type/topic/opaque inquiry ID, never a full message, secret or email. Generic API errors protect internals.
- Next uses request nonces and a restrictive CSP, plus HSTS, frame denial, content-type sniffing protection, referrer policy and disabled sensitive browser permissions. Public pages render dynamically to receive per-request nonces.
- Secrets are environment inputs and excluded from version control. Containers run without root where practical. Compose binds the web port to localhost for a separate TLS proxy.

## Verification and limits

OWASP ASVS 5.0 is a reference for relevant checks; no compliance claim is made. Automated checks include API negative cases, browser accessibility, dependency audit, secret scan in CI and build verification. A production reverse proxy, TLS, secret manager, IP-header policy, database backups, scheduled retention purge, SMTP configuration and monitoring alerts are deployment gates. The database rate window's first insert can race under simultaneous requests; a unique key prevents duplicate windows but a transient write failure can return 503. Harden with an atomic upsert if traffic requires it.
