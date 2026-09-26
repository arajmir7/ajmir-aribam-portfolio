import { defineConfig, devices } from "@playwright/test";
import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const token = "local-e2e-internal-token-at-least-32-characters";
const revision = "0123456789abcdef0123456789abcdef01234567";
const database = `e2e-${process.pid}.db`;
const frontendPort = Number(process.env.E2E_FRONTEND_PORT || 3100);
const frontendInternalPort = frontendPort + 1;
const backendPort = Number(process.env.E2E_BACKEND_PORT || 8100);
const frontendUrl = `https://127.0.0.1:${frontendPort}`;
const frontendInternalUrl = `http://127.0.0.1:${frontendInternalPort}`;
const backendUrl = `http://127.0.0.1:${backendPort}`;
const certificateDirectory = mkdtempSync(join(tmpdir(), "portfolio-e2e-tls-"));
const certificatePath = join(certificateDirectory, "certificate.pem");
const privateKeyPath = join(certificateDirectory, "private-key.pem");
const certificate = spawnSync(
  "openssl",
  [
    "req",
    "-x509",
    "-newkey",
    "rsa:2048",
    "-nodes",
    "-keyout",
    privateKeyPath,
    "-out",
    certificatePath,
    "-days",
    "1",
    "-subj",
    "/CN=127.0.0.1",
    "-addext",
    "subjectAltName=IP:127.0.0.1",
  ],
  { stdio: "ignore" },
);
if (certificate.status !== 0) {
  rmSync(certificateDirectory, { recursive: true, force: true });
  throw new Error(
    "Could not create the temporary Playwright HTTPS certificate.",
  );
}
process.on("exit", () =>
  rmSync(certificateDirectory, { recursive: true, force: true }),
);

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL: frontendUrl,
    ignoreHTTPSErrors: true,
    trace: "retain-on-failure",
  },
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
      command: `npm run build && cp -R public .next/standalone/public && mkdir -p .next/standalone/.next && cp -R .next/static .next/standalone/.next/static && cd .next/standalone && HOSTNAME=127.0.0.1 PORT=${frontendInternalPort} node server.js`,
      url: `${frontendInternalUrl}/api/health`,
      env: {
        NEXT_PUBLIC_SITE_URL: frontendUrl,
        CONTACT_ALLOWED_ORIGIN: frontendUrl,
        CONTACT_API_HOSTPORT: `e2e-api.internal:${backendPort}`,
        CONTACT_INTERNAL_TOKEN: token,
        CONTACT_CLIENT_IP_HEADER: "x-forwarded-for",
        BUILD_REVISION: revision,
        NODE_OPTIONS: `--import=${resolve("tests/e2e/resolve-e2e-api.mjs")}`,
      },
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    {
      command: `node scripts/e2e-https-proxy.mjs ${frontendPort} ${frontendInternalPort} ${certificatePath} ${privateKeyPath}`,
      url: frontendUrl,
      ignoreHTTPSErrors: true,
      reuseExistingServer: !process.env.CI,
      timeout: 30_000,
    },
  ],
});
