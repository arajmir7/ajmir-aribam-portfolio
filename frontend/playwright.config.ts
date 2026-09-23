import { defineConfig, devices } from "@playwright/test";

const token = "local-e2e-internal-token-at-least-32-characters";
const database = `e2e-${process.pid}.db`;
const frontendPort = Number(process.env.E2E_FRONTEND_PORT || 3100);
const backendPort = Number(process.env.E2E_BACKEND_PORT || 8100);
const frontendUrl = `http://127.0.0.1:${frontendPort}`;
const backendUrl = `http://127.0.0.1:${backendPort}`;
export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  retries: process.env.CI ? 1 : 0,
  use: { baseURL: frontendUrl, trace: "retain-on-failure" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: [
    {
      command: `DATABASE_URL=sqlite:///./${database} CONTACT_INTERNAL_TOKEN=${token} uv run alembic upgrade head && DATABASE_URL=sqlite:///./${database} CONTACT_INTERNAL_TOKEN=${token} uv run uvicorn app.main:app --host 127.0.0.1 --port ${backendPort}`,
      cwd: "../backend",
      url: `${backendUrl}/health/ready`,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    {
      command: `npm run start -- -p ${frontendPort}`,
      url: frontendUrl,
      env: {
        NEXT_PUBLIC_SITE_URL: frontendUrl,
        CONTACT_API_URL: backendUrl,
        CONTACT_INTERNAL_TOKEN: token,
      },
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
});
