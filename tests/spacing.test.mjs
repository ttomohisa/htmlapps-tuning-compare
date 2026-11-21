import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const html = fs.readFileSync(process.env.TEST_HTML || new URL('../src/index.template.html', import.meta.url), 'utf8');
const css = html.match(/<style>([\s\S]*?)<\/style>/)?.[1];
assert.ok(css, 'Application CSS should be embedded in standalone HTML');

const spacingRule = /\b((?:margin|padding)(?:-(?:top|right|bottom|left|inline|block|inline-start|inline-end|block-start|block-end))?|gap|row-gap|column-gap)\s*:\s*([^;{}]+);/g;

test('CSS margin, padding and gap pixel values follow an 8px grid', () => {
  const offGrid = [];
  let checked = 0;
  for (const declaration of css.matchAll(spacingRule)) {
    for (const unit of declaration[2].matchAll(/(-?\d+(?:\.\d+)?)px\b/g)) {
      checked++;
      if (Number(unit[1]) % 8 !== 0) offGrid.push(declaration[1] + ': ' + declaration[2]);
    }
    assert.doesNotMatch(declaration[2], /clamp\([^)]*vw/, 'Spacing should not drift off-grid at intermediate widths');
  }
  assert.ok(checked >= 250, 'A representative set of spacing values should be checked');
  assert.deepEqual(offGrid, [], 'Off-grid CSS spacing is not allowed');
});

test('surfaces stay restrained without raised card shadows', () => {
  assert.match(css, /--shadow-sm:\s*none;/);
  for (const selector of ['.workspace', '.card', '.ab-slot']) {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const rules = [...css.matchAll(new RegExp(escaped + '\\s*\\{([^}]*)\\}', 'g'))];
    assert.ok(rules.length >= 1, selector + ' should have CSS rules');
    for (const [, declarations] of rules) {
      assert.doesNotMatch(declarations, /box-shadow:\s*var\(--shadow-md\)/, selector + ' should not use modal shadows');
    }
  }
  assert.match(css, /--line:\s*#e2e6df;/);
  assert.match(css, /\.app-mobile-bottom-item\s*\{[^}]*\bgap:8px;/);
});


test('nested sections use dividers while interactive areas retain their boundaries', () => {
  function rule(selector) {
    const escaped = selector.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const match = css.match(new RegExp(escaped + '\\s*\\{([^}]*)\\}'));
    assert.ok(match, selector + ' should have a CSS rule');
    return match[1];
  }

  for (const selector of ['.workspace', '.card']) {
    assert.match(rule(selector), /border:\s*1px solid var\(--line\)/, selector + ' should retain its outer boundary');
  }
  assert.match(rule('.ab-slot'), /border:\s*0/, 'A/B slots must not add nested cards');
  assert.match(rule('.ab-slot[data-slot="b"]'), /border-left:\s*1px solid var\(--line\)/);
  for (const selector of [
    '.ab-custom-details',
    '.wav-export-panel',
    '.custom-editor-panel,.project-data-panel',
    '.learning-panel',
    '.score-samples',
    '.sound-card .sound-advanced',
  ]) {
    assert.match(rule(selector), /border:\s*0/, selector + ' should have no enclosing frame');
    assert.match(rule(selector), /border-top:\s*1px solid var\(--line\)/, selector + ' should retain a section divider');
  }
  assert.match(rule('.learning-metric'), /border:\s*0/, 'Metric values should not sit in further cards');
  assert.match(rule('.sound-card .engine-state'), /background:\s*transparent/, 'Status rows should not be another tinted box');
  assert.match(rule('.comparison-table-wrap'), /border:\s*1px solid var\(--line\)/, 'Comparison table should stay bounded');
  assert.match(rule('.score-canvas-shell'), /border:\s*1px solid var\(--line\)/, 'Editable staff should stay bounded');
  assert.match(css, /@media \(max-width: 820px\)[\s\S]*?\.ab-slot\[data-slot="b"\]\s*\{[^}]*border-top:\s*1px solid var\(--line\)/);
});


test('intro keeps the useful explanation without a redundant hero heading', () => {
  assert.doesNotMatch(html, /id=["']heroTitle["']/);
  assert.doesNotMatch(html, /data-i18n=["']introTitle["']/);
  assert.match(html, /<div class="page-intro">\s*<p data-i18n="introLead">/);
  assert.match(css, /\.page-intro p\s*\{\s*margin:\s*0;/);
  assert.doesNotMatch(css, /\.page-intro h2\s*\{/);
  assert.match(html, /<h2 id="compareTitle"/, 'First real section heading is preserved');
});


test('project save and load controls are an accessible disclosure, closed by default', () => {
  assert.match(html, /<details class="project-data-panel" id="projectDataPanel">/);
  assert.doesNotMatch(html, /<details class="project-data-panel" id="projectDataPanel"[^>]*\sopen\b/);
  assert.match(html, /<summary id="projectDataTitle" data-i18n="projectTitle">プロジェクトを保存・読み込む<\/summary>/);
  assert.match(html, /<div class="project-data-body">/);
  assert.match(html, /id="exportProjectButton"/);
  assert.match(html, /id="importProjectButton"/);
  assert.match(html, /id="projectFileInput" type="file"/);
  assert.match(css, /\.project-data-panel > summary:focus-visible\s*\{/);
});

test('button hierarchy distinguishes playback, primary, stop and utility actions', () => {
  assert.match(css, /\.ab-play-button\s*\{[^}]*background:\s*var\(--accent-soft\)/);
  assert.match(css, /\.ab-play-button::before\s*\{[^}]*clip-path:/);
  assert.match(css, /#abStop,\s*#scoreStop,\s*#stopButton\s*\{[^}]*background:\s*transparent/);
  assert.match(css, /\.button\.primary,\s*\.primary\s*\{[^}]*background:\s*var\(--accent\)/);
  assert.match(css, /\.project-data-actions \.project-action-export\s*\{[^}]*background:\s*var\(--accent-soft\)/);
  assert.match(css, /:focus-visible\s*\{\s*outline:\s*2px solid var\(--focus\)/);
});
