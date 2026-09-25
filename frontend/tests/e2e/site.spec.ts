import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { projects } from "../../src/content/projects";

const routes = [
  "/",
  "/work",
  ...projects.map((project) => `/work/${project.slug}`),
  "/engineering",
  "/labs",
  "/about",
  "/resume",
  "/notes",
  "/notes/state-is-a-boundary",
  "/contact",
  "/privacy",
];

test("orientation, routes, metadata, and evidence links", async ({
  page,
  request,
}) => {
  expect(projects).toHaveLength(9);
  expect(
    projects.filter((project) => project.maturity === "live"),
  ).toHaveLength(3);
  expect(
    projects.filter((project) => project.maturity === "development"),
  ).toHaveLength(4);
  expect(
    projects.filter((project) => project.maturity === "prototype"),
  ).toHaveLength(2);
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "I build software products and the systems behind them.",
  );
  await expect(page.locator(".home-intro .kicker")).toContainText(
    "Ajmir Aribam",
  );
  await expect(page.locator(".home-intro .kicker")).toContainText(
    "Software Engineer",
  );
  await expect(page.locator(".home-intro-note")).toContainText("Quality");
  await expect(
    page.getByRole("link", { name: /Explore the work/ }),
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
    expect(html, `${path} previous name`).not.toMatch(/\bmd\s+ajmir\b/i);
    expect(html, `${path} public identity`).toContain("Ajmir Aribam");
  }
  for (const [from, to] of [
    ["/writing", "/notes"],
    ["/writing/state-is-a-boundary", "/notes/state-is-a-boundary"],
  ]) {
    const response = await request.get(from, { maxRedirects: 0 });
    expect(response.status(), from).toBe(308);
    expect(response.headers().location, from).toBe(to);
  }
  await page.goto("/");
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    "content",
    /Ajmir Aribam/,
  );
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
    "content",
    "summary_large_image",
  );
  const person = await page
    .locator('script[type="application/ld+json"]')
    .first()
    .textContent();
  expect(JSON.parse(person || "{}").name).toBe("Ajmir Aribam");
  const sitemap = await (await request.get("/sitemap.xml")).text();
  const locations = Array.from(
    sitemap.matchAll(/<loc>([^<]+)<\/loc>/g),
    (match) => new URL(match[1]).pathname,
  );
  for (const path of routes) expect(locations).toContain(path);
  const retiredProjectPath = "/work/civicpulse-resilience-network";
  expect(locations).not.toContain(retiredProjectPath);
  const retiredProjectResponse = await page.goto(retiredProjectPath);
  expect(retiredProjectResponse?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { name: "This page isn’t here." }),
  ).toBeVisible();
  expect(await (await request.get("/robots.txt")).text()).toContain(
    "sitemap.xml",
  );
  const internal = new Set<string>();
  for (const path of routes) {
    await page.goto(path);
    await expect(page.locator("#main h1")).toBeVisible();
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
    await expect(page.locator("#main h1")).toBeVisible();
    const visibleText = await page.locator("body").innerText();
    expect(visibleText, `${path} public copy`).not.toMatch(
      /CivicPulse|Civic Pulse|Resilience Network|Three products, three different jobs|TODO_OWNER_VERIFY|source inspection|inspected source|verification boundary|per supplied resume|local Git history|backend\/src|Users\/ajmiraribam/i,
    );
  }
  await page.goto("/work/azaeron");
  await expect(page.locator(".case-hero-facts")).not.toContainText(
    "Built with",
  );
  await expect(
    page.getByRole("heading", {
      name: "Keeping financial state consistent.",
    }),
  ).toBeVisible();
  await expect(page.getByText("Partially paid", { exact: true })).toBeVisible();
  for (const project of projects) {
    const path = `/work/${project.slug}`;
    await page.goto(path);
    const heroImage = page.locator(".case-hero-image img");
    await expect(heroImage).toBeVisible();
    await expect
      .poll(() =>
        heroImage.evaluate((image: HTMLImageElement) => image.naturalWidth),
      )
      .toBeGreaterThan(0);
    await expect(page.locator(".case-hero-facts")).toBeVisible();
    await expect(page.locator(".case-hero-facts")).not.toContainText(
      "Built with",
    );
    if (
      ![
        "azaeron",
        "shapes-india",
        "friends-aluminium-works",
        "azaeron-verity",
        "the-scent-bar-retail-os",
      ].includes(project.slug)
    ) {
      const sectionIds = await page
        .locator(".case-section")
        .evaluateAll((sections) =>
          sections.map((section) => section.getAttribute("id")),
        );
      expect(sectionIds).toEqual([
        "product",
        "problem",
        "decisions",
        "implementation",
        "limits",
      ]);
    }
  }
  await page.goto("/work/friends-aluminium-works");
  await expect(page.locator(".friends-gallery img")).toHaveCount(3);
  await page.goto("/contact");
  await expect(
    page
      .getByRole("navigation", { name: "Footer navigation" })
      .getByRole("link", { name: "Work" }),
  ).toHaveAttribute("href", "/work");
  await page.goto("/labs");
  await expect(page.getByText("SCMIRN", { exact: true })).toBeVisible();
  await expect(page.locator(".lab-project")).toHaveCount(2);
  await page.goto("/work/azaeron-verity");
  await expect(page.locator(".case-hero .kicker")).toContainText(
    "In development",
  );
  await expect(
    page.getByText(/No approved production generative model/),
  ).toBeVisible();
  await page.goto("/work/the-scent-bar-retail-os");
  await expect(page.locator(".case-hero .kicker")).toContainText(
    "In development",
  );
  await expect(
    page.getByText(
      /inventory ledger, purchasing, and point of sale are not implemented/,
    ),
  ).toBeVisible();
  await page.goto("/work/accessforge");
  await expect(page.locator(".case-hero .kicker")).toContainText("Local build");
  await expect(
    page.getByRole("heading", {
      name: /Accessibility remediation should produce evidence/,
    }),
  ).toBeVisible();
  await page.goto("/work/scmirn");
  await expect(page.locator(".case-hero .kicker")).toContainText("Prototype");
  await expect(
    page.getByRole("heading", {
      name: /Informational guidance, not legal advice/,
    }),
  ).toBeVisible();
  await page.goto("/work/zam-zam-academy");
  await expect(page.locator(".case-hero .kicker")).toContainText("Prototype");
  await expect(
    page.getByRole("link", { name: /Visit hosted preview/ }),
  ).toHaveAttribute("href", "https://storied-bombolone-5d4a8f.netlify.app/");
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
  const contents = page.getByRole("navigation", { name: "In this case study" });
  await expect(contents).toBeVisible();
  await contents.getByRole("link", { name: "Financial state" }).click();
  await expect(page).toHaveURL(/#financial-state$/);
});

