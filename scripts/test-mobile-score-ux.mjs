import { chromium } from 'playwright';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const appUrl = pathToFileURL(path.resolve('dist/index.html')).href;
const storageKey = 'tuning-compare:settings';
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: 'ja-JP', reducedMotion: 'reduce' });
const page = await context.newPage();

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
async function waitSaved() { await page.waitForTimeout(260); }
async function reset() {
  await page.goto(appUrl, { waitUntil: 'load' });
  await page.evaluate(() => { try { localStorage.clear(); } catch {} });
  await page.reload({ waitUntil: 'load' });
  await page.locator('[data-mobile-key="score"]').click();
  await page.waitForTimeout(120);
}
async function savedScore() {
  await waitSaved();
  return page.evaluate(key => {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw).score : null;
  }, storageKey);
}
async function clickSvgViewBox(x, y) {
  const svg = page.locator('#scoreSvg');
  await svg.evaluate((el, point) => {
    const rect = el.getBoundingClientRect();
    const vb = el.viewBox.baseVal;
    const scaleY = rect.height / vb.height;
    const targetDocumentY = window.scrollY + rect.top + (point.y - vb.y) * scaleY;
    window.scrollTo({ top: Math.max(0, targetDocumentY - window.innerHeight * 0.5), behavior: 'auto' });
  }, { x, y });
  await page.waitForTimeout(80);
  const point = await svg.evaluate((el, point) => {
    const rect = el.getBoundingClientRect();
    const vb = el.viewBox.baseVal;
    return {
      x: rect.left + ((point.x - vb.x) / vb.width) * rect.width,
      y: rect.top + ((point.y - vb.y) / vb.height) * rect.height
    };
  }, { x, y });
  assert(point.y > 0 && point.y < 844, 'Target staff point is not visible after scrolling');
  await page.mouse.click(point.x, point.y);
}

await reset();

// Samples are closed by default and expandable.
const samples = page.locator('.score-samples');
assert(!(await samples.getAttribute('open')), 'Sample-score disclosure should be closed by default');
assert(!(await page.locator('.score-sample-actions').isVisible()), 'Sample actions should be hidden while disclosure is closed');
await page.locator('.score-samples > summary').click();
assert(await page.locator('.score-sample-actions').isVisible(), 'Sample actions did not appear after opening disclosure');
await page.locator('.score-samples > summary').click();
assert(!(await page.locator('.score-sample-actions').isVisible()), 'Sample disclosure did not close again');

// Variable measure count starts at 4 and grows to 5.
assert((await page.locator('#scoreMeasureCount').textContent()).trim() === '4', 'Initial measure count is not 4');
const height4 = await page.locator('#scoreSvg').evaluate(svg => svg.viewBox.baseVal.height);
await page.locator('#scoreMeasurePlus').click();
assert((await page.locator('#scoreMeasureCount').textContent()).trim() === '5', 'Measure + did not change count to 5');
let score = await savedScore();
assert(score?.measureCount === 5, 'Measure count 5 was not persisted');
const height5 = await page.locator('#scoreSvg').evaluate(svg => svg.viewBox.baseVal.height);
assert(height5 > height4, 'SVG did not grow after adding a measure');

// Add a note in measure 5, then verify shrinking asks before deleting it.
await page.locator('#scoreModeNote').click();
await page.locator('[data-duration="1"]').click();
await clickSvgViewBox(110, 710); // Measure 5, around C4.
score = await savedScore();
assert(score.events.some(event => event.start >= 16), 'Could not add an event in measure 5');

await page.locator('#scoreMeasureMinus').click();
assert(await page.locator('#appConfirmDialog').getAttribute('open') !== null, 'Reducing measures with removed events did not ask for confirmation');
await page.locator('#appConfirmCancel').click();
assert((await page.locator('#scoreMeasureCount').textContent()).trim() === '5', 'Cancelling measure reduction changed the score');

await page.locator('#scoreMeasureMinus').click();
await page.locator('#appConfirmOk').click();
score = await savedScore();
assert(score.measureCount === 4, 'Confirmed reduction did not change count to 4');
assert(!score.events.some(event => event.start >= 16), 'Confirmed reduction did not remove out-of-range event');

// Undo restores both measure count and removed event.
await page.locator('#scoreUndo').click();
score = await savedScore();
assert(score.measureCount === 5, 'Undo did not restore measure count');
assert(score.events.some(event => event.start >= 16), 'Undo did not restore event removed by measure reduction');

// Sticky mobile quick tools stay visible while scrolling through the score.
const quick = page.locator('.score-mobile-quick-tools');
assert(await quick.isVisible(), 'Mobile quick score controls are not visible');
await page.evaluate(() => {
  const svg = document.querySelector('#scoreSvg');
  const rect = svg.getBoundingClientRect();
  window.scrollTo({ top: window.scrollY + rect.top + rect.height * 0.68, behavior: 'auto' });
});
await page.waitForTimeout(100);
const quickBox = await quick.boundingBox();
assert(quickBox, 'Could not measure mobile quick toolbar');
assert(quickBox.y >= 60 && quickBox.y < 120, 'Mobile quick toolbar is not sticking below the app header');
assert(quickBox.y + quickBox.height < 260, 'Mobile quick toolbar takes too much vertical space');
assert(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), 'Mobile score page has horizontal overflow');

// Quick controls actually change the main editing state.
await page.locator('#scoreMobileModeRest').click();
assert(await page.locator('#scoreModeRest').getAttribute('aria-pressed') === 'true', 'Quick Rest toggle did not sync main score mode');
await page.locator('#scoreMobileQuickDuration').selectOption('0.25');
assert(await page.locator('[data-duration="0.25"]').getAttribute('aria-pressed') === 'true', 'Quick duration did not sync main duration');

// Playback controls have a visible gap below the score canvas.
await page.evaluate(() => document.querySelector('#scoreSvg').scrollIntoView({ block: 'end', behavior: 'auto' }));
await page.waitForTimeout(100);
const gap = await page.evaluate(() => {
  const canvas = document.querySelector('.score-canvas-shell').getBoundingClientRect();
  const transport = document.querySelector('.score-transport').getBoundingClientRect();
  return transport.top - canvas.bottom;
});
assert(gap >= 14, 'Playback controls are still too close to the score canvas');

console.log('[OK] mobile score UX and variable-measure regression passed');
await browser.close();
