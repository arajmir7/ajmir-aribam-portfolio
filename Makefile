SHELL := /bin/bash

-include .env
export

.PHONY: install dev test lint typecheck e2e build security verify compose-up compose-down format-check blueprint-check containers compose-smoke email-qa production-smoke

install:
	cd frontend && npm ci
	cd backend && uv sync --frozen --group dev

dev:
	@test -n "$(POSTGRES_PASSWORD)" -a -n "$(DATABASE_URL)" -a -n "$(CONTACT_INTERNAL_TOKEN)" || (echo "Copy .env.example to .env and configure the local values." >&2; exit 1)
	docker compose -f compose.yaml -f infra/compose.dev.yaml up -d --wait postgres mailpit
	cd backend && uv run alembic upgrade head
	python3 scripts/dev.py

format-check:
	cd frontend && npm run format:check
	cd frontend && npx prettier --check '../README.md' '../RELEASE_CERTIFICATION.md' '../docs/*.md' '../compose.yaml' '../render.yaml' '../infra/*.yaml' '../.github/workflows/*.yml'
	cd backend && uv run ruff format --check . ../scripts/dev.py ../scripts/backup_postgres.py ../scripts/restore_postgres.py

blueprint-check:
	cd backend && uvx --from check-jsonschema==0.38.2 check-jsonschema --schemafile https://render.com/schema/render.yaml.json ../render.yaml

lint:
	cd frontend && npm run lint
	cd backend && uv run ruff check . ../scripts/dev.py ../scripts/backup_postgres.py ../scripts/restore_postgres.py

typecheck:
	cd frontend && npm run typecheck

test:
	cd frontend && npm run test
	cd backend && uv run pytest -q
	bash scripts/verify-postgres.sh

build:
	cd frontend && NEXT_PUBLIC_SITE_URL=https://ajmiraribam.me npm run build

e2e:
	cd frontend && npm run e2e

security:
	cd frontend && npm audit --audit-level=high
	cd backend && bash -c 'uvx pip-audit -r <(uv export --no-dev --format requirements-txt --no-hashes)'
	docker run --rm -v "$(CURDIR):/repo:ro" -w /repo ghcr.io/gitleaks/gitleaks@sha256:c00b6bd0aeb3071cbcb79009cb16a60dd9e0a7c60e2be9ab65d25e6bc8abbb7f git . --no-banner --redact
	docker run --rm -v "$(CURDIR):/repo:ro" -w /repo ghcr.io/gitleaks/gitleaks@sha256:c00b6bd0aeb3071cbcb79009cb16a60dd9e0a7c60e2be9ab65d25e6bc8abbb7f git --staged . --no-banner --redact

containers:
	docker build --build-arg NEXT_PUBLIC_SITE_URL=https://example.com -t portfolio-frontend:verify frontend
	docker build -t portfolio-backend:verify backend

compose-smoke:
	bash scripts/verify-compose.sh

email-qa:
	bash scripts/verify-email-outbox.sh

production-smoke:
	bash scripts/production-smoke.sh

verify:
	$(MAKE) format-check
	$(MAKE) blueprint-check
	$(MAKE) lint
	$(MAKE) typecheck
	$(MAKE) test
	$(MAKE) e2e
	$(MAKE) build
	$(MAKE) security
	$(MAKE) containers
	$(MAKE) compose-smoke
	$(MAKE) email-qa
	git diff --check

compose-up:
	@test -n "$(POSTGRES_PASSWORD)" -a -n "$(CONTACT_INTERNAL_TOKEN)" -a -n "$(NEXT_PUBLIC_SITE_URL)" -a -n "$(CONTACT_CLIENT_IP_HEADER)" || (echo "Copy .env.example to .env and configure the values." >&2; exit 1)
	@case "$(POSTGRES_PASSWORD)" in replace-*|changeme*|example*) echo "Replace the local placeholder POSTGRES_PASSWORD first." >&2; exit 1;; esac
	@case "$(DATABASE_RUNTIME_PASSWORD)" in replace-*|changeme*|example*) echo "Replace the local placeholder DATABASE_RUNTIME_PASSWORD first." >&2; exit 1;; esac
	@test "$${#POSTGRES_PASSWORD}" -ge 32 -a "$${#DATABASE_RUNTIME_PASSWORD}" -ge 32 || (echo "PostgreSQL passwords must contain at least 32 characters." >&2; exit 1)
	@[[ "$(POSTGRES_PASSWORD)" =~ ^[A-Za-z0-9_-]+$$ ]] || (echo "POSTGRES_PASSWORD must use URL-safe characters for the local migration URL." >&2; exit 1)
	@[[ "$(NEXT_PUBLIC_SITE_URL)" == https://* && "$(CONTACT_ALLOWED_ORIGIN)" == "$(NEXT_PUBLIC_SITE_URL)" ]] || (echo "Production-like Compose requires one matching canonical HTTPS origin." >&2; exit 1)
	@set -e; \
	export BUILD_REVISION="$$(git rev-parse --short HEAD)"; \
	docker compose up -d --build --wait postgres; \
	docker compose run --rm --build backend python -m app.maintenance prepare-runtime-role; \
	docker compose run --rm --build backend alembic upgrade head; \
	docker compose up -d --build --wait

compose-down:
	docker compose -f compose.yaml -f infra/compose.dev.yaml down
	docker compose down
