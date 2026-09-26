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
}, testInfo) => {
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
    "Ajmir Aribam",
  );
  await expect(page.locator(".home-role")).toHaveText("Software Engineer");
  await expect(page.locator(".home-proposition")).toContainText("systems");
  await expect(
    page.getByRole("link", { name: /View selected work/ }),
  ).toBeVisible();
  await expect(page.locator(".home-hero img")).toHaveCount(0);
  await expect(page.locator(".home-proof > div")).toHaveCount(4);
  await expect(page.locator(".home-project-grid .project-card")).toHaveCount(4);
  await expect(page.locator(".home-writing")).toContainText(
    "Why status changes belong on the server",
  );
  await page.goto("/work");
  await expect(page.locator(".work-featured-grid .project-card")).toHaveCount(
    4,
  );
  for (const card of await page
    .locator(".work-featured-grid .project-card")
    .all()) {
    await expect(card.locator(".project-card-meta")).toContainText("2026");
  }
  await page.goto("/");
  await page.screenshot({
    path: "test-results/home-desktop.png",
    fullPage: true,
  });
  const expectedOrigin = new URL(String(testInfo.project.use.baseURL)).origin;
  const titles = new Set<string>();
  for (const path of routes) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
    const html = await response.text();
    const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
    expect(title, `${path} title`).toBeTruthy();
    titles.add(title!);
    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
    expect(canonical, `${path} canonical`).toBeTruthy();
    expect(new URL(canonical!).origin, `${path} canonical origin`).toBe(
      expectedOrigin,
    );
    expect(new URL(canonical!).pathname, `${path} canonical path`).toBe(path);
    expect(html, `${path} Open Graph image`).toMatch(
      /<meta property="og:image" content="[^"]*\/opengraph-image[^"]*"/,
    );
    expect(html, `${path} Twitter image`).toMatch(
      /<meta name="twitter:image" content="[^"]*\/opengraph-image[^"]*"/,
    );
    expect(html, `${path} previous name`).not.toMatch(/\bmd\s+ajmir\b/i);
    expect(html, `${path} public identity`).toContain("Ajmir Aribam");
    if (path === "/") {
      const headers = response.headers();
      expect(headers["content-security-policy"]).toContain(
        "frame-ancestors 'none'",
      );
      expect(headers["strict-transport-security"]).toContain("max-age=");
      expect(headers["x-content-type-options"]).toBe("nosniff");
      expect(headers["x-frame-options"]).toBe("DENY");
      expect(headers["referrer-policy"]).toBe(
        "strict-origin-when-cross-origin",
      );
    }
  }
  expect(titles.size).toBe(routes.length);
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
  const unknownProjectPath = "/work/no-such-project";
  expect(locations).not.toContain(unknownProjectPath);
  const unknownProjectResponse = await page.goto(unknownProjectPath);
  expect(unknownProjectResponse?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { name: "This page isn’t here." }),
  ).toBeVisible();
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain("sitemap.xml");
  expect(robots).toContain("Disallow: /api/");
  for (const [asset, contentType] of [
    ["/opengraph-image", "image/png"],
    ["/icon.svg", "image/svg+xml"],
    ["/apple-icon.png", "image/png"],
    ["/icon-192.png", "image/png"],
    ["/icon-512.png", "image/png"],
    ["/manifest.webmanifest", "application/manifest+json"],
  ]) {
    const response = await request.get(asset);
    expect(response.status(), asset).toBe(200);
    expect(response.headers()["content-type"], asset).toContain(contentType);
  }
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
      /TODO_OWNER_VERIFY|source inspection|inspected source|verification boundary|per supplied resume|local Git history|backend\/src|Users\/ajmiraribam/i,
    );
  }
  await page.goto("/work/azaeron");
  await expect(page.locator(".case-facts")).toContainText(
    "Full-stack engineering",
  );
  await expect(page.locator("#contribution .story-lede")).toBeVisible();
  await expect(page.locator("#contribution .story-lede")).toContainText(
    "invoice lifecycle",
  );
  await page.goto("/work/shapes-india");
  await expect(page.locator(".case-current")).toContainText(
    "current public address",
  );
  await expect(page.locator('a[href="https://shapesindia.org/"]')).toHaveCount(
    0,
  );
  for (const project of projects) {
    const path = `/work/${project.slug}`;
    await page.goto(path);
    const heroImage = page.locator(".case-visual img");
    await expect(heroImage).toBeVisible();
    await expect
      .poll(() =>
        heroImage.evaluate((image: HTMLImageElement) => image.naturalWidth),
      )
      .toBeGreaterThan(0);
    await expect(page.locator(".case-facts")).toBeVisible();
    const sectionIds = await page
      .locator(".story-section")
      .evaluateAll((sections) =>
        sections.map((section) => section.getAttribute("id")),
      );
    expect(sectionIds).toEqual([
      "product",
      "problem",
      "contribution",
      "decisions",
      "system",
      "evidence",
      "current",
      "limits",
    ]);
    const caseVisual = await page.locator(".case-visual > div").boundingBox();
    expect(caseVisual?.height).toBeLessThanOrEqual(370);
    expect(caseVisual?.width).toBeLessThanOrEqual(970);
    await expect(page.locator("#limits li")).not.toHaveCount(0);
  }
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
  await expect(page.locator(".case-opening .section-label")).toContainText(
    "In development",
  );
  await expect(
    page.getByText(/No approved production generative model/),
  ).toBeVisible();
  await page.goto("/work/the-scent-bar-retail-os");
  await expect(page.locator(".case-opening .section-label")).toContainText(
    "In development",
  );
  await expect(
    page.getByText(
      /Inventory ledger, purchasing and point of sale are later milestones/,
    ),
  ).toBeVisible();
  await page.goto("/work/accessforge");
  await expect(page.locator(".case-opening .section-label")).toContainText(
    "In development",
  );
  await expect(
    page.getByText(/detect, remediate, check security, rescan/),
  ).toBeVisible();
  await page.goto("/work/scmirn");
  await expect(page.locator(".case-opening .section-label")).toContainText(
    "Prototype",
  );
  await expect(
    page.getByText(/not an official government service/),
  ).toBeVisible();
  await page.goto("/work/zam-zam-academy");
  await expect(page.locator(".case-opening .section-label")).toContainText(
    "Prototype",
  );
  await expect(
    page.getByRole("link", { name: /Open hosted preview/ }),
  ).toHaveAttribute("href", "https://storied-bombolone-5d4a8f.netlify.app/");
  expect((await request.get("/missing-route")).status()).toBe(404);
});