test("brand lockup stays visible at responsive widths in both themes", async ({
  page,
}) => {
  await page.goto("/");
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const theme of ["light", "dark"]) {
      await page.evaluate((value) => {
        document.documentElement.dataset.theme = value;
      }, theme);
      const visibleBrand = page.locator(".brand-asset:visible");
      await expect(visibleBrand).toHaveCount(1);
      const expectedVariant =
        width <= 360
          ? "brand-monogram"
          : width <= 820
            ? "brand-compact"
            : "brand-full";
      await expect(visibleBrand).toHaveClass(new RegExp(expectedVariant));
      const bounds = await visibleBrand.boundingBox();
      expect(
        bounds?.height,
        `${theme} logo height at ${width}px`,
      ).toBeGreaterThan(20);
      expect(
        bounds?.width,
        `${theme} logo width at ${width}px`,
      ).toBeGreaterThan(30);
      await expect
        .poll(() =>
          visibleBrand.evaluate(
            (image: HTMLImageElement) => image.naturalWidth,
          ),
        )
        .toBeGreaterThan(0);
    }
  }
});

test("themes and automated accessibility", async ({ page }) => {
  test.setTimeout(90_000);
  await page.goto("/");
  await page.getByRole("button", { name: "Toggle color theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  for (const path of routes) {
    await page.goto(path);
    await expect(page.locator("#main h1")).toBeVisible();
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
    await expect(page.locator("#main h1")).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(results.violations, `${path} light`).toEqual([]);
  }
});

test("responsive routes have no horizontal overflow", async ({ page }) => {
  test.setTimeout(180_000);
  for (const width of [
    320, 360, 375, 390, 412, 430, 768, 820, 1024, 1280, 1440, 1600, 1728, 1920,
  ]) {
    await page.setViewportSize({ width, height: 812 });
    for (const path of routes) {
      await page.goto(path);
      await expect(page.locator("#main h1")).toBeVisible();
      const overflow = await page.evaluate(() => {
        if (document.documentElement.scrollWidth <= window.innerWidth)
          return null;
        return {
          documentWidth: document.documentElement.scrollWidth,
          elements: Array.from(document.querySelectorAll("body *"))
            .map((element) => {
              const bounds = element.getBoundingClientRect();
              return {
                element: element.tagName.toLowerCase(),
                className:
                  typeof element.className === "string"
                    ? element.className
                    : "",
                right: Math.round(bounds.right),
                width: Math.round(bounds.width),
              };
            })
            .filter((element) => element.right > window.innerWidth + 1)
            .slice(0, 8),
        };
      });
      expect(overflow, `${path} horizontal overflow at ${width}px`).toBeNull();
    }
  }
});

test("public routes hydrate without browser errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  for (const path of routes) {
    await page.goto(path);
    await expect(page.locator("#main h1")).toBeVisible();
    await page.waitForTimeout(100);
  }
  expect(errors).toEqual([]);
});

test("representative visual states are captured", async ({ page }) => {
  test.setTimeout(180_000);
  for (const width of [390, 768, 1440, 1728]) {
    await page.setViewportSize({ width, height: 900 });
    for (const theme of ["light", "dark"]) {
      for (const path of routes) {
        await page.goto(path);
        await expect(page.locator("#main h1")).toBeVisible();
        await page.evaluate((value) => {
          document.documentElement.dataset.theme = value;
        }, theme);
        const name = path === "/" ? "home" : path.slice(1).replaceAll("/", "-");
        await page.screenshot({
          path: `test-results/${name}-${width}-${theme}.png`,
          fullPage: true,
          animations: "disabled",
        });
      }
    }
  }
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/resume");
  await expect(page.locator("#main h1")).toBeVisible();
  await page.pdf({
    path: "test-results/resume-print.pdf",
    format: "A4",
    printBackground: true,
  });
});
