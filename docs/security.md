# Security and privacy

## Trust boundaries

The browser sends inquiry JSON to the same-origin Next.js route. That route validates the exact Origin and size, assigns a request ID, then sends the request and an internal token to private FastAPI. FastAPI is the authority for request validation, database-backed rate limits and persistence. PostgreSQL accepts connections only from the private network in the Render blueprint. The browser never receives API or database credentials.

## Implemented controls

- Production API configuration fails closed unless it has PostgreSQL migration/runtime connections with distinct usernames, strong non-placeholder credentials, a strong internal token, and a valid Git revision.
- Alembic uses the migration connection; API queries use a separate database role intended for DML only. A pre-deploy maintenance command grants that role database connect, schema usage, table DML and sequence access, including future migration-created objects.
- The public contact route enforces exact configured Origin, JSON content type and request size. FastAPI applies authoritative field validation, a honeypot, atomic database-backed rate limiting and inquiry persistence.
- Client IP is consumed only from the explicitly configured trusted proxy header. For Render, the web service uses `x-forwarded-for` and selects the final valid address appended by the platform; earlier values are treated as caller-controlled. Do not use this setting behind a different proxy without verifying its header semantics.
- API writes require a constant-time internal-token comparison. API/database ports are not published in Compose; Render defines the API as private and Postgres with an empty external IP allowlist.
- Responses use a nonce-based Content Security Policy, HSTS, frame denial, content-type protection, strict referrer policy and a permissions policy. Contact logs omit message bodies, email addresses and tokens.
- Docker images run as non-root users where supported. Backup credentials and database URLs are kept in deployment secrets, never Git or browser-visible variables. Backup uploads request SSE-KMS, include checksum and completion marker, and the restore tool refuses a non-empty target.

## Operational limits

Automated checks do not prove Render role permissions, account security, production DNS/TLS, actual backup encryption, retention, delivered alerts, email delivery, or legal/privacy compliance. Create owner-controlled least-privilege database and AWS credentials, inspect one real backup and restore it to an isolated database, configure alert recipients, and review the privacy/retention policy before public launch. See [deployment](deployment.md) and [operations](operations.md).
