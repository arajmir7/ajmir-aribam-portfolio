# Implementation plan

Each milestone is independently verifiable. Record any unmet criterion in `RELEASE_CERTIFICATION.md`.

## 1. Evidence and content contract

**Scope:** Inventory sources, classify claims, establish route content and source links.
**Files/systems:** `PORTFOLIO_SPEC.md`, `frontend/src/content/*`, project repositories (read only).
**Acceptance:** No unsupported metrics or ownership claims; Labs prototype is labeled; unknowns use `TODO_OWNER_VERIFY` in source.
**Validation:** `rg 'TODO_OWNER_VERIFY|uptime|traffic|revenue|customers' frontend/src/content PORTFOLIO_SPEC.md`; inspect source references.

## 2. Design and complete route system

**Scope:** Original responsive visual system, all named routes, case studies, technical drawings, photo, metadata, 404/loading/error.
**Files/systems:** `frontend/src/app`, `frontend/src/components`, `frontend/src/features`, `frontend/src/content`, `frontend/public`.
**Acceptance:** Navigation and calls to action work, all cases have specific evidence, mobile layouts are readable, both themes retain contrast.
**Validation:** `make lint && make typecheck && make build`; Playwright viewport and route checks.

## 3. Inquiry service

**Scope:** FastAPI validation, spam handling, throttling, persistence, health/readiness, same-origin web adapter.
**Files/systems:** `backend`, `frontend/src/app/api/contact`, `frontend/src/features/contact/contact-form.tsx`, Compose.
**Acceptance:** Valid inquiry commits; malformed/spam/rate-limited requests do not; error state is clear; messages and unnecessary PII are absent from logs.
**Validation:** `cd backend && uv run pytest`; `bash scripts/verify-postgres.sh` against empty DB; browser contact journey.

## 4. Production gates and operations

**Scope:** Security headers, structured logging, CI, E2E/accessibility/security checks, deploy docs, certification.
**Files/systems:** `.github/workflows`, `scripts/`, application tests and Dockerfiles, `docs/operations.md`, `docs/security.md`.
**Acceptance:** All runnable gates pass; limitations and environment-dependent checks are declared accurately.
**Validation:** `make verify`; CI workflow; `git diff --check`.

## 5. Behavior-preserving monorepo migration (baseline `29b68d7`)

**Scope:** Move the Next application to `frontend/` and FastAPI to `backend/`; put detailed engineering docs in `docs/`; provide root developer commands. Keep public routes, project copy, assets, and API contracts intact.
**Files/systems:** `frontend/`, `backend/`, Playwright backend startup, TypeScript aliases, Docker contexts, Compose, CI, ignore rules, README, `docs/`, and release documentation.
**Acceptance:** The root clearly exposes both application boundaries; no generated files enter Git; no frontend import reaches backend implementation; the prior browser/API behavior and security controls remain intact.
**Validation:** Baseline `npm run verify` and backend checks, then post-move `make verify`; fresh PostgreSQL migration and integration test; isolated Compose readiness/contact smoke; dependency and Gitleaks scans; `git diff --check`; inspect every retained directory.
