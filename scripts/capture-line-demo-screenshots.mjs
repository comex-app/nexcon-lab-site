import { chromium } from "playwright";
import { statSync } from "fs";
import { mkdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "public", "line-reservation", "screenshots");
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

await capture("01-demo-form-desktop.png", async (page) => {
  await page.goto(`${base}/line-reservation/demo`, { waitUntil: "networkidle" });
  await page.waitForSelector("#demo-form-view");
});

await capture("02-demo-confirm-desktop.png", async (page) => {
  await page.goto(`${base}/line-reservation/demo`, { waitUntil: "networkidle" });
  await page.fill("#guest-name", "山田 太郎");
  await page.selectOption("#guest-count", "2");
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const iso = tomorrow.toISOString().slice(0, 10);
  await page.fill("#reserve-date", iso);
  await page.selectOption("#reserve-time", "18:00");
  await page.click('button[type="submit"]');
  await page.waitForSelector("#demo-confirm-view:not([hidden])");
});

await capture("03-demo-complete-desktop.png", async (page) => {
  await page.goto(`${base}/line-reservation/demo`, { waitUntil: "networkidle" });
  await page.fill("#guest-name", "山田 太郎");
  await page.selectOption("#guest-count", "2");
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  await page.fill("#reserve-date", tomorrow.toISOString().slice(0, 10));
  await page.selectOption("#reserve-time", "18:00");
  await page.click('button[type="submit"]');
  await page.click("#confirm-submit-btn");
  await page.waitForSelector("#demo-complete-view:not([hidden])");
});

await capture("04-demo-line-notify-desktop.png", async (page) => {
  await page.goto(`${base}/line-reservation/demo`, { waitUntil: "networkidle" });
  await page.fill("#guest-name", "山田 太郎");
  await page.selectOption("#guest-count", "2");
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  await page.fill("#reserve-date", tomorrow.toISOString().slice(0, 10));
  await page.selectOption("#reserve-time", "18:00");
  await page.click('button[type="submit"]');
  await page.click("#confirm-submit-btn");
  await page.click("#complete-line-btn");
  await page.waitForSelector("#demo-line-view:not([hidden])");
});

await capture("05-admin-dashboard-desktop.png", async (page) => {
  await page.goto(`${base}/line-reservation/demo/admin`, { waitUntil: "networkidle" });
  await page.waitForSelector("#kpi-month-count");
});

await capture("09-line-reservation-lp-before-after.png", async (page) => {
  await page.goto(`${base}/line-reservation`, { waitUntil: "networkidle" });
  await page.locator("#transformation").scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
});

await capture("10-line-reservation-lp-onboarding.png", async (page) => {
  await page.goto(`${base}/line-reservation`, { waitUntil: "networkidle" });
  await page.locator("#onboarding").scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
});

await capture("11-line-reservation-lp-cta.png", async (page) => {
  await page.goto(`${base}/line-reservation`, { waitUntil: "networkidle" });
  await page.locator("#cta").scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
});

await capture("06-admin-detail-desktop.png", async (page) => {
  await page.goto(`${base}/line-reservation/demo/admin`, { waitUntil: "networkidle" });
  await page.click(".admin-table tbody tr:first-child");
  await page.waitForSelector("#admin-detail-view:not([hidden])");
});

await capture("07-demo-form-mobile.png", async (page) => {
  await page.goto(`${base}/line-reservation/demo`, { waitUntil: "networkidle" });
}, { width: 390, height: 844 });

await capture("08-admin-dashboard-mobile.png", async (page) => {
  await page.goto(`${base}/line-reservation/demo/admin`, { waitUntil: "networkidle" });
}, { width: 390, height: 844 });

await browser.close();
console.log("Done:", outDir);
