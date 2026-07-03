import { chromium } from "playwright";
import { statSync } from "fs";
import { mkdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const partnersOut = path.join(__dirname, "..", "public", "partners", "screenshots");
const lineOut = path.join(__dirname, "..", "public", "line-reservation", "screenshots");
const base = process.env.DEMO_URL || "http://localhost:5173";

await mkdir(partnersOut, { recursive: true });
await mkdir(lineOut, { recursive: true });

const browser = await chromium.launch();

async function capture(outDir, name, fn, viewport = { width: 1280, height: 800 }) {
  const page = await browser.newPage({ viewport });
  await fn(page);
  const file = path.join(outDir, name);
  await page.screenshot({ path: file, type: "png", fullPage: true });
  console.log("Saved", name, statSync(file).size);
  await page.close();
}

await capture(partnersOut, "01-partners-hero-desktop.png", async (page) => {
  await page.goto(`${base}/partners`, { waitUntil: "networkidle" });
  await page.waitForSelector(".partners-hero h1");
});

await capture(partnersOut, "02-partners-process-desktop.png", async (page) => {
  await page.goto(`${base}/partners`, { waitUntil: "networkidle" });
  await page.locator("#process").scrollIntoViewIfNeeded();
});

await capture(partnersOut, "03-partners-cta-desktop.png", async (page) => {
  await page.goto(`${base}/partners`, { waitUntil: "networkidle" });
  await page.locator(".partners-cta").scrollIntoViewIfNeeded();
});

await capture(partnersOut, "04-partners-mobile.png", async (page) => {
  await page.goto(`${base}/partners`, { waitUntil: "networkidle" });
}, { width: 390, height: 844 });

await capture(lineOut, "14-line-reservation-lp-hero.png", async (page) => {
  await page.goto(`${base}/line-reservation`, { waitUntil: "networkidle" });
  await page.waitForSelector(".line-hero-cta--primary");
}, { width: 1280, height: 800 });

await capture(lineOut, "15-line-reservation-lp-experience.png", async (page) => {
  await page.goto(`${base}/line-reservation`, { waitUntil: "networkidle" });
  await page.locator("#experience").scrollIntoViewIfNeeded();
}, { width: 1280, height: 800 });

await capture(lineOut, "11-line-reservation-lp-cta.png", async (page) => {
  await page.goto(`${base}/line-reservation`, { waitUntil: "networkidle" });
  await page.locator("#cta").scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
}, { width: 1280, height: 800 });

await browser.close();
console.log("Done:", partnersOut, lineOut);
