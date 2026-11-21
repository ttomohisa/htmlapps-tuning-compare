'use strict';
// Run against the official generated files in the unprivileged PR build job.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require('playwright');

async function main() {
  const results = path.resolve(__dirname, '..', 'test-results', 'mobile-help');
  fs.mkdirSync(results, { recursive: true });
  const browser = await chromium.launch();
  try {
    for (const file of ['dist/index.html', 'dist/index.self-extract.html', 'tuning-compare.html']) {
      for (const language of ['ja', 'en']) {
        for (const [width, height] of [[1360, 900], [821, 700], [820, 700], [601, 568], [600, 568], [521, 700], [520, 700], [393, 640], [360, 640], [320, 568], [393, 252]]) {
          const context = await browser.newContext({ viewport: { width, height }, locale: language, reducedMotion: 'reduce' });
          const page = await context.newPage();
          const errors = [], requests = [];
          page.on('pageerror', error => errors.push(error.message));
          page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
          page.on('request', request => { if (/^https?:/.test(request.url())) requests.push(request.url()); });
          const label = `${file} ${language} ${width}x${height}`;
          try {
            await page.goto(pathToFileURL(path.resolve(__dirname, '..', file)).href);
            await page.locator('#helpButton').waitFor();
            if (await page.locator('html').getAttribute('lang') !== language) await page.locator('#languageButton').click();
            assert.equal(await page.locator('[data-i18n="localBadge"]').textContent(), language === 'en' ? 'Fully local processing' : '完全ローカル処理', label);
            assert.equal(await page.locator('.local-badge').isVisible(), width > 600, label + ': mobile badge hidden, desktop badge visible');
            if (width > 600) {
              assert.ok(await page.locator('.local-badge').evaluate(el => {
                const box = el.getBoundingClientRect();
                const range = document.createRange();
                range.selectNodeContents(el.querySelector('[data-i18n="localBadge"]'));
                return box.left >= 0 && box.right <= innerWidth && el.scrollWidth <= el.clientWidth + 1
                  && [...range.getClientRects()].every(rect => rect.left >= box.left - 1 && rect.right <= box.right + 1 && rect.top >= box.top - 1 && rect.bottom <= box.bottom + 1);
              }), label + ': badge text fits');
            }
            assert.equal(await page.locator('footer').isVisible(), width > 600, label);
            assert.equal(await page.locator('.app-mobile-bottom-bar').isVisible(), width <= 600, label + ': functional navigation preserved');
            assert.equal(await page.locator('.page-intro').isVisible(), true, label + ': intro shown before tab selection');

            const layoutBoundaries = await page.evaluate(() => {
              function border(selector, side) {
                const element = document.querySelector(selector);
                if (!element) return null;
                return getComputedStyle(element).getPropertyValue('border-' + side + '-width');
              }
              return {
                outer: border('.workspace', 'top'),
                abSlot: border('.ab-slot', 'top'),
                abDivider: border('.ab-slot[data-slot="b"]', innerWidth <= 820 ? 'top' : 'left'),
                wav: border('.wav-export-panel', 'left'),
                project: border('.project-data-panel', 'left'),
                learning: border('.learning-panel', 'left'),
                comparisonTable: border('.comparison-table-wrap', 'top'),
                scoreCanvas: border('.score-canvas-shell', 'top'),
              };
            });
            assert.equal(layoutBoundaries.outer, '1px', label + ': outer workspace has a subtle boundary');
            assert.equal(layoutBoundaries.abSlot, '0px', label + ': A/B settings are not nested cards');
            assert.equal(layoutBoundaries.abDivider, '1px', label + ': A/B still have a responsive divider');
            for (const key of ['wav', 'project', 'learning']) {
              assert.equal(layoutBoundaries[key], '0px', label + ': ' + key + ' is not an inset frame');
            }
            assert.equal(layoutBoundaries.comparisonTable, '1px', label + ': comparison table remains bounded');
            assert.equal(layoutBoundaries.scoreCanvas, '1px', label + ': score editing area remains bounded');

            // Check actual element positions; border-only tests missed the 520px A/B padding regression.
            const assertLeftAligned = async (group, selectors) => {
              const rects = await page.evaluate(items => items.map(selector => {
                const element = document.querySelector(selector);
                if (!element) return { selector, missing: true };
                const bounds = element.getBoundingClientRect();
                return { selector, left: bounds.left, right: bounds.right, width: bounds.width, visible: bounds.width > 0 && bounds.height > 0 };
              }), selectors);
              assert.ok(rects.every(rect => !rect.missing && rect.visible), label + ': ' + group + ' missing or hidden ' + JSON.stringify(rects));
              const left = rects[0].left;
              for (const rect of rects) {
                assert.ok(Math.abs(rect.left - left) <= 1, label + ': ' + group + ' left-edge mismatch ' + JSON.stringify(rects));
                assert.ok(rect.left >= -1 && rect.right <= width + 1, label + ': ' + group + ' outside viewport ' + JSON.stringify(rect));
              }
            };
            if (width <= 820) {
              await assertLeftAligned('A/B header and controls', [
                '.compare-workspace > .ab-grid',
                '.ab-slot[data-slot="a"]',
                '.ab-slot[data-slot="a"] .ab-slot-head',
                '.ab-slot[data-slot="a"] .ab-fields',
                '.ab-slot[data-slot="a"] .ab-fields label:first-child',
                '.ab-slot[data-slot="b"]',
                '.ab-slot[data-slot="b"] .ab-slot-head',
                '.ab-slot[data-slot="b"] .ab-fields',
                '.ab-slot[data-slot="b"] .ab-fields label:first-child',
              ]);
              const abTitles = await page.evaluate(() => {
                const a = document.querySelector('#abATitle').getBoundingClientRect();
                const b = document.querySelector('#abBTitle').getBoundingClientRect();
                const styleA = getComputedStyle(document.querySelector('.ab-slot[data-slot="a"]'));
                const styleB = getComputedStyle(document.querySelector('.ab-slot[data-slot="b"]'));
                return { aLeft: a.left, bLeft: b.left, paddingA: styleA.paddingLeft, paddingB: styleB.paddingLeft };
              });
              assert.ok(Math.abs(abTitles.aLeft - abTitles.bLeft) <= 1, label + ': A/B title left edge ' + JSON.stringify(abTitles));
              assert.equal(abTitles.paddingA, abTitles.paddingB, label + ': equal A/B inset');
            }
            await assertLeftAligned('compare section', [
              '.compare-workspace > .workspace-head',
              '.compare-workspace > .ab-grid',
            ]);
            await assertLeftAligned('comparison target section', [
              '.compare-target-workspace > .workspace-head',
              '.compare-target-workspace > .compare-builder',
              '.compare-target-workspace .comparison-table-wrap',
              '.compare-target-workspace .learning-panel',
              '.compare-target-workspace .compare-transport',
            ]);
            if (width > 600) {
              await assertLeftAligned('score section', [
                '#mobileScorePage > .workspace-head',
                '#mobileScorePage > .score-toolbar',
                '#mobileScorePage > .score-canvas-shell',
                '#mobileScorePage > .wav-export-panel',
              ]);
              await assertLeftAligned('tuning section', [
                '#mobileTuningPage > h2',
                '#mobileTuningPage > .tuning-controls',
                '#mobileTuningPage > .tuning-table-wrap',
                '#mobileTuningPage > .project-data-panel',
                '#mobileTuningPage .project-data-head',
              ]);
              await assertLeftAligned('sound settings section', [
                '#mobileSoundPage > .sound-card > h2',
                '#mobileSoundPage > .sound-card > .settings-grid',
                '#mobileSoundPage .sound-advanced',
                '#mobileSoundPage .engine-state',
              ]);
            }

            if (width <= 600) {
              for (const key of ['compare', 'score', 'tuning', 'sound']) {
                await page.locator('[data-mobile-key="' + key + '"]').click();
                assert.equal(await page.locator('.page-intro').isVisible(), false, label + ': intro hidden after tapping ' + key);
                assert.equal(await page.locator('[data-mobile-key="' + key + '"]').getAttribute('aria-current'), 'page', label + ': active tab ' + key);
                if (key === 'score') {
                  await assertLeftAligned('mobile score section', [
                    '#mobileScorePage > .workspace-head',
                    '#mobileScorePage > .score-toolbar',
                    '#mobileScorePage > .score-canvas-shell',
                    '#mobileScorePage > .wav-export-panel',
                  ]);
                }
                if (key === 'tuning') {
                  await assertLeftAligned('mobile tuning section', [
                    '#mobileTuningPage > h2',
                    '#mobileTuningPage > .tuning-controls',
                    '#mobileTuningPage > .tuning-table-wrap',
                    '#mobileTuningPage > .project-data-panel',
                    '#mobileTuningPage .project-data-head',
                  ]);
                }
                if (key === 'sound') {
                  await assertLeftAligned('mobile sound settings section', [
                    '#mobileSoundPage > .sound-card > h2',
                    '#mobileSoundPage > .sound-card > .settings-grid',
                    '#mobileSoundPage .sound-advanced',
                    '#mobileSoundPage .engine-state',
                  ]);
                  await assertLeftAligned('mobile audition section', [
                    '#mobileSoundPage > .card:first-child > h2',
                    '#mobileSoundPage > .card:first-child .frequency-row',
                    '#mobileSoundPage > .card:first-child .chord-list',
                    '#mobileSoundPage > .card:first-child .transport',
                  ]);
                }
              }
              await page.locator('[data-mobile-key="score"]').click();
              const symbols = await page.locator('#scoreSvg').evaluate(svg => {
                const clef=svg.querySelector('.clef-outline')?.getBoundingClientRect();
                const numbers=Array.from(svg.querySelectorAll('.time-signature')).slice(0,2).map(el => el.getBoundingClientRect());
                const firstNoteStart=svg.querySelector('.score-hitbox')?.getBoundingClientRect();
                return clef && numbers.length===2 && firstNoteStart ? {
                  clef: {left:clef.left,right:clef.right,top:clef.top,bottom:clef.bottom},
                  top: {left:numbers[0].left,right:numbers[0].right,top:numbers[0].top,bottom:numbers[0].bottom},
                  bottom: {left:numbers[1].left,right:numbers[1].right,top:numbers[1].top,bottom:numbers[1].bottom},
                  firstNoteX:firstNoteStart.left,
                  numeralBaselineGap:Number(svg.querySelectorAll('.time-signature')[1].getAttribute('y'))-Number(svg.querySelectorAll('.time-signature')[0].getAttribute('y')),
                  numeralFontSize:parseFloat(getComputedStyle(svg.querySelector('.time-signature')).fontSize)
                } : null;
              });
              assert.ok(symbols && symbols.clef.right + 2 <= Math.min(symbols.top.left,symbols.bottom.left), label + ': clef does not overlap time signature ' + JSON.stringify(symbols));
              assert.ok(symbols.numeralBaselineGap >= symbols.numeralFontSize + 2, label + ': time-signature digits have separate baselines ' + JSON.stringify(symbols));
              assert.ok(symbols.bottom.right + 2 <= symbols.firstNoteX, label + ': first measure starts after time signature ' + JSON.stringify(symbols));
              if(file === 'dist/index.html' && width === 320) {
                await page.screenshot({ path: path.join(results, 'score-' + language + '-320.png') });
              }
              await page.locator('[data-mobile-key="tuning"]').click();
              assert.equal(await page.locator('#projectFilename + .filename-extension').textContent(), '.json', label + ': fixed extension');
              assert.equal(await page.locator('.project-schema').count(), 0, label + ': no schema badge');
              assert.equal(await page.locator('#projectFilenameHelp').count(), 0, label + ': no redundant extension help');
              assert.ok(await page.locator('.project-data-actions').evaluate(el =>
                el.scrollWidth <= el.clientWidth + 1 && Array.from(el.querySelectorAll('button')).every(button => button.scrollWidth <= button.clientWidth + 1)
              ), label + ': JSON actions fit on mobile');
            }
            assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), label + ': page width');

            await page.locator('#helpButton').click();
            const body = page.locator('#helpDialog .dialog-body');
            await body.evaluate(el => { el.scrollTop = el.scrollHeight; });
            const finalItem = body.locator('[data-i18n="helpNoteStorage"]');
            // The final localized paragraph may be taller than a short viewport.
            // Its last character must be visible after scrolling to the end.
            const finalBox = await finalItem.evaluate(el => {
              const text = el.firstChild;
              const range = document.createRange();
              range.setStart(text, Math.max(0, text.length - 1));
              range.setEnd(text, text.length);
              const box = range.getBoundingClientRect();
              return { x: box.x, y: box.y, width: box.width, height: box.height };
            }), bodyBox = await body.boundingBox();
            console.log('GEOMETRY ' + label + ': ' + JSON.stringify({ finalBox, bodyBox, viewportHeight: height }));
            assert.ok(finalBox && bodyBox && finalBox.y >= 0 && finalBox.y + finalBox.height <= height && finalBox.y >= bodyBox.y - 1 && finalBox.y + finalBox.height <= bodyBox.y + bodyBox.height + 1, label + ': final Help item reachable');
            assert.ok(await body.evaluate(el => el.scrollWidth <= el.clientWidth + 1), label + ': Help width');
            const headerBox = await page.locator('#helpDialog .dialog-header').boundingBox();
            assert.ok(headerBox && headerBox.y >= 0 && headerBox.y + headerBox.height <= height, label + ': header visible');
            if (file === 'dist/index.html' && [1360, 320].includes(width)) {
              await page.screenshot({ path: path.join(results, `help-${language}-${width}.png`) });
            }
            const dialogBox = await page.locator('#helpDialog').boundingBox();
            assert.ok(finalBox.y >= dialogBox.y && finalBox.y + finalBox.height <= dialogBox.y + dialogBox.height, label + ': final Help item inside dialog');
            assert.ok(dialogBox.y > 1, label + ': top coordinate is genuine backdrop');
            const beforeScroll = await page.evaluate(() => scrollY);
            await page.mouse.move(2, 1);
            await page.mouse.wheel(0, 400);
            await page.waitForTimeout(100);
            console.log('INFO ' + label + ': existing backdrop-wheel page scroll ' + beforeScroll + ' -> ' + await page.evaluate(() => scrollY));
            await page.keyboard.press('Escape');
            assert.equal(await page.locator('#helpDialog').isVisible(), false, label + ': Escape');
            await page.locator('#helpButton').click();
            await page.locator('#closeHelpButton').click();
            assert.equal(await page.locator('#helpDialog').isVisible(), false, label + ': reopen and Close');
            await page.locator('#helpButton').click();
            await page.mouse.click(2, 1);
            assert.equal(await page.locator('#helpDialog').isVisible(), false, label + ': backdrop');
            assert.deepEqual(errors, [], label + ': console errors');
            assert.deepEqual(requests, [], label + ': external runtime requests');
            console.log('PASS ' + label);
          } catch (error) {
            await page.screenshot({ path: path.join(results, `failure-${file.replace(/[^a-z0-9]/gi, '-')}-${language}-${width}x${height}.png`) }).catch(() => {});
            throw error;
          } finally {
            await context.close();
          }
        }
      }
    }
  } finally {
    await browser.close();
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
