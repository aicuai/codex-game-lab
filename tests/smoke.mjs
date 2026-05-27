import { chromium } from "playwright-core";
import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const baseUrl = process.env.STAR_PICKER_URL || "http://127.0.0.1:5173/";
const screenshotPath = path.join(root, ".logs", "star-picker-smoke.png");

const chromeCandidates = [
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
].filter(Boolean);

const executablePath = chromeCandidates.find((candidate) => existsSync(candidate));

if (!executablePath) {
  throw new Error("No Chrome or Chromium executable found for playwright-core.");
}

mkdirSync(path.dirname(screenshotPath), { recursive: true });

const browser = await chromium.launch({
  executablePath,
  headless: true,
});

const page = await browser.newPage({
  viewport: { width: 1280, height: 860 },
  deviceScaleFactor: 1,
});

const browserErrors = [];
page.on("pageerror", (error) => browserErrors.push(error.message));
page.on("console", (message) => {
  if (message.type() === "error") {
    browserErrors.push(message.text());
  }
});

await page.goto(baseUrl, { waitUntil: "networkidle" });
await page.waitForFunction(() => Boolean(window.__starPicker));

await page.getByRole("button", { name: "Start" }).click();
await page.waitForFunction(() => document.body.dataset.state === "playing");
await page.locator("canvas").click({ position: { x: 480, y: 320 } });

const beforeMove = await page.evaluate(() => window.__starPicker.getSnapshot().player);
await page.keyboard.down("ArrowRight");
await page.waitForTimeout(220);
await page.keyboard.up("ArrowRight");
const afterMove = await page.evaluate(() => window.__starPicker.getSnapshot().player);

if (afterMove.x <= beforeMove.x + 20) {
  throw new Error(`Player did not move right enough: ${JSON.stringify({ beforeMove, afterMove })}`);
}

await page.evaluate(() => window.__starPicker.placeStarAtPlayer());
await page.waitForFunction(() => window.__starPicker.getSnapshot().score > 0);

await page.evaluate(() => window.__starPicker.setTimeLeft(0));
await page.waitForFunction(() => document.body.dataset.state === "gameover");

await page.getByRole("button", { name: "Retry" }).click();
await page.waitForFunction(() => {
  const snapshot = window.__starPicker.getSnapshot();
  return document.body.dataset.state === "playing" && snapshot.score === 0 && snapshot.timeLeft > 29;
});

const finalSnapshot = await page.evaluate(() => window.__starPicker.getSnapshot());

if (browserErrors.length > 0) {
  throw new Error(`Browser errors: ${browserErrors.join(" | ")}`);
}

await page.screenshot({ path: screenshotPath, fullPage: true });
await browser.close();

console.log(
  JSON.stringify(
    {
      ok: true,
      url: baseUrl,
      screenshot: screenshotPath,
      finalSnapshot,
    },
    null,
    2,
  ),
);
