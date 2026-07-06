import { chromium } from "playwright";
import { statSync } from "fs";
import { mkdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "public", "pricing", "screenshots");
const base = process.env.DEMO_URL || "http://localhost:5173";

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();

async function capture(name, fn, viewport = { width: 1280, height: 800 }) {
  const page = await browser.newPage({ viewport });
  await fn(page);
  const file = path.join(outDir, name);
  await page.screenshot({ path: file, type: "png", fullPage: true });
  console.log("Saved", name, statSync(file).size);
  await page.close();
}

await capture("01-pricing-hero-desktop.png", async (page) => {
  await page.goto(`${base}/pricing`, { waitUntil: "networkidle" });
  await page.waitForSelector(".pricing-cards");
});

await capture("02-pricing-platform-card-desktop.png", async (page) => {
  await page.goto(`${base}/pricing`, { waitUntil: "networkidle" });
  await page.locator(".pricing-platform-info").scrollIntoViewIfNeeded();
});

await capture("03-pricing-compare-desktop.png", async (page) => {
  await page.goto(`${base}/pricing`, { waitUntil: "networkidle" });
  await page.locator(".pricing-table-wrap").scrollIntoViewIfNeeded();
});

await capture("04-pricing-philosophy-desktop.png", async (page) => {
  await page.goto(`${base}/pricing`, { waitUntil: "networkidle" });
  await page.locator(".pricing-philosophy").scrollIntoViewIfNeeded();
});

await capture("05-pricing-mobile.png", async (page) => {
  await page.goto(`${base}/pricing`, { waitUntil: "networkidle" });
}, { width: 390, height: 844 });

await browser.close();
console.log("Done:", outDir);
