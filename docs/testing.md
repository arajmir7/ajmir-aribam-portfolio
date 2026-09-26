# Testing and verification

Run the complete local gate from the repository root:

```sh
make verify
```

The gate checks frontend and Markdown formatting, ESLint and public-name rules, Ruff, strict TypeScript, frontend unit tests, backend API tests, PostgreSQL migrations and integration behavior, browser flows, accessibility, dependency advisories, Git secret history and staged content, Docker image builds, and an isolated Compose contact flow. The Compose check confirms inquiry persistence and rejection of a foreign origin. `git diff --check` runs at the end.

Useful focused commands are `make lint`, `make typecheck`, `make test`, `make e2e`, `make build`, `make security`, `make containers`, and `make compose-smoke`. PostgreSQL and Compose checks use disposable resources. Playwright output, browser captures, databases, and caches are generated locally and ignored by Git.

Automated accessibility checks are a regression aid, not a conformance certification. A production release still needs review on target devices and assistive technology.
