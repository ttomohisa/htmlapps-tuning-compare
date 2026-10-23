import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const css=fs.readFileSync(process.env.TEST_HTML || new URL('../src/index.template.html',import.meta.url),'utf8').match(/<style>([\s\S]*?)<\/style>/)[1];

// This catches a phone footer accidentally remaining visible; native geometry is
// verified separately in Chromium at both sides of the existing breakpoint.
test('informational footer is hidden at 600px without hiding functional navigation', () => {
  const source = css;
  const media = [...source.matchAll(/@media\s*\(max-width:\s*600px\)\s*\{/g)].map(match => {
    let depth = 1, end = match.index + match[0].length;
    for (; depth && end < source.length; end++) {
      if (source[end] === '{') depth++;
      if (source[end] === '}') depth--;
    }
    return source.slice(match.index + match[0].length, end - 1);
  }).join('\n');
  assert.match(media, /(?:^|\})\s*footer\s*\{[^}]*display\s*:\s*none\b/);
  assert.match(media, /\.app-mobile-bottom-bar\s*\{[^}]*display\s*:\s*grid\b/);
});
