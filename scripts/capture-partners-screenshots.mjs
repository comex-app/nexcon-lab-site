import { chromium } from "playwright";
import { statSync } from "fs";
import { mkdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "public", "partners", "screenshots");
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

await capture("01-partners-desktop.png", async (page) => {
  await page.goto(`${base}/partners`, { waitUntil: "networkidle" });
  await page.waitForSelector("#founding");
});

await capture("02-partners-founding-desktop.png", async (page) => {
  await page.goto(`${base}/partners`, { waitUntil: "networkidle" });
  await page.locator("#founding").scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
});

await capture("03-partners-tablet.png", async (page) => {
  await page.goto(`${base}/partners`, { waitUntil: "networkidle" });
}, { width: 768, height: 1024 });

await capture("04-partners-mobile.png", async (page) => {
  await page.goto(`${base}/partners`, { waitUntil: "networkidle" });
}, { width: 390, height: 844 });

await browser.close();
console.log("Done:", outDir);
