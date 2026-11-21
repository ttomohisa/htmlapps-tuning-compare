import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const workflow = fs.readFileSync(new URL('../.github/workflows/release.yml', import.meta.url), 'utf8');
const config = JSON.parse(fs.readFileSync(new URL('../app.config.json', import.meta.url), 'utf8'));
const changelog = fs.readFileSync(new URL('../CHANGELOG.md', import.meta.url), 'utf8');

test('release is limited to main, requires write permission, and is serialized', () => {
  assert.match(workflow, /on:\s*\n\s*push:\s*\n\s*branches:\s*\n\s*- main\b/);
  assert.match(workflow, /workflow_dispatch:/);
  assert.match(workflow, /if: github\.ref == 'refs\/heads\/main'/);
  assert.match(workflow, /permissions:\s*\n\s*contents: write/);
  assert.match(workflow, /cancel-in-progress: false/);
});

test('release uses current SemVer, changelog notes, existing-tag checks, and skip-on-existing-release', () => {
  assert.match(config.version, /^\d+\.\d+\.\d+$/);
  assert.ok(changelog.includes('## ' + config.version + ' '));
  assert.match(workflow, /Get-Content -Raw -Encoding UTF8 'app\.config\.json'/);
  assert.match(workflow, /Invoke-WebRequest.*-Uri \\$releaseUri.*-Headers/s);
  assert.match(workflow, /-SkipHttpErrorCheck -ErrorAction Stop/);
  assert.match(workflow, /\\$releaseResponse\\.StatusCode -eq 200/);
  assert.match(workflow, /\\$releaseResponse\\.StatusCode -eq 404/);
  assert.match(workflow, /Unexpected HTTP status/);
  assert.match(workflow, /"publish=true" >> \\$env:GITHUB_OUTPUT/);
  assert.doesNotMatch(workflow, /gh release view \\$tag/);
  assert.match(workflow, /"publish=false" >> \$env:GITHUB_OUTPUT/);
  assert.match(workflow, /git ls-remote --refs --tags origin/);
  assert.match(workflow, /\$tagCommit -ne \$env:GITHUB_SHA/);
  assert.match(workflow, /git tag -a \$tag/);
  assert.match(workflow, /git push origin "refs\/tags\/\$tag"/);
  assert.match(workflow, /gh release create \$tag/);
  assert.match(workflow, /--verify-tag/);
});

test('release validates generated files before tagging and attaches both standalone formats', () => {
  const build = workflow.indexOf('Build and verify standalone HTML');
  const regressions = workflow.indexOf('Run regressions on source and generated standalone HTML');
  const publish = workflow.indexOf('Tag validated commit and create GitHub Release');
  assert.ok(build !== -1 && build < regressions && regressions < publish);
  assert.match(workflow, /npm test --prefix tests/g);
  assert.match(workflow, /dist\/index\.html/);
  assert.match(workflow, /dist\/index\.self-extract\.html/);
  assert.match(workflow, /--notes-file \$notesPath/);
});
