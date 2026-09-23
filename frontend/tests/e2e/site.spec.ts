import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const routes = [
  "/",
  "/work",
  "/work/azaeron",
  "/work/shapes-india",
  "/work/friends-aluminium-works",
  "/engineering",
  "/labs",
  "/about",
  "/resume",
  "/writing",
  "/writing/state-is-a-boundary",
  "/contact",
  "/privacy",
];

test("orientation, routes, metadata, and evidence links", async ({
  page,
  request,
}) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Software Engineer",
  );
  await expect(
    page.getByRole("link", { name: /View selected work/ }),
  ).toBeVisible();
  await page.screenshot({
    path: "test-results/home-desktop.png",
    fullPage: true,
  });
  for (const path of routes) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
    const html = await response.text();
    expect(html, `${path} title`).toMatch(/<title>[^<]+<\/title>/);
    expect(html, `${path} canonical`).toContain(`rel="canonical"`);
  }
  const sitemap = await (await request.get("/sitemap.xml")).text();
  const locations = Array.from(
    sitemap.matchAll(/<loc>([^<]+)<\/loc>/g),
    (match) => new URL(match[1]).pathname,
  );
  for (const path of routes) expect(locations).toContain(path);
  expect(await (await request.get("/robots.txt")).text()).toContain(
    "sitemap.xml",
  );
  const internal = new Set<string>();
  for (const path of routes) {
    await page.goto(path);
    const hrefs = await page
      .locator('a[href^="/"]')
      .evaluateAll((anchors) =>
        anchors.map((a) => a.getAttribute("href") || ""),
      );
    for (const href of hrefs)
      if (href && !href.startsWith("//"))
        internal.add(href.split("#")[0] || path);
  }
  for (const href of internal)
    expect((await request.get(href)).status(), href).toBe(200);
  await page.goto("/work/azaeron");
  await expect(
    page.getByRole("link", { name: "Inspect evidence notes ↓" }),
  ).toHaveAttribute("href", "#decisions");
  await expect(
    page.getByText(
      /Inspected source: backend\/src\/services\/invoiceLifecycleService.js/,
    ),
  ).toBeVisible();
  await page.goto("/labs");
  await expect(page.getByText("PROTOTYPE / TEMPLATE ONLY")).toBeVisible();
  expect((await request.get("/missing-route")).status()).toBe(404);
});

test("contact journey, validation, and API readiness", async ({
  page,
  request,
}) => {
  expect((await request.get("/api/health")).status()).toBe(200);
  await page.goto("/contact");
  await page.getByRole("button", { name: /Send inquiry/ }).click();
  await expect(page.locator(".form-status")).toContainText(
    "correct the marked fields",
  );
  await page.getByLabel("Name", { exact: true }).fill("Grace Hopper");
  await page.getByLabel("Email", { exact: true }).fill("grace@example.com");
  await page.getByLabel("Topic").selectOption("project");
  await page
    .getByLabel("Message")
    .fill("I would like to discuss a backend system for a real project.");
  await page.getByRole("button", { name: /Send inquiry/ }).click();
  await expect(page.getByRole("status")).toContainText(
    "Your inquiry was received",
  );
});

test("keyboard, themes, small screens, and automated accessibility", async ({
  page,
}) => {
  test.setTimeout(90_000);
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.getByRole("link", { name: "Work", exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/work$/);
  await page.goto("/");
  await page.getByRole("button", { name: "Toggle color theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  for (const path of routes) {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(results.violations, path).toEqual([]);
  }
  await page.getByRole("button", { name: "Toggle color theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  for (const path of routes) {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(results.violations, `${path} light`).toEqual([]);
  }
  for (const width of [320, 375, 768]) {
    await page.setViewportSize({ width, height: 812 });
    for (const path of routes) {
      await page.goto(path);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth,
      );
      expect(overflow, `${path} horizontal overflow at ${width}px`).toBe(false);
      if (width === 375 && path === "/")
        await page.screenshot({
          path: "test-results/home-mobile.png",
          fullPage: true,
        });
      if (width === 375 && path === "/work/azaeron")
        await page.screenshot({
          path: "test-results/azaeron-mobile.png",
          fullPage: true,
        });
    }
  }
});
