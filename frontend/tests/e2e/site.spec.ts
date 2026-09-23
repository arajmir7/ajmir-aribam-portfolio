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
  for (const path of routes) {
    await page.goto(path);
    const visibleText = await page.locator("body").innerText();
    expect(visibleText, `${path} public copy`).not.toMatch(
      /TODO_OWNER_VERIFY|source inspection|inspected source|verification boundary|per supplied resume|local Git history|backend\/src|Users\/ajmiraribam/i,
    );
  }
  await page.goto("/work/azaeron");
  await expect(
    page.getByRole("heading", {
      name: "A status change is a business operation.",
    }),
  ).toBeVisible();
  await expect(page.getByText("Partially paid", { exact: true })).toBeVisible();
  for (const path of [
    "/work/azaeron",
    "/work/shapes-india",
    "/work/friends-aluminium-works",
  ]) {
    await page.goto(path);
    const heroImage = page.locator(".case-hero-image img");
    await expect(heroImage).toBeVisible();
    await expect
      .poll(() =>
        heroImage.evaluate((image: HTMLImageElement) => image.naturalWidth),
      )
      .toBeGreaterThan(0);
    await expect(page.locator(".site-footer--compact")).toBeVisible();
  }
  await page.goto("/work/friends-aluminium-works");
  await expect(page.locator(".friends-gallery img")).toHaveCount(3);
  await page.goto("/contact");
  await expect(
    page
      .locator(".site-footer--large")
      .getByRole("link", { name: /Explore selected work/ }),
  ).toHaveAttribute("href", "/work");
  await page.goto("/labs");
  await expect(
    page.getByText("PROTOTYPE / TEMPLATE EXPLORATION"),
  ).toBeVisible();
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
  await page.route("**/api/contact", (route) =>
    route.fulfill({
      status: 503,
      body: JSON.stringify({ message: "Unavailable" }),
    }),
  );
  await page.getByLabel("Name", { exact: true }).fill("Grace Hopper");
  await page.getByLabel("Email", { exact: true }).fill("grace@example.com");
  await page.getByLabel("Topic").selectOption("project");
  await page
    .getByLabel("Message")
    .fill("A second inquiry should have an email fallback.");
  await page.getByRole("button", { name: /Send inquiry/ }).click();
  await expect(page.locator(".form-status[role='alert']")).toContainText(
    "You can email me directly",
  );
  await expect(
    page.getByRole("link", { name: /Email .* instead/ }),
  ).toHaveAttribute("href", /^mailto:/);
});

test("keyboard navigation and mobile menu", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  const menu = page.locator(".menu-toggle");
  await menu.click();
  await expect(menu).toHaveAttribute("aria-expanded", "true");
  await menu.press("Escape");
  await expect(menu).toBeFocused();
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await menu.click();
  await page.getByRole("link", { name: "About", exact: true }).click();
  await expect(page).toHaveURL(/\/about$/);
  await expect(page.locator('.main-nav a[aria-current="page"]')).toHaveText(
    "About",
  );
  await page.goto("/work/azaeron");
  const contents = page.getByRole("navigation", { name: "On this page" });
  await expect(contents).toBeVisible();
  await contents.getByRole("link", { name: "Financial state" }).click();
  await expect(page).toHaveURL(/#financial-state$/);
});

test("themes and automated accessibility", async ({ page }) => {
  test.setTimeout(90_000);
  await page.goto("/");
  await page.getByRole("button", { name: "Toggle color theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  for (const path of routes) {
    await page.goto(path);
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(results.violations, path).toEqual([]);
  }
  await page.getByRole("button", { name: "Toggle color theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  for (const path of routes) {
    await page.goto(path);
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(results.violations, `${path} light`).toEqual([]);
  }
});

test("responsive routes have no horizontal overflow", async ({ page }) => {
  test.setTimeout(180_000);
  for (const width of [320, 360, 375, 390, 430, 768, 1024, 1280, 1440, 1728]) {
    await page.setViewportSize({ width, height: 812 });
    for (const path of routes) {
      await page.goto(path);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth,
      );
      expect(overflow, `${path} horizontal overflow at ${width}px`).toBe(false);
    }
  }
});

test("representative visual states are captured", async ({ page }) => {
  for (const state of [
    { width: 1440, theme: "light", path: "/", name: "home" },
    { width: 1440, theme: "dark", path: "/", name: "home" },
    { width: 390, theme: "light", path: "/", name: "home" },
    { width: 390, theme: "dark", path: "/", name: "home" },
    { width: 1440, theme: "light", path: "/work/azaeron", name: "azaeron" },
    { width: 390, theme: "dark", path: "/work/azaeron", name: "azaeron" },
    {
      width: 1440,
      theme: "light",
      path: "/work/friends-aluminium-works",
      name: "friends",
    },
    {
      width: 390,
      theme: "light",
      path: "/work/friends-aluminium-works",
      name: "friends",
    },
  ]) {
    await page.setViewportSize({ width: state.width, height: 900 });
    await page.goto(state.path);
    await page.evaluate((theme) => {
      document.documentElement.dataset.theme = theme;
    }, state.theme);
    await page.screenshot({
      path: `test-results/${state.name}-${state.width}-${state.theme}.png`,
      fullPage: true,
      animations: "disabled",
    });
  }
});
