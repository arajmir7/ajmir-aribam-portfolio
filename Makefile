SHELL := /bin/bash

-include .env
export

.PHONY: install dev test lint typecheck e2e build security verify compose-up compose-down format-check compose-smoke email-qa production-smoke production-config-check

install:
	cd frontend && npm ci
	cd backend && uv sync --frozen --group dev

dev:
	@test -n "$(POSTGRES_PASSWORD)" -a -n "$(DATABASE_URL)" -a -n "$(CONTACT_INTERNAL_TOKEN)" || (echo "Copy .env.example to .env and configure the local values." >&2; exit 1)
	@case "$(CONTACT_INTERNAL_TOKEN)" in replace-*|changeme*|example*) echo "Replace the local placeholder CONTACT_INTERNAL_TOKEN first." >&2; exit 1;; esac
	@test "$${#CONTACT_INTERNAL_TOKEN}" -ge 32 || (echo "CONTACT_INTERNAL_TOKEN must contain at least 32 characters." >&2; exit 1)
	docker compose -f compose.yaml -f infra/compose.dev.yaml up -d --wait postgres
	cd backend && uv run alembic upgrade head
	python3 scripts/dev.py

format-check:
	cd frontend && npm run format:check
	cd frontend && npx prettier --check '../README.md' '../docs/*.md' '../compose.yaml' '../infra/*.yaml' '../.github/workflows/*.yml' '../vercel.json'
	cd backend && uv run ruff format --check . ../scripts/*.py
	cd backend && uv lock --check
	python3 -m json.tool frontend/package.json >/dev/null
	python3 -m json.tool vercel.json >/dev/null
	python3 scripts/verify-vercel-services.py

lint:
	cd frontend && npm run lint
	cd backend && uv run ruff check . ../scripts/*.py

typecheck:
	cd frontend && npm run typecheck

test:
	cd frontend && npm run test
	cd backend && uv run pytest -q
	bash scripts/verify-postgres.sh

production-config-check:
	bash scripts/verify-production-config.sh

build:
	cd frontend && NEXT_PUBLIC_SITE_URL=https://ajmiraribam.me npm run build

e2e:
	cd frontend && npm run e2e

security:
	cd frontend && npm audit --audit-level=high
	cd backend && bash -c 'uvx pip-audit -r <(uv export --no-dev --format requirements-txt --no-hashes)'
	docker run --rm -v "$(CURDIR):/repo:ro" -w /repo ghcr.io/gitleaks/gitleaks@sha256:c00b6bd0aeb3071cbcb79009cb16a60dd9e0a7c60e2be9ab65d25e6bc8abbb7f git . --no-banner --redact
	docker run --rm -v "$(CURDIR):/repo:ro" -w /repo ghcr.io/gitleaks/gitleaks@sha256:c00b6bd0aeb3071cbcb79009cb16a60dd9e0a7c60e2be9ab65d25e6bc8abbb7f git --staged . --no-banner --redact

compose-smoke:
	bash scripts/verify-compose.sh

email-qa:
	bash scripts/verify-email-outbox.sh

production-smoke:
	bash scripts/production-smoke.sh

verify:
	$(MAKE) format-check
	$(MAKE) lint
	$(MAKE) typecheck
	$(MAKE) production-config-check
	$(MAKE) test
	$(MAKE) e2e
	$(MAKE) build
	$(MAKE) security
	$(MAKE) compose-smoke
	$(MAKE) email-qa
	git diff --check
	git show --check --oneline HEAD

compose-up:
	@test -n "$(POSTGRES_PASSWORD)" || (echo "Copy .env.example and set POSTGRES_PASSWORD first." >&2; exit 1)
	@case "$(POSTGRES_PASSWORD)" in replace-*|changeme*|example*) echo "Replace the local placeholder POSTGRES_PASSWORD first." >&2; exit 1;; esac
	@test "$${#POSTGRES_PASSWORD}" -ge 24 || (echo "Local PostgreSQL password must contain at least 24 characters." >&2; exit 1)
	@[[ "$(POSTGRES_PASSWORD)" =~ ^[A-Za-z0-9_-]+$$ ]] || (echo "POSTGRES_PASSWORD must use URL-safe characters." >&2; exit 1)
	docker compose -f compose.yaml -f infra/compose.dev.yaml up -d --wait postgres

compose-down:
	docker compose -f compose.yaml -f infra/compose.dev.yaml down
