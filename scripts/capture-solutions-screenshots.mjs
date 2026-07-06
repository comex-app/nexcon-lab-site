import { chromium } from "playwright";
import { statSync } from "fs";
import { mkdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "public", "solutions", "screenshots");
const base = process.env.DEMO_URL || "http://localhost:5173";

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();

async function capture(name, fn, viewport = { width: 1280, height: 800 }) {
  const page = await browser.newPage({ viewport });
  await fn(page);
  const file = path.join(outDir, name);
  await page.screenshot({ path: file, type: "png", fullPage: false });
  console.log("Saved", name, statSync(file).size);
  await page.close();
}

await capture("01-solutions-hero-desktop.png", async (page) => {
  await page.goto(`${base}/solutions`, { waitUntil: "networkidle" });
  await page.waitForSelector(".solutions-hero");
});

await capture("02-solutions-industries-desktop.png", async (page) => {
  await page.goto(`${base}/solutions`, { waitUntil: "networkidle" });
  await page.locator("#industries").scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
});

await capture("03-solutions-before-after-desktop.png", async (page) => {
  await page.goto(`${base}/solutions`, { waitUntil: "networkidle" });
  await page.locator("#before-after").scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
});

await capture("04-solutions-packages-desktop.png", async (page) => {
  await page.goto(`${base}/solutions`, { waitUntil: "networkidle" });
  await page.locator("#packages").scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
});

await capture("05-solutions-mobile.png", async (page) => {
  await page.goto(`${base}/solutions`, { waitUntil: "networkidle" });
}, { width: 390, height: 844 });

await browser.close();
console.log("Done:", outDir);
