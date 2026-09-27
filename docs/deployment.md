# Manual deployment: Vercel, Neon, and Resend

This guide prepares two Vercel projects from one Git repository. It does not deploy, connect accounts, alter DNS, or perform a live email test. The canonical origin is `https://ajmiraribam.me`; `www` redirects to the apex. Vercel currently documents Python as Beta on all plans, so confirm its support and your account's plan limits before launch ([runtime status](https://vercel.com/docs/functions/runtimes/python)).

## 1. Create Neon database and roles

Create a Neon project in a region near Vercel, then create the production database and separate migration/application roles. Copy the pooled connection URI for the application role from Neon and require `sslmode=require`. `DATABASE_URL` must use the pooled hostname containing `-pooler.`. Keep the direct migration URI in a password manager or protected local environment; never add it to Vercel. Neon supports pooled URI generation through its [connection URI API](https://api-docs.neon.tech/reference/getconnectionuri).

Grant the application role only database `CONNECT`, schema `USAGE`, table `SELECT/INSERT/UPDATE/DELETE`, and required sequence privileges. Grant default privileges for future tables and sequences created by the migration role. Do not use the owner role as the runtime user.

## Existing Render data, if any

No Render account credentials or database snapshot were provided, so no existing inquiries have been transferred. If the old database contains records that must be retained, do this before public cutover: pause old contact writes and stop its mail worker; create a consistent source dump in a private, access-restricted directory; restore it into a new empty Neon branch/database; apply current Alembic migrations using the direct migration URI; and compare table counts, Alembic revision, and selected records from a trusted shell. Do not copy database URLs or inquiry data into GitHub, tickets, or logs. Verify pending/attempting email rows and coordinate whether they should be dispatched through Resend before enabling the new contact form. Keep the source database intact until the owner verifies the transfer and recovery path.

## 2. Configure the Vercel frontend project

Import the repository and set Root Directory to `frontend`, Framework Preset to Next.js, Node.js version to 24, and enable Vercel System Environment Variables so the Git commit SHA is present. Use the default build command and output settings.

Set these Preview/Production environment variables on the frontend project:

| Variable                   | Value                                                       |
| -------------------------- | ----------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`     | `https://ajmiraribam.me`                                    |
| `CONTACT_ALLOWED_ORIGIN`   | `https://ajmiraribam.me`                                    |
| `CONTACT_API_URL`          | `https://api.ajmiraribam.me`                                |
| `CONTACT_INTERNAL_TOKEN`   | Random 32+ character secret, also configured on API project |
| `CONTACT_CLIENT_IP_HEADER` | `x-forwarded-for`                                           |
| `BUILD_REVISION`           | Optional when Vercel provides the Git commit SHA            |

Only `NEXT_PUBLIC_SITE_URL` is public. The internal token must remain server-side. Use isolated Preview credentials and origin, or keep contact disabled in Preview; never copy production secrets to Preview.

## 3. Configure the Vercel FastAPI project

Import the same repository as a second Vercel project. Set Root Directory to `backend`, Python version to 3.12, and enable Vercel System Environment Variables. The Python entry point is `app.main:app` from `backend/pyproject.toml`.

Set these Production variables on the backend project:

| Variable                 | Value                                                             |
| ------------------------ | ----------------------------------------------------------------- |
| `APP_ENV`                | `production`                                                      |
| `DATABASE_URL`           | Neon pooled application-role URI with TLS                         |
| `CONTACT_INTERNAL_TOKEN` | Same random secret as frontend project                            |
| `CONTACT_ALLOWED_ORIGIN` | `https://ajmiraribam.me`                                          |
| `RESEND_API_KEY`         | Resend API key                                                    |
| `CONTACT_EMAIL_FROM`     | Verified sender, such as `Ajmir Aribam <contact@verified-domain>` |
| `CONTACT_EMAIL_TO`       | `arajmir7@gmail.com`                                              |
| `BUILD_REVISION`         | Optional if Vercel provides the Git commit SHA                    |

Do not configure `MIGRATION_DATABASE_URL` on the application, or set database/Resend credentials on the frontend. Production configuration fails closed when required settings are missing.

## 4. Apply Alembic migrations before traffic

Use Python 3.12/uv from a trusted shell and the direct Neon migration URI. Apply and check the schema before enabling production traffic:

```sh
cd backend
MIGRATION_DATABASE_URL='postgresql+psycopg://<migration-role>:<password>@<direct-neon-host>/<database>?sslmode=require' uv run alembic upgrade head
MIGRATION_DATABASE_URL='postgresql+psycopg://<migration-role>:<password>@<direct-neon-host>/<database>?sslmode=require' uv run alembic check
```

Avoid shell history/transcript exposure; prefer a protected environment file or secret manager. Confirm the database reports migration `003_resend_message_id`. Migrations are explicit and are not run during application startup.

## 5. Set up Resend

Create a Resend account and API key; add the key only to the backend project. Add and verify a sending domain, and publish exactly the SPF/DKIM DNS records Resend provides. Preserve existing MX/TXT records. Set `CONTACT_EMAIL_FROM` to a verified sender and `CONTACT_EMAIL_TO=arajmir7@gmail.com`. Visitor email remains `Reply-To`, never `From`.

## 6. Attach domains and TLS

Add `ajmiraribam.me` and `www.ajmiraribam.me` to the frontend project, with the apex primary. Add `api.ajmiraribam.me` to the backend project. Copy the exact A/ALIAS/CNAME records displayed in Vercel project settings; do not rely on guessed values because records can depend on the project and may change. Remove only conflicting web records, preserve mail records, and do not put an unverified proxy/CDN in front of Vercel. Wait for Vercel to verify domains and issue managed TLS. The app redirects `www` to the apex while preserving path and query.

## 7. Deploy, smoke, and approve a live contact test

Require `.github/workflows/ci.yml` to pass for the exact commit. In each Vercel project's Deployments view, create/promote a production deployment from that same commit; record its full SHA and deployment URL. Check backend `/health/live`; unauthenticated `/health/ready` must return `403`. Frontend `/api/health` must report `ready` with only `status` and `revision`.

Run `PRODUCTION_URL=https://ajmiraribam.me EXPECTED_REVISION=<full SHA> bash scripts/production-smoke.sh` from a trusted runner. Then obtain owner approval for one real inquiry. Verify one Neon inquiry/outbox row, delivery state and provider ID, owner inbox receipt, visitor `Reply-To`, and logs free of secrets and inquiry content. A successful form response means the inquiry is durably saved even if delivery later needs retry.

Set GitHub repository variables `PRODUCTION_URL=https://ajmiraribam.me` and `PRODUCTION_REVISION=<full SHA>` for scheduled public smoke checks. Configure owner alerts for Vercel deploy/function failures, Neon availability/storage/connection pressure, Resend delivery failures, and failed Actions runs; this repository does not configure external alert destinations.

## 8. Backups and rollback

Confirm the Neon plan's recovery window, retention, and export/restore options. Before launch, take an owner-approved backup/export, restore it to a new isolated database/branch, verify its Alembic revision and known data, and record evidence. `make verify` tests local backup/checksum/restore tooling only, not a Neon account. Roll back frontend and API to compatible Vercel deployments together. Prefer forward corrective migrations; do not automatically downgrade production. Recover data into a separate Neon branch/database, validate, then switch connections in a controlled window.

No Vercel/Neon/Resend account, DNS, TLS, deployment, backup schedule, alert, or live email delivery is asserted as configured by this repository.
