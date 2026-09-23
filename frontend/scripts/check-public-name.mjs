import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";

const roots = ["src", "public"];
const textExtensions = new Set([
  ".ts",
  ".tsx",
  ".css",
  ".js",
  ".mjs",
  ".json",
  ".txt",
  ".xml",
  ".svg",
  ".html",
  ".md",
]);
const previousPublicName = /\bmd\s+ajmir(?:\s+aribam)?\b/i;
const matches = [];

async function inspect(path) {
  for (const entry of await readdir(path, { withFileTypes: true })) {
    const file = join(path, entry.name);
    if (entry.isDirectory()) {
      await inspect(file);
      continue;
    }
    if (
      !entry.isFile() ||
      !textExtensions.has(entry.name.slice(entry.name.lastIndexOf(".")))
    )
      continue;
    const value = await readFile(file, "utf8");
    if (previousPublicName.test(value))
      matches.push(relative(process.cwd(), file));
  }
}

for (const root of roots) await inspect(root);
if (matches.length) {
  console.error(`Previous public name found in: ${matches.join(", ")}`);
  process.exitCode = 1;
} else {
  console.log("Public name check passed: Ajmir Aribam is canonical.");
}
