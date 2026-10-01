import { chromium } from 'playwright';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const appUrl = pathToFileURL(path.resolve('dist/index.html')).href;
const storageKey = 'tuning-compare:settings';
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1050 }, locale: 'en-US', reducedMotion: 'reduce' });
const page = await context.newPage();

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
async function waitSaved() {
  await page.waitForTimeout(260);
}
async function reset() {
  await page.goto(appUrl, { waitUntil: 'load' });
  await page.evaluate(() => { try { localStorage.clear(); } catch {} });
  await page.reload({ waitUntil: 'load' });
  await page.locator('#scoreSvg').scrollIntoViewIfNeeded();
}
async function savedScore() {
  await waitSaved();
  return page.evaluate(key => {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw).score : null;
  }, storageKey);
}
async function svgPoint(x, y) {
  return page.locator('#scoreSvg').evaluate((svg, point) => {
    const rect = svg.getBoundingClientRect();
    const vb = svg.viewBox.baseVal;
    return {
      x: rect.left + ((point.x - vb.x) / vb.width) * rect.width,
      y: rect.top + ((point.y - vb.y) / vb.height) * rect.height
    };
  }, { x, y });
}
async function clickSvg(x, y) {
  await page.locator('#scoreSvg').scrollIntoViewIfNeeded();
  const p = await svgPoint(x, y);
  await page.mouse.click(p.x, p.y);
}
async function dragLocator(locator, dx, dy = 0, holdMs = 0) {
  const box = await locator.boundingBox();
  assert(box, 'Could not resolve drag target bounding box');
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  if (holdMs) await page.waitForTimeout(holdMs);
  await page.mouse.move(x + dx, y + dy, { steps: 8 });
  await page.mouse.up();
}
async function createQuarterChord() {
  await reset();
  await page.locator('[data-duration="1"]').click();
  await page.locator('#scoreModeNote').click();
  await clickSvg(104, 132); // C4, beat 0
  await clickSvg(104, 120); // E4, same start
  const score = await savedScore();
  assert(score?.events?.length === 1, 'Quarter chord should be one score event');
  assert(score.events[0].notes.length === 2, 'Quarter chord should contain two notes');
  return score.events[0];
}

// Sixteenth note input and 0.25-beat snapping.
await reset();
await page.locator('[data-duration="0.25"]').click();
await clickSvg(118, 132); // C4 near beat 0.25
let score = await savedScore();
assert(score.events.length === 1, 'Sixteenth note was not added');
assert(score.events[0].duration === 0.25, 'Sixteenth note duration is not 0.25');
assert(Math.abs(score.events[0].start - 0.25) < 0.001, 'Sixteenth note did not snap to beat 0.25');

// Sixteenth rest rendering and persistence.
await reset();
await page.locator('#scoreModeRest').click();
await page.locator('[data-duration="0.25"]').click();
await clickSvg(118, 120);
score = await savedScore();
assert(score.events.length === 1 && score.events[0].rest === true, 'Sixteenth rest was not added');
assert(score.events[0].duration === 0.25, 'Sixteenth rest duration is not 0.25');
assert(await page.locator('.sixteenth-rest-glyph').count() === 1, 'Sixteenth rest glyph is missing');

// Selected chord pitch lane: add G4 to C4+E4 without changing the start.
await createQuarterChord();
assert(await page.locator('.score-chord-add-lane').count() === 1, 'Selected chord pitch lane is missing');
await clickSvg(130, 108); // G4 via the assist lane, outside the note hitboxes.
score = await savedScore();
assert(score.events.length === 1, 'Pitch-lane addition should stay in the same chord event');
assert(score.events[0].notes.length === 3, 'Pitch lane did not add a third chord tone');
const triadNotes = score.events[0].notes.map(note => note.display).sort();

// Horizontal chord drag: move timing, keep every pitch unchanged despite small vertical jitter.
const chordHit = page.locator('.score-note-hitbox').first();
const chordStartBefore = score.events[0].start;
await dragLocator(chordHit, 118, 7);
score = await savedScore();
assert(score.events[0].start !== chordStartBefore, 'Horizontal chord drag did not change start time');
assert(JSON.stringify(score.events[0].notes.map(note => note.display).sort()) === JSON.stringify(triadNotes), 'Horizontal chord drag changed chord pitches');

// Vertical chord-note drag: keep chord start fixed and alter only one grabbed pitch.
const verticalStart = score.events[0].start;
const beforeVertical = score.events[0].notes.map(note => note.display).sort();
await dragLocator(page.locator('.score-note-hitbox').first(), 1, -22);
score = await savedScore();
assert(Math.abs(score.events[0].start - verticalStart) < 0.001, 'Vertical chord-note drag changed chord start');
const afterVertical = score.events[0].notes.map(note => note.display).sort();
assert(JSON.stringify(beforeVertical) !== JSON.stringify(afterVertical), 'Vertical chord-note drag did not change the grabbed pitch');

// Long-press duplication: preserve voicing and duration, place later in the score.
const source = score.events[0];
const sourceNotes = source.notes.map(note => ({ note: note.note, display: note.display, accidental: note.accidental })).sort((a,b)=>a.display.localeCompare(b.display));
const box = await page.locator('.score-note-hitbox').first().boundingBox();
assert(box, 'Could not resolve chord long-press target');
await page.mouse.move(box.x + box.width/2, box.y + box.height/2);
await page.mouse.down();
await page.waitForTimeout(650);
await page.mouse.up();
score = await savedScore();
assert(score.events.length === 2, 'Long-press chord duplication did not create a second event');
const duplicate = score.events.find(event => event.id !== source.id);
assert(duplicate, 'Duplicated chord event is missing');
assert(duplicate.start > source.start, 'Duplicated chord was not placed after the source');
assert(duplicate.duration === source.duration, 'Duplicated chord duration changed');
const duplicateNotes = duplicate.notes.map(note => ({ note: note.note, display: note.display, accidental: note.accidental })).sort((a,b)=>a.display.localeCompare(b.display));
assert(JSON.stringify(duplicateNotes) === JSON.stringify(sourceNotes), 'Duplicated chord voicing/accidentals changed');

// Rest horizontal drag: change only the start position.
await reset();
await page.locator('#scoreModeRest').click();
await page.locator('[data-duration="1"]').click();
await clickSvg(104, 120);
score = await savedScore();
assert(score.events.length === 1 && score.events[0].rest, 'Quarter rest setup failed');
const restBefore = { start: score.events[0].start, duration: score.events[0].duration };
await dragLocator(page.locator('.score-rest-hitbox'), 118, 5);
score = await savedScore();
assert(score.events[0].start !== restBefore.start, 'Rest horizontal drag did not change start');
assert(score.events[0].duration === restBefore.duration, 'Rest horizontal drag changed duration');
assert(score.events[0].rest === true && score.events[0].notes.length === 0, 'Rest drag changed event type');

console.log('[OK] v1.0.0 score interaction regression passed');
await browser.close();
