# Repository guidance

- `frontend/` owns Next.js routes, presentation, assets, and browser tests. `backend/` owns the private inquiry API, persistence, migrations, and API tests. Integration occurs over HTTP; neither application imports the other's implementation.
- Before changing Next.js behavior, read the matching guide in `frontend/node_modules/next/dist/docs/`; avoid relying on older framework conventions.
- Preserve the evidence-backed case studies and the Labs prototype label. Keep unknown professional facts as `TODO_OWNER_VERIFY` in content source.
- Keep the public `/api/contact` route and private `/inquiries`, `/health/live`, and `/health/ready` contracts stable unless a change includes compatibility and tests.
- Run `make verify` before claiming a local release gate. `RELEASE_CERTIFICATION.md` must distinguish local results from production deployment.
- Keep generated files, secrets, local databases, and test output out of Git. Do not push or deploy without the user's authorization.
