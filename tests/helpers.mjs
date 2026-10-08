import fs from 'node:fs';
import { JSDOM, VirtualConsole } from 'jsdom';
export function loadApp() {
  const config = JSON.parse(fs.readFileSync(new URL('../app.config.json', import.meta.url)));
  let html = fs.readFileSync(process.env.TEST_HTML || new URL('../src/index.template.html', import.meta.url), 'utf8')
    .replace('__APP_CONFIG_JSON__', JSON.stringify(config)).replace('__BUILD_MANIFEST_JSON__', '{}').replace('__EMBEDDED_ASSET_BUNDLE_JSON__', '{}');
  html = html.replace('window.__TUNING_COMPARE_BUILD__ =', 'window.testApi = { scoreState, currentSettings, validateProjectDocument, importProjectFile, exportScoreWav, exportProjectJson, scoreSequenceForSide, encodePcm16Wav, ...(typeof wavExportBudget==="function"?{wavExportBudget}:{}), buildExportSamples, sanitizeJsonFilename, sanitizeWavFilename, tuningEngine, applyLanguage, renderScore }; window.__TUNING_COMPARE_BUILD__ =');
  const errors = [], downloads = [];
  const vc = new VirtualConsole(); vc.on('jsdomError', e => errors.push(e));
  const dom = new JSDOM(html, { url: 'https://tuning.test/', runScripts: 'dangerously', pretendToBeVisual: true, virtualConsole: vc, beforeParse(w) {
    w.matchMedia = () => ({ matches: false, addEventListener() {} });
    w.scrollTo = () => {};
    w.HTMLElement.prototype.scrollIntoView = () => {};
    w.HTMLDialogElement.prototype.showModal = function() { this.open = true; };
    w.HTMLDialogElement.prototype.close = function() { this.open = false; };
    w.Blob = Blob; w.File = File;
    w.URL.createObjectURL = blob => { w.lastBlob = blob; return 'blob:test'; };
    w.URL.revokeObjectURL = () => {};
    w.HTMLAnchorElement.prototype.click = function() { downloads.push({ filename: this.download, blob: w.lastBlob }); };
  }});
  if (!dom.window.testApi) throw errors[0] || new Error('App did not initialize');
  return { window: dom.window, api: dom.window.testApi, document: dom.window.document, errors, downloads, close: () => dom.window.close() };
}
export function project(app) { return { kind: 'browser-kitty.tuning-compare-project', schemaVersion: 1, project: JSON.parse(JSON.stringify(app.api.currentSettings())) }; }
export async function tick() { await new Promise(resolve => setTimeout(resolve, 25)); }
