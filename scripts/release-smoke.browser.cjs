'use strict';
// Release-candidate smoke checks against the actual generated HTML in Chromium.
// Offline browser operation, file download/import and cross-format checks run without network APIs.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const out = path.join(root, 'test-results', 'release-smoke');
fs.mkdirSync(out, { recursive: true });

async function newPage(browser, file, lang, viewport) {
  const context = await browser.newContext({ locale: lang, viewport, acceptDownloads: true, reducedMotion: 'reduce' });
  const page = await context.newPage();
  const errors = [], network = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('request', request => { if (/^https?:/.test(request.url())) network.push(request.url()); });
  await page.goto(pathToFileURL(path.join(root, file)).href);
  await page.locator('#helpButton').waitFor();
  if ((await page.locator('html').getAttribute('lang')) !== lang) await page.locator('#languageButton').click();
  assert.equal(await page.locator('html').getAttribute('lang'), lang);
  await page.evaluate(() => document.fonts.ready);
  return { context, page, errors, network };
}

async function checkDesktop(browser, file, lang) {
  const { context, page, errors, network } = await newPage(browser, file, lang, { width: 1360, height: 900 });
  try {
    const stamp = file.replace(/[^a-z0-9]/gi, '-');
    assert.ok(await page.locator('#abPlayA').isVisible());
    assert.ok(await page.locator('#scoreSvg').isVisible());
    assert.equal(await page.locator('#projectDataPanel').getAttribute('open'), null,
      file + ': project section must start folded');
    assert.equal(await page.locator('#projectFilename').isVisible(), false);
    if (file === 'dist/index.html') {
      await page.screenshot({ path: path.join(out, lang === 'ja' ? 'screenshot.png' : 'screenshot-en.png'), animations: 'disabled' });
    }

    await page.locator('#projectDataTitle').click();
    assert.ok(await page.locator('#projectFilename').isVisible());
    assert.ok(await page.locator('#exportProjectButton').isVisible());

    if (file === 'dist/index.html' && lang === 'ja') {
      // JSON filename, parseability and round-trip recovery.
      await page.locator('#projectFilename').fill('調律テスト');
      const jsonPending = page.waitForEvent('download', { timeout: 30000 });
      await page.locator('#exportProjectButton').click();
      const jsonDownload = await jsonPending;
      assert.equal(jsonDownload.suggestedFilename(), '調律テスト.json');
      const jsonPath = path.join(out, 'roundtrip.json');
      await jsonDownload.saveAs(jsonPath);
      const json = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      assert.equal(json.kind, 'browser-kitty.tuning-compare-project');
      assert.equal(json.appVersion, '1.0.2');
      assert.ok(json.project?.score && json.project?.abCompare && json.project?.wavExport,
        'JSON project payload must retain complete state');

      await page.locator('#tuningType').selectOption('just');
      assert.equal(await page.locator('#tuningType').inputValue(), 'just');
      await page.locator('#projectFileInput').setInputFiles(jsonPath);
      await page.locator('#appConfirmDialog').waitFor({ state: 'visible' });
      await page.locator('#appConfirmOk').click();
      assert.equal(await page.locator('#tuningType').inputValue(), 'equal', 'import must restore saved tuning');

      // A-only WAV should work even with an invalid B reference frequency.
      await page.locator('#scoreSamplesTitle').click();
      await page.locator('[data-score-sample="majorThird"]').click();
      assert.ok((await page.locator('#scoreSvg .note-head').count()) > 0, 'example must create score notes');
      await page.locator('#abBReferenceFrequency').fill('0');
      await page.locator('#abBReferenceFrequency').dispatchEvent('change');
      await page.locator('#wavTarget').selectOption('a');
      await page.locator('#wavFilename').fill('単独Aテスト');
      const wavPending = page.waitForEvent('download', { timeout: 45000 });
      await page.locator('#exportWavButton').click();
      const wavDownload = await wavPending;
      assert.equal(wavDownload.suggestedFilename(), '単独Aテスト.wav');
      const wavPath = path.join(out, 'a-only.wav');
      await wavDownload.saveAs(wavPath);
      const buf = fs.readFileSync(wavPath);
      assert.ok(buf.length > 44, 'WAV must contain audio samples');
      assert.equal(buf.toString('ascii', 0, 4), 'RIFF');
      assert.equal(buf.toString('ascii', 8, 12), 'WAVE');
      assert.equal(buf.readUInt16LE(20), 1, 'PCM codec');
      assert.equal(buf.readUInt16LE(22), 1, 'mono channel');
      assert.equal(buf.readUInt16LE(34), 16, '16-bit samples');
      assert.ok([44100, 48000].includes(buf.readUInt32LE(24)), 'supported sample rate');
    }
    await page.locator('#projectDataTitle').click();
    assert.equal(await page.locator('#projectFilename').isVisible(), false, 'project drawer re-closes');
    assert.deepEqual(errors, [], file + ' ' + lang + ' console errors');
    assert.deepEqual(network, [], file + ' ' + lang + ' runtime network');
    console.log('PASS desktop ' + stamp + ' ' + lang);
  } finally { await context.close(); }
}

async function checkMobile(browser, lang) {
  const { context, page, errors, network } = await newPage(browser, 'dist/index.html', lang, { width: 393, height: 844 });
  try {
    assert.ok(await page.locator('.app-mobile-bottom-bar').isVisible());
    if (lang === 'ja') {
      await page.screenshot({ path: path.join(out, 'screenshot-mobile.png'), animations: 'disabled' });
    }
    for (const target of ['score', 'tuning', 'sound', 'compare']) {
      await page.locator('[data-mobile-key="' + target + '"]').click();
      assert.equal(await page.locator('[data-mobile-key="' + target + '"]').getAttribute('aria-current'), 'page');
    }
    await page.locator('[data-mobile-key="tuning"]').click();
    assert.equal(await page.locator('#projectFilename').isVisible(), false);
    await page.locator('#projectDataTitle').click();
    const exportButton = page.locator('#exportProjectButton');
    await exportButton.scrollIntoViewIfNeeded();
    assert.ok(await exportButton.isVisible());
    const btn = await exportButton.boundingBox();
    const nav = await page.locator('.app-mobile-bottom-bar').boundingBox();
    assert.ok(btn && nav && btn.y + btn.height <= nav.y + 1, 'project export button must not be covered by fixed bottom bar');
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'no horizontal overflow');
    assert.deepEqual(errors, [], 'mobile ' + lang + ' console errors');
    assert.deepEqual(network, [], 'mobile ' + lang + ' runtime network');
    console.log('PASS mobile ' + lang);
  } finally { await context.close(); }
}

async function main() {
  const browser = await chromium.launch();
  try {
    for (const file of ['dist/index.html', 'dist/index.self-extract.html', 'tuning-compare.html']) {
      for (const lang of ['ja', 'en']) await checkDesktop(browser, file, lang);
    }
    for (const lang of ['ja', 'en']) await checkMobile(browser, lang);
  } finally { await browser.close(); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
