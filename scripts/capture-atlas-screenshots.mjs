import { chromium } from "playwright";
import { statSync } from "fs";
import { mkdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "public", "atlas");

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

async function shot(name, fn) {
  await fn();
  const file = path.join(outDir, name);
  await page.screenshot({ path: file, type: "png" });
  console.log("Saved", name, statSync(file).size);
}

await shot("screenshot-dashboard.png", async () => {
  await page.goto("http://localhost:5173/", { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(4000);
});

await shot("screenshot-agent-detail.png", async () => {
  await page.goto("http://localhost:5173/agents/e2e-test-agent", {
    waitUntil: "networkidle",
    timeout: 60000,
  });
  await page.waitForSelector(".agent-detail-page, .page", { timeout: 15000 });
  await page.waitForTimeout(2000);
});

await shot("screenshot-finding-detail.png", async () => {
  await page.goto("http://localhost:5173/", { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(4000);
  const detailLink = page.locator('a[href^="/findings/"]').first();
  await detailLink.waitFor({ timeout: 15000 });
  await detailLink.click();
  await page.waitForURL(/\/findings\//, { timeout: 15000 });
  await page.waitForSelector(".finding-detail-page", { timeout: 15000 });
  await page.waitForTimeout(2000);
});

await browser.close();
