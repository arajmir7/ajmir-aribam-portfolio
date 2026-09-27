import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("personal introduction precedes proof, public work and current work at every acceptance width", async ({
  page,
}) => {
  for (const width of [390, 768, 1440, 1728]) {
    await page.setViewportSize({ width, height: 900 });
    for (const theme of ["light", "dark"]) {
      await page.goto("/");
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await page.evaluate((value) => {
        document.documentElement.dataset.theme = value;
      }, theme);
      await page.evaluate(() => document.fonts.ready);
      await page.locator("img").evaluateAll(async (images) => {
        await Promise.all(
          images.map(async (image) => {
            const visual = image as HTMLImageElement;
            visual.loading = "eager";
            await visual.decode();
          }),
        );
      });

      const introduction = page.locator('[data-section="introduction"]');
      const portrait = introduction.locator("img");
      const proof = page.locator('[data-section="engineering-proof"]');
      const work = page.locator('[data-section="public-work"]');
      const currentWork = page.locator('[data-section="current-work"]');
      const introBounds = (await introduction.boundingBox())!;
      const proofBounds = (await proof.boundingBox())!;
      const workBounds = (await work.boundingBox())!;
      const currentWorkBounds = (await currentWork.boundingBox())!;
      expect(introBounds.y + introBounds.height).toBeGreaterThanOrEqual(900);
      expect(proofBounds.y).toBeGreaterThanOrEqual(900);
      expect(workBounds.y).toBeGreaterThanOrEqual(
        proofBounds.y + proofBounds.height - 1,
      );
      expect(currentWorkBounds.y).toBeGreaterThanOrEqual(
        workBounds.y + workBounds.height - 1,
      );
      await expect(portrait).toHaveCount(1);
      await expect(portrait).toHaveAttribute(
        "src",
        "/images/ajmir-aribam-portrait.jpg",
      );
      expect(
        await portrait.evaluate(
          (image) => (image as HTMLImageElement).naturalWidth,
        ),
      ).toBeGreaterThan(0);
      await expect(
        introduction.locator('img[src*="projects"], article, .project-card'),
      ).toHaveCount(0);
      await expect(introduction.getByRole("heading", { level: 1 })).toHaveText(
        "Ajmir Aribam",
      );
      for (const name of [
        /View my work/,
        /About me/,
        /Get in touch/,
        /Résumé/,
        /GitHub/,
        /LinkedIn/,
      ]) {
        const bounds = (await introduction
          .getByRole("link", { name })
          .boundingBox())!;
        expect(bounds.y + bounds.height).toBeLessThanOrEqual(900);
      }
      const visibleProjectImages = await page
        .locator('img[src*="projects"]')
        .evaluateAll(
          (images) =>
            images.filter((image) => {
              const bounds = image.getBoundingClientRect();
              return (
                bounds.width > 0 &&
                bounds.height > 0 &&
                bounds.top < innerHeight &&
                bounds.bottom > 0
              );
            }).length,
        );
      expect(visibleProjectImages).toBe(0);

      const cards = await work.locator(".project-card").all();
      expect(cards).toHaveLength(4);
      for (const card of cards) {
        await expect(card.getByRole("link")).toHaveCount(2);
        await expect(card.locator(".project-status")).toBeVisible();
        expect(
          (await card.locator(".project-media").boundingBox())!.height,
        ).toBeLessThanOrEqual(190);
      }
      await expect(currentWork.locator(".project-card")).toHaveCount(4);
      await expect(currentWork.locator(".project-media")).toHaveCount(0);
      if (width >= 1440) {
        const bounds = await Promise.all(
          cards.map((card) => card.boundingBox()),
        );
        const contentBounds = (await work.locator(".shell").boundingBox())!;
        expect(
          new Set(bounds.slice(0, 3).map((bound) => Math.round(bound!.y))).size,
        ).toBe(1);
        expect(bounds[3]!.y).toBeGreaterThan(bounds[0]!.y);
        for (const bound of bounds) {
          expect(bound!.width / contentBounds.width).toBeGreaterThanOrEqual(
            0.29,
          );
          expect(bound!.width / contentBounds.width).toBeLessThanOrEqual(0.31);
        }
      }
      await page.screenshot({
        path: `test-results/identity-home-${width}-${theme}-viewport.png`,
        animations: "disabled",
      });
      await page.screenshot({
        path: `test-results/identity-home-${width}-${theme}-full.png`,
        fullPage: true,
        animations: "disabled",
      });
      await page.evaluate(() =>
        window.scrollTo({ top: 900, behavior: "instant" }),
      );
      await page.screenshot({
        path: `test-results/identity-proof-${width}-${theme}-viewport.png`,
        animations: "disabled",
      });
    }
  }
});

test("mobile navigation traps focus, restores it and closes across breakpoints", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const menu = page.getByRole("button", { name: "Open menu" });
  const dialog = page.getByRole("dialog", { name: "Site navigation" });
  await menu.click();
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Close" })).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(
    dialog.getByRole("link", { name: "Contact", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(dialog.getByRole("button", { name: "Close" })).toBeFocused();
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(results.violations).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(menu).toBeFocused();
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await menu.click();
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(dialog).not.toBeVisible();
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
});

test("reduced motion keeps the introduction and its actions usable", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const name = page.getByRole("heading", { level: 1 });
  await expect(name).toBeVisible();
  await expect(name.locator("..")).toHaveCSS("animation-name", "none");
  await page
    .locator('[data-section="introduction"]')
    .getByRole("link", { name: /Résumé/ })
    .click();
  await expect(page).toHaveURL(/\/resume$/);
  await expect(page.getByRole("button", { name: /Print/ })).toBeVisible();
});
