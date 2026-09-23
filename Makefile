SHELL := /bin/bash

-include .env
export

.PHONY: install dev test lint typecheck e2e build security verify compose-up compose-down format-check containers compose-smoke

install:
	cd frontend && npm ci
	cd backend && uv sync --frozen --group dev

dev:
	@test -n "$(POSTGRES_PASSWORD)" -a -n "$(DATABASE_URL)" -a -n "$(CONTACT_INTERNAL_TOKEN)" || (echo "Copy .env.example to .env and configure the local values." >&2; exit 1)
	docker compose -f compose.yaml -f infra/compose.dev.yaml up -d --wait postgres
	cd backend && uv run alembic upgrade head
	python3 scripts/dev.py

format-check:
	cd frontend && npm run format:check
	cd frontend && npx prettier --check '../*.md' '../docs/*.md' '../compose.yaml' '../infra/*.yaml' '../.github/workflows/*.yml'
	cd backend && uv run ruff format --check . ../scripts/dev.py

lint:
	cd frontend && npm run lint
	cd backend && uv run ruff check . ../scripts/dev.py

typecheck:
	cd frontend && npm run typecheck

test:
	cd frontend && npm run test
	cd backend && uv run pytest -q
	bash scripts/verify-postgres.sh

build:
	cd frontend && npm run build

e2e: build
	cd frontend && npm run e2e

security:
	cd frontend && npm audit --audit-level=high
	cd backend && bash -c 'uvx pip-audit -r <(uv export --no-dev --format requirements-txt --no-hashes)'
	docker run --rm -v "$(CURDIR):/repo:ro" -w /repo ghcr.io/gitleaks/gitleaks:latest git . --no-banner --redact
	docker run --rm -v "$(CURDIR):/repo:ro" -w /repo ghcr.io/gitleaks/gitleaks:latest git --staged . --no-banner --redact

containers:
	docker build --build-arg NEXT_PUBLIC_SITE_URL=https://example.com -t portfolio-frontend:verify frontend
	docker build -t portfolio-backend:verify backend

compose-smoke:
	bash scripts/verify-compose.sh

verify:
	$(MAKE) format-check
	$(MAKE) lint
	$(MAKE) typecheck
	$(MAKE) test
	$(MAKE) e2e
	$(MAKE) security
	$(MAKE) containers
	$(MAKE) compose-smoke
	git diff --check

compose-up:
	@test -n "$(POSTGRES_PASSWORD)" -a -n "$(CONTACT_INTERNAL_TOKEN)" -a -n "$(NEXT_PUBLIC_SITE_URL)" || (echo "Copy .env.example to .env and configure the values." >&2; exit 1)
	docker compose up -d --build --wait

compose-down:
	docker compose down
