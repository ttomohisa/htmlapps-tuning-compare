import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = rel => fs.readFileSync(path.join(root, rel), 'utf8');
const config = JSON.parse(read('app.config.json'));
const spec = read('APP_SPEC.md');
const en = read('README.md');
const ja = read('README.ja.md');
const html = read('src/index.template.html');
const changelog = read('CHANGELOG.md');
const offline = read('VERIFY_OFFLINE.md');

test('release version and changelog agree across documentation', () => {
  assert.equal(config.version, '1.0.2');
  assert.match(spec, new RegExp('\\*\\*Version:\\*\\* ' + config.version.replace(/\./g, '\\.')));
  assert.match(changelog, new RegExp('^## ' + config.version.replace(/\./g, '\\.') + '\\b', 'm'));
  for (const [name, text] of [['English README', en], ['Japanese README', ja]]) {
    assert.ok(text.includes('badge/version-v' + config.version + '-'), name + ' version badge is stale');
  }
});

test('documentation describes overlap-safe editing, not removed-note overwrite', () => {
  assert.doesNotMatch(spec, /### Covered-note overwrite/);
  assert.doesNotMatch(spec, /inserting a long note removes later events covered/);
  assert.match(spec, /overlapping note, chord and rest input is refused/);
  assert.match(spec, /changing 4\/4 to 3\/4/);
  assert.match(en, /Overlap-safe editing/);
  assert.match(ja, /既存の音符・休符と重なる入力/);
});

test('bilingual save/load and WAV documentation reflects the actual controls', () => {
  assert.match(html, /<details class="project-data-panel" id="projectDataPanel">/);
  assert.match(html, /<summary id="projectDataTitle" data-i18n="projectTitle">/);
  assert.match(en, /Save or load a project/);
  assert.match(ja, /プロジェクトを保存・読み込む/);
  assert.match(en, /selected tuning side\(s\)/);
  assert.match(ja, /選択した側の音律/);
  assert.doesNotMatch(en, /WAV exports use a snapshot of both tunings/);
  assert.doesNotMatch(ja, /WAVは開始時点の両方の音律と譜面/);
  assert.match(html, /In Tuning, expand Save or load a project/);
  assert.match(html, /プロジェクトを保存・復元するには、「音律」の/);
});

test('offline instructions, licenses, and screenshot references remain present', () => {
  assert.match(offline, /## Tuning Compare release smoke check/);
  assert.match(offline, /A only/);
  assert.match(offline, /Save or load a project/);
  assert.match(read('LICENSE'), /^MIT License/);
  assert.match(read('THIRD_PARTY_NOTICES.md'), /Noto Music/);
  assert.match(read('THIRD_PARTY_NOTICES.md'), /SIL OPEN FONT LICENSE/);
  for (const asset of ['assets/screenshot.png', 'assets/screenshot-en.png', 'assets/screenshot-mobile.png', 'assets/favicon.svg']) {
    assert.ok(fs.statSync(path.join(root, asset)).size > 0, asset + ' must not be empty');
  }
  assert.match(en, /assets\/screenshot-en\.png/);
  assert.match(ja, /assets\/screenshot\.png/);
});
