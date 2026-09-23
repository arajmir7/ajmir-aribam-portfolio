import { defineConfig, devices } from "@playwright/test";

const token = "local-e2e-internal-token-at-least-32-characters";
const database = `e2e-${process.pid}.db`;
export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  retries: process.env.CI ? 1 : 0,
  use: { baseURL: "http://127.0.0.1:3000", trace: "retain-on-failure" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: [
    {
      command: `DATABASE_URL=sqlite:///./${database} CONTACT_INTERNAL_TOKEN=${token} uv run alembic upgrade head && DATABASE_URL=sqlite:///./${database} CONTACT_INTERNAL_TOKEN=${token} uv run uvicorn app.main:app --host 127.0.0.1 --port 8000`,
      cwd: "../backend",
      url: "http://127.0.0.1:8000/health/ready",
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    {
      command: "npm run start -- -p 3000",
      url: "http://127.0.0.1:3000",
      env: {
        NEXT_PUBLIC_SITE_URL: "http://127.0.0.1:3000",
        CONTACT_API_URL: "http://127.0.0.1:8000",
        CONTACT_INTERNAL_TOKEN: token,
      },
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
});