test("contact journey, validation, and API readiness", async ({
  page,
  request,
}) => {
  expect((await request.get("/api/health")).status()).toBe(200);
  const missingOrigin = await request.post("/api/contact", {
    data: {
      name: "Origin Check",
      email: "origin@example.com",
      topic: "question",
      message: "This request must fail without a browser origin.",
      website: "",
    },
  });
  expect(missingOrigin.status()).toBe(403);
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
  await page.unroute("**/api/contact");
  await page.context().setOffline(true);
  await page.getByLabel("Name", { exact: true }).fill("Grace Hopper");
  await page.getByLabel("Email", { exact: true }).fill("grace@example.com");
  await page.getByLabel("Topic").selectOption("project");
  await page
    .getByLabel("Message")
    .fill("A third inquiry while offline should not claim delivery.");
  await page.getByRole("button", { name: /Send inquiry/ }).click();
  await expect(page.locator(".form-status[role='alert']")).toContainText(
    "offline",
  );
  await page.context().setOffline(false);
});

test("keyboard navigation and mobile menu", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  const menu = page.locator(".menu-toggle");
  await expect(page.getByRole("link", { name: "Contact Ajmir" })).toBeVisible();
  await menu.click();
  await expect(menu).toHaveAttribute("aria-expanded", "true");
  await menu.press("Escape");
  await expect(menu).toBeFocused();
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await menu.click();
  await page
    .getByRole("navigation", { name: "Primary navigation" })
    .getByRole("link", { name: "About", exact: true })
    .click();
  await expect(page).toHaveURL(/\/about$/);
  await expect(page.locator('.main-nav a[aria-current="page"]')).toHaveText(
    "About",
  );
  await page.goto("/work/azaeron");
  const contents = page.getByRole("navigation", { name: "In this case study" });
  await expect(contents).toBeVisible();
  await contents.getByRole("link", { name: "Decisions" }).click();
  await expect(page).toHaveURL(/#decisions$/);
});

