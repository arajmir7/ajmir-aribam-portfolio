import { chromium } from "@playwright/test";
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const destinations = [
  {
    project: "azaeron",
    url: "https://invoice.web-com.live/",
    match: /Azaeron/i,
    authority: "src/content/projects.ts",
    kind: "public surface",
  },
  {
    project: "shapes-india",
    url: "https://shapesindia.org/",
    match: /SHAPES/i,
    authority:
      "ShapesIndia/.env.example SITE_URL; ShapesIndia/config.py SITE_URL",
    kind: "public surface",
  },
  {
    project: "friends-aluminium-works",
    url: "https://friendsaluminiumworks.com/",
    match: /Friends Aluminium/i,
    authority: "src/content/projects.ts",
    kind: "public surface",
  },
  {
    project: "zam-zam-academy",
    url: "https://storied-bombolone-5d4a8f.netlify.app/",
    match: /Zam.?Zam|Academy/i,
    authority: "src/content/projects.ts",
    kind: "hosted prototype",
  },
];
const browser = await chromium.launch();
const records = [];
try {
  await mkdir(path.join(root, "../.qa-refinement/public-raw"), {
    recursive: true,
  });
  await Promise.all(
    destinations.map(async (destination) => {
      for (const viewport of [
        { width: 1440, height: 900 },
        { width: 390, height: 844 },
      ]) {
        const page = await browser.newPage({
          viewport,
          reducedMotion: "reduce",
          colorScheme: "light",
        });
        try {
          const response = await page.goto(destination.url, {
            waitUntil: "domcontentloaded",
            timeout: 45000,
          });
          if (!response?.ok())
            throw new Error(
              `${destination.project}: HTTP ${response?.status()}`,
            );
          await page.locator("body").waitFor();
          await page.getByRole("heading", { level: 1 }).first().waitFor();
          await page.evaluate(async () => {
            await document.fonts.ready;
            const images = [...document.images].filter((image) => {
              const box = image.getBoundingClientRect();
              return box.top < innerHeight && box.bottom > 0;
            });
            await Promise.all(
              images.map((image) => image.decode().catch(() => {})),
            );
          });
          const content = await page.locator("body").innerText();
          if (!destination.match.test(content))
            throw new Error(`${destination.project}: unexpected destination`);
          // Allow lazy layout work to settle, then require two matching viewport geometry samples.
          let previous = "";
          let stable = 0;
          for (let attempt = 0; attempt < 12 && stable < 2; attempt++) {
            const current = await page.evaluate(() =>
              JSON.stringify({
                height: document.body.scrollHeight,
                elements: [
                  ...document.querySelectorAll("h1, header, main, img"),
                ]
                  .slice(0, 20)
                  .map((element) => {
                    const b = element.getBoundingClientRect();
                    return [b.x, b.y, b.width, b.height];
                  }),
              }),
            );
            stable = current === previous ? stable + 1 : 0;
            previous = current;
            await page.waitForTimeout(350);
          }
          if (stable < 2)
            throw new Error(`${destination.project}: layout did not settle`);
          const device = viewport.width === 1440 ? "desktop" : "mobile";
          const raw = path.join(
            root,
            `../.qa-refinement/public-raw/${destination.project}-${device}.png`,
          );
          const asset = `/images/projects/${destination.project}-public-${device}.webp`;
          await page.screenshot({ path: raw, animations: "disabled" });
          await sharp(raw)
            .webp({ quality: 84, effort: 6 })
            .toFile(path.join(root, "public", asset));
          const failedImages = await page.locator("img").evaluateAll((images) =>
            images
              .filter((image) => {
                const b = image.getBoundingClientRect();
                return (
                  b.top < innerHeight &&
                  b.bottom > 0 &&
                  (!image.complete || image.naturalWidth === 0)
                );
              })
              .map((image) => image.src),
          );
          records.push({
            project: destination.project,
            sourceUrl: destination.url,
            finalUrl: page.url(),
            captureDate: new Date().toISOString(),
            viewport,
            assetPath: asset,
            status: response.status(),
            title: await page.title(),
            kind: destination.kind,
            authority: destination.authority,
            failedVisibleImages: failedImages,
          });
          console.log(
            `${destination.project} ${device}: HTTP ${response.status()} → ${asset}; broken visible images: ${failedImages.length}`,
          );
        } finally {
          await page.close();
        }
      }
    }),
  );
  records.sort(
    (a, b) =>
      a.project.localeCompare(b.project) || b.viewport.width - a.viewport.width,
  );
  await writeFile(
    path.join(root, "src/content/public-captures.json"),
    JSON.stringify(records, null, 2) + "\n",
  );
} finally {
  await browser.close();
}
