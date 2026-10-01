import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const baseUrl = pathToFileURL(path.resolve('dist/index.html')).href;
const outDir = 'release-screenshots';
await fs.mkdir(outDir, { recursive: true });

async function capture({ locale, viewport, file, isMobile = false }) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    locale,
    viewport,
    isMobile,
    deviceScaleFactor: 1,
    reducedMotion: 'reduce'
  });
  const page = await context.newPage();
  await page.goto(baseUrl, { waitUntil: 'load' });
  await page.evaluate(() => { try { localStorage.clear(); } catch {} });
  await page.reload({ waitUntil: 'load' });
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${outDir}/${file}`, fullPage: false });
  await browser.close();
}

await capture({ locale: 'ja-JP', viewport: { width: 1440, height: 1100 }, file: 'screenshot.png' });
await capture({ locale: 'en-US', viewport: { width: 1440, height: 1100 }, file: 'screenshot-en.png' });
await capture({ locale: 'ja-JP', viewport: { width: 390, height: 844 }, isMobile: true, file: 'screenshot-mobile.png' });