test("brand mark and readable name stay visible in both themes", async ({
  page,
}) => {
  await page.goto("/");
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const theme of ["light", "dark"]) {
      await page.evaluate((value) => {
        document.documentElement.dataset.theme = value;
      }, theme);
      const visibleBrand = page.locator(".brand-mark:visible");
      await expect(visibleBrand).toHaveCount(1);
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
      const name = page.locator(".brand-name");
      if (width <= 360) await expect(name).toBeHidden();
      else {
        await expect(name).toBeVisible();
        expect(
          await name.evaluate((element) =>
            Number.parseFloat(getComputedStyle(element).fontSize),
          ),
        ).toBeGreaterThanOrEqual(13);
      }
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
    2560,
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
  test.setTimeout(240_000);
  for (const width of [390, 768, 1440, 1728]) {
    await page.setViewportSize({ width, height: 900 });
    for (const theme of ["light", "dark"]) {
      for (const path of routes) {
        await page.goto(path);
        await expect(page.locator("#main h1")).toBeVisible();
        await page.evaluate((value) => {
          document.documentElement.dataset.theme = value;
        }, theme);
        await page.locator("img").evaluateAll(async (images) => {
          await Promise.all(
            images.map(async (image) => {
              const visual = image as HTMLImageElement;
              visual.loading = "eager";
              await visual.decode();
            }),
          );
        });
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

test("interactive visual states are captured", async ({ page }) => {
  test.setTimeout(120_000);
  async function captureContact(state: string, width: number, theme: string) {
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({
      path: `test-results/contact-${state}-${width}-${theme}.png`,
      fullPage: true,
      animations: "disabled",
    });
  }
  async function fillInquiry() {
    await page.getByLabel("Name", { exact: true }).fill("Grace Hopper");
    await page.getByLabel("Email", { exact: true }).fill("grace@example.com");
    await page.getByLabel("Topic").selectOption("project");
    await page
      .getByLabel("Message")
      .fill("I would like to discuss a real software project.");
  }
  for (const theme of ["light", "dark"]) {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await expect(page.locator("#main h1")).toBeVisible();
    await page.evaluate((value) => {
      document.documentElement.dataset.theme = value;
    }, theme);
    await page.locator(".menu-toggle").click();
    await expect(page.locator(".menu-toggle")).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    await page.screenshot({
      path: `test-results/menu-open-390-${theme}.png`,
      animations: "disabled",
    });

    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/contact");
      await page.evaluate((value) => {
        document.documentElement.dataset.theme = value;
      }, theme);
      await page.getByRole("button", { name: /Send inquiry/ }).click();
      await expect(page.locator(".form-status[role='alert']")).toBeVisible();
      await captureContact("validation", width, theme);

      await page.route("**/api/contact", (route) =>
        route.fulfill({
          status: 201,
          contentType: "application/json",
          body: "{}",
        }),
      );
      await fillInquiry();
      await page.getByRole("button", { name: /Send inquiry/ }).click();
      await expect(page.getByRole("status")).toContainText(
        "Your inquiry was received",
      );
      await captureContact("success", width, theme);
      await page.unroute("**/api/contact");

      await page.route("**/api/contact", (route) =>
        route.fulfill({
          status: 503,
          contentType: "application/json",
          body: '{"message":"Unavailable"}',
        }),
      );
      await fillInquiry();
      await page.getByRole("button", { name: /Send inquiry/ }).click();
      await expect(page.locator(".form-status[role='alert']")).toContainText(
        "You can email me directly",
      );
      await captureContact("error", width, theme);
      await page.unroute("**/api/contact");

      await page.context().setOffline(true);
      await fillInquiry();
      await page.getByRole("button", { name: /Send inquiry/ }).click();
      await expect(page.locator(".form-status[role='alert']")).toContainText(
        "offline",
      );
      await captureContact("offline", width, theme);
      await page.context().setOffline(false);
    }
  }
});
