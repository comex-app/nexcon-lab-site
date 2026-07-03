import { chromium } from "playwright";
import { statSync } from "fs";
import { mkdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "public", "home", "screenshots");
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

await capture("01-home-hero-desktop.png", async (page) => {
  await page.goto(`${base}/`, { waitUntil: "networkidle" });
  await page.waitForSelector("#hero h1");
});

await capture("02-home-platform-desktop.png", async (page) => {
  await page.goto(`${base}/#platform`, { waitUntil: "networkidle" });
  await page.waitForSelector(".platform-diagram");
});

await capture("03-home-pricing-ecosystem-desktop.png", async (page) => {
  await page.goto(`${base}/#ecosystem`, { waitUntil: "networkidle" });
  await page.waitForSelector(".ecosystem-grid");
});

await capture("04-home-mobile.png", async (page) => {
  await page.goto(`${base}/`, { waitUntil: "networkidle" });
}, { width: 390, height: 844 });

await browser.close();
console.log("Done:", outDir);
