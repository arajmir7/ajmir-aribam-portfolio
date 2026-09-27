# Troubleshooting

## FastAPI function does not start

Check the Vercel project root is backend, Python is 3.12, the system commit-SHA variable is enabled, and APP_ENV=production is set for Production. The service intentionally fails startup if the required database, origin, token, revision, or Resend settings are missing. Do not fix a production failure by enabling development mode or SQLite.

## Frontend reports the contact service unavailable

Check the frontend project root is frontend and its Production CONTACT_API_URL is https://api.ajmiraribam.me. Verify the API project's custom domain, TLS, and /health/live; compare CONTACT_ALLOWED_ORIGIN and the internal token in both projects. The frontend /api/health deliberately returns no private API details. Do not expose the token in browser variables or logs.

## Contact request is stored but no email arrived

The form acknowledges a successfully persisted inquiry even if Resend is unavailable. Inspect email-status and the relevant pending/failed delivery from a restricted shell. Verify the Resend API key, verified sender, recipient, provider dashboard, and database delivery state. Correct the cause, then retry a failed delivery by UUID or dispatch due pending work. Provider acceptance is not proof of inbox placement.

## Vercel rejects a domain or TLS is pending

Compare each apex, www, and API DNS record with the current value shown in the corresponding Vercel project. Remove conflicting web records only; preserve MX/TXT records for email. Do not use remembered IP/CNAME values or place a proxy in front of Vercel. Wait for ownership verification and certificate issuance, then run the production smoke script.

## Migration or database access fails

Use the direct Neon migration URL only from a trusted shell; runtime DATABASE_URL should be the pooled endpoint and application role. Check TLS, credentials, database, schema usage, DML, and sequence grants. Apply migrations with Alembic, then run alembic check. Do not use the owner role as runtime credentials or edit applied migration history.
