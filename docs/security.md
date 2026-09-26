# Security and privacy

## Data and trust boundaries

Contact submissions contain a name, email address, topic, and message. The browser sends them to the same-origin Next.js route. FastAPI is private to the service network and requires an internal token for writes. PostgreSQL stores inquiries and rate-limit windows. The browser does not receive backend credentials.

## Implemented controls

- The API compares the internal token in constant time. Compose does not publish the API or database.
- The web route accepts JSON, limits the request body, checks the exact configured origin, and forwards only to the configured private API.
- Pydantic applies authoritative validation and bounds input fields. A honeypot discards obvious bot submissions.
- PostgreSQL applies an atomic, database-backed rate limit. Forwarded client addresses are used only when an explicitly configured trusted-proxy header is supplied.
- Requests receive an ID. Logs omit message bodies, email addresses, and secrets; API errors do not expose internals.
- The frontend uses a restrictive Content Security Policy with per-request nonces, HSTS, frame denial, content-type sniffing protection, and a strict referrer policy.
- Secrets are supplied by the environment and excluded from version control. Containers run without root where practical.

## Limits and operations

Automated tests and dependency/secret scans are regression checks; they do not establish compliance or eliminate risk. Production requires TLS termination, a trusted proxy policy, managed secret storage, restricted database roles, tested backups, scheduled retention, private inquiry review, and alerting. See [deployment](deployment.md) for release requirements.
