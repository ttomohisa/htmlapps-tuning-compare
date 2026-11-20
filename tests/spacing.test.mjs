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
