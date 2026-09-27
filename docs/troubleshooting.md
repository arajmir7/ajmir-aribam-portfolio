# Troubleshooting

## Vercel Services build or FastAPI service does not start

Check the project uses the repository root, Services framework access is enabled, and `vercel.json` lists the FastAPI root and `app.main:app` entrypoint. Set Python 3.12 if requested, enable the system commit-SHA variable, and set `APP_ENV=production`. The service intentionally fails startup if database, origin, token, revision, or Resend settings are missing. Do not fix a production failure by enabling development mode or SQLite.

## Frontend reports the contact service unavailable

Check that the frontend binding in `vercel.json` targets the backend service and injects `CONTACT_API_URL`. Bindings resolve at runtime, not during builds. Verify Vercel Services access, the deployment's binding configuration, and matching `CONTACT_ALLOWED_ORIGIN` and internal token values on both services. The frontend `/api/health` deliberately returns no private API details. Do not set `CONTACT_API_URL` manually or expose the token in browser variables or logs.

## Contact request is stored but no email arrived

The form acknowledges a successfully persisted inquiry even if Resend is unavailable. Inspect email-status and the relevant pending/failed delivery from a restricted shell. Verify the Resend API key, verified sender, recipient, provider dashboard, and database delivery state. Correct the cause, then retry a failed delivery by UUID or dispatch due pending work. Provider acceptance is not proof of inbox placement.

## Vercel rejects a domain or TLS is pending

Compare apex and www DNS records with the exact current values shown in the Vercel project. Remove conflicting web records only; preserve MX/TXT records for email. Do not use remembered IP/CNAME values or place a proxy in front of Vercel. Wait for ownership verification and certificate issuance, then run the production smoke script.

## Migration or database access fails

Use the direct Neon migration URL only from a trusted shell; runtime DATABASE_URL should be the pooled endpoint and application role. Check TLS, credentials, database, schema usage, DML, and sequence grants. Apply migrations with Alembic, then run alembic check. Do not use the owner role as runtime credentials or edit applied migration history.
