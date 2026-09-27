# Contact and email delivery

## Request lifecycle

The browser posts to the same-origin `/api/contact` route. Next.js checks the exact configured origin, size and contact-service settings, then forwards the payload, request identifier, idempotency key and trusted-proxy-derived client address over the private network. FastAPI validates the fields, enforces its PostgreSQL rate window and atomically writes the inquiry plus one `pending` row to `email_deliveries`. A `200` response means both records committed; it does not mean email was sent.

The independent worker claims eligible rows using PostgreSQL `FOR UPDATE SKIP LOCKED`, records `attempting`, `attempt_count` and `last_attempt_at`, then connects to configured SMTP with certificate-verified STARTTLS (or implicit TLS on port 465). SMTP authentication is used when both username and password are set. The message uses configured `EMAIL_FROM`, configured `EMAIL_TO`, the subject `Portfolio enquiry — <topic> — <name>`, plain-text content, and the visitor's validated address as `Reply-To`. It includes the complete message, inquiry ID, UTC submission time and validated source origin. Visitor content is never inserted into an HTML email.

Temporary connection/server failures return to `pending` with 30-second, 2-minute, 10-minute and 30-minute backoff; the fifth failed attempt is terminal. Permanent authentication, sender/recipient, TLS and 5xx failures immediately become `failed`. A worker crash leaves an `attempting` lease; after two minutes another worker can reclaim it. `sent_at` is set only after SMTP accepts the message and the state update commits. Errors are limited to fixed codes such as `smtp_connection_failed`; SMTP response text, message bodies, names, addresses and credentials are never written to logs or error fields.

The unique `Inquiry.idempotency_key` and unique delivery-per-inquiry constraint mean a repeated request with the same key/payload does not enqueue a second message. Reusing the key for different details returns `409`. The web form retains its key while retrying unchanged details and clears it when the visitor edits the form or succeeds. The legacy `notification_status` column remains for application rollback compatibility and mirrors the final outbox state. SMTP is not an exactly-once protocol: if a process dies after the SMTP server accepts a message but before PostgreSQL records `sent`, lease recovery can send it again. Queue idempotency prevents duplicate work records and concurrent processing, but cannot make that external side effect transactional.

## Configuration and readiness

Set these at runtime on both the API and worker services. Never set them as frontend `NEXT_PUBLIC_*` values.

| Variable         | Required when enabling email | Meaning                                                                                    |
| ---------------- | ---------------------------- | ------------------------------------------------------------------------------------------ |
| `EMAIL_HOST`     | Yes                          | SMTP provider hostname.                                                                    |
| `EMAIL_PORT`     | Yes                          | Provider submission port; usually `587` for STARTTLS or `465` for implicit TLS.            |
| `EMAIL_USER`     | Optional                     | SMTP authentication username; set together with `EMAIL_PASSWORD`.                          |
| `EMAIL_PASSWORD` | Optional                     | Secret SMTP credential; set together with `EMAIL_USER`.                                    |
| `EMAIL_FROM`     | Yes                          | Verified sender mailbox/name, supplied by the provider.                                    |
| `EMAIL_TO`       | Yes                          | Owner mailbox or comma-separated recipient list.                                           |
| `EMAIL_USE_TLS`  | Yes in production            | Must be `true` in production. Development Mailpit may use `false` on loopback port `1025`. |

When all mail values are empty, `/health/ready` remains `200` if the database/API are ready and reports `email_delivery: not_configured`; accepted inquiries remain in `pending`. Partial or unsafe configuration reports `misconfigured` and the worker does not attempt delivery. `configured` means the settings pass structural validation; it does not establish SMTP reachability, mailbox acceptance, or inbox delivery. The same health result reports aggregate `pending`, `attempting`, `sent` and `failed` counts without exposing inquiry data. The frontend exposes those non-sensitive readiness fields at `/api/health`.

## Local capture and failure checks

`make dev` starts the Mailpit SMTP and web UI ports bound only to loopback. It uses the local test inbox at `http://localhost:8025`; it cannot relay those messages to a real address. `make email-qa` creates a disposable PostgreSQL database and Mailpit instance, submits through the local Next.js `/api/contact` route twice using the same idempotency key, confirms one inquiry and one `sent` delivery with one attempt, and checks the captured message subject/recipient/body. The automated PostgreSQL integration test forces SMTP failure after persistence and confirms that one inquiry remains with a retryable `pending` delivery and sanitized error code.

To check the state on an authorized service shell (these commands can reveal contact metadata; restrict shell access):

```sh
python -m app.maintenance email-status
python -m app.maintenance deliveries --status pending --limit 50
python -m app.maintenance deliveries --status attempting --limit 50
python -m app.maintenance deliveries --status failed --limit 50
python -m app.maintenance recent-inquiries --limit 20
```

Retry only after correcting the SMTP problem, using the failed delivery's UUID:

```sh
python -m app.maintenance retry-delivery --delivery-id '<delivery UUID>'
```

The retry preserves the inquiry/delivery identity, resets the attempt budget for an operator-approved retry, and leaves the row queued for the worker. Confirm its eventual status in `email-status` or `deliveries`. Successful API acceptance is not an email success signal; contact the owner through another verified channel if an outbox row reaches `failed`.

For an authorized PostgreSQL shell, these read-only queries expose only operational metadata, not visitor contact information:

```sql
SELECT status, count(*) AS deliveries
FROM email_deliveries
GROUP BY status
ORDER BY status;

SELECT d.id AS delivery_id,
       i.id AS inquiry_id,
       i.created_at AS inquiry_created_at,
       i.topic,
       d.status,
       d.attempt_count,
       d.last_attempt_at,
       d.sent_at,
       d.last_error
FROM email_deliveries AS d
JOIN inquiries AS i ON i.id = d.inquiry_id
ORDER BY i.created_at DESC
LIMIT 50;
```

The matching inquiry is retained for a recent record lookup without selecting its name, email or message:

```sql
SELECT id, created_at, topic, request_id
FROM inquiries
ORDER BY created_at DESC
LIMIT 20;
```

## Render service handoff

Render runs `portfolio-api` privately and a separate `portfolio-email-worker` background worker. Both use the same limited PostgreSQL runtime account and the API's secret SMTP settings; the worker has no public HTTP endpoint. The Blueprint's API pre-deploy command creates/grants the runtime role and applies Alembic migrations before API replacement. The worker uses that same image and database but runs `python -m app.delivery_worker`. Configure provider-generated credentials in Render's secret environment, not in Git. Before enabling contact publicly, set all mail variables on the API and verify the worker receives their references; check `email_delivery: configured`, then make one owner-approved test and verify the PostgreSQL delivery and provider test inbox.

The repository cannot prove Render worker startup, provider SMTP acceptance, mailbox delivery, or spam-folder behavior before an owner configures the account and supplies credentials. Keep the health state and database record as separate evidence.
