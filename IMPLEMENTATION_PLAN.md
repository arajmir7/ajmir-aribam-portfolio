# Implementation plan

Each milestone is independently verifiable. Record any unmet criterion in `RELEASE_CERTIFICATION.md`.

## 1. Evidence and content contract

**Scope:** Inventory sources, classify claims, establish route content and source links.
**Files/systems:** `PORTFOLIO_SPEC.md`, `src/content/*`, project repositories (read only).
**Acceptance:** No unsupported metrics or ownership claims; Labs prototype is labeled; unknowns use `TODO_OWNER_VERIFY` in source.
**Validation:** `rg 'TODO_OWNER_VERIFY|uptime|traffic|revenue|customers' src/content PORTFOLIO_SPEC.md`; inspect source references.

## 2. Design and complete route system

**Scope:** Original responsive visual system, all named routes, case studies, technical drawings, photo, metadata, 404/loading/error.
**Files/systems:** `src/app`, `src/components`, `src/content`, `public`.
**Acceptance:** Navigation and calls to action work, all cases have specific evidence, mobile layouts are readable, both themes retain contrast.
**Validation:** `npm run lint && npm run typecheck && npm run build`; Playwright viewport and route checks.

## 3. Inquiry service

**Scope:** FastAPI validation, spam handling, throttling, persistence, health/readiness, same-origin web adapter.
**Files/systems:** `api`, `src/app/api/contact`, `src/components/contact-form.tsx`, Compose.
**Acceptance:** Valid inquiry commits; malformed/spam/rate-limited requests do not; error state is clear; messages and unnecessary PII are absent from logs.
**Validation:** `cd api && uv run pytest`; `uv run alembic upgrade head` against empty DB; browser contact journey.

## 4. Production gates and operations

**Scope:** Security headers, structured logging, CI, E2E/accessibility/security checks, deploy docs, certification.
**Files/systems:** `.github/workflows`, scripts, tests, Dockerfiles, operations/security docs.
**Acceptance:** All runnable gates pass; limitations and environment-dependent checks are declared accurately.
**Validation:** `npm run verify`; `npm audit --audit-level=high`; `docker compose build`; `git diff --check`; CI workflow.
