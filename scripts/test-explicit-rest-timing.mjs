import { chromium } from 'playwright';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import fs from 'node:fs/promises';

const appUrl=pathToFileURL(path.resolve('dist/index.html')).href;
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},locale:'ja-JP',acceptDownloads:true,reducedMotion:'reduce'});
const page=await context.newPage();

function assert(condition,message){ if(!condition) throw new Error(message); }
async function reset(){
  await page.goto(appUrl,{waitUntil:'load'});
  await page.evaluate(()=>localStorage.clear());
  await page.reload({waitUntil:'load'});
  await page.locator('[data-mobile-key="score"]').click();
  await page.waitForTimeout(100);
  await page.evaluate(()=>{
    const tempo=document.querySelector('#scoreTempo');
    tempo.value='300';
    tempo.dispatchEvent(new Event('change',{bubbles:true}));
  });
  await page.locator('#scoreMobileQuickDuration').selectOption('1');
  await page.locator('#scoreMobileModeNote').click();
}
async function clickSvg(x,y){
  const svg=page.locator('#scoreSvg');
  await svg.scrollIntoViewIfNeeded();
  const p=await svg.evaluate((el,point)=>{
    const r=el.getBoundingClientRect(),vb=el.viewBox.baseVal;
    return {x:r.left+((point.x-vb.x)/vb.width)*r.width,y:r.top+((point.y-vb.y)/vb.height)*r.height};
  },{x,y});
  await page.mouse.click(p.x,p.y);
  await page.waitForTimeout(80);
}
async function exportBytes(label){
  await page.locator('#wavTarget').selectOption('a');
  await page.locator('#wavSampleRate').selectOption('48000');
  await page.locator('#wavFilename').fill(label);
  const [download]=await Promise.all([
    page.waitForEvent('download'),
    page.locator('#exportWavButton').click()
  ]);
  const p=await download.path();
  assert(p,'Download path is missing');
  const stat=await fs.stat(p);
  return stat.size;
}

// Sparse visual positions without an explicit rest:
// quarter C at visual beat 0, quarter E at visual beat 3.
// Expected musical time = 2 quarter notes only (0.4 sec at 300 BPM), not 4 beats.
await reset();
await clickSvg(74,118);   // C4 at beat 0
await clickSvg(356,106);  // E4 at beat 3, leaving a large visual gap
let noRestBytes=await exportBytes('no-explicit-rest');
console.log('[timing] no-rest bytes',noRestBytes);

// Same visual spacing, but add an explicit quarter rest in between.
// Expected musical time = note + rest + note = 3 quarter beats.
await reset();
await clickSvg(74,118);   // C4
await page.locator('#scoreMobileModeRest').click();
await clickSvg(260,106);  // explicit quarter rest around beat 2
await page.locator('#scoreMobileModeNote').click();
await clickSvg(356,106);  // E4
let withRestBytes=await exportBytes('with-explicit-rest');
console.log('[timing] with-rest bytes',withRestBytes);

assert(noRestBytes < 70000,'Visual gap still creates a long implicit silence in WAV output');
assert(withRestBytes > noRestBytes + 15000,'Explicit rest did not add its own silent duration');

// Live playback should also use compact symbol timing.
await reset();
await clickSvg(74,118);
await clickSvg(356,106);
await page.locator('#scorePlayA').click();
assert(await page.locator('#scorePlayA').getAttribute('aria-pressed')==='true','Score playback did not start');
await page.waitForTimeout(900);
assert(await page.locator('#scorePlayA').getAttribute('aria-pressed')==='false','Live playback still waits through unused visual space');

console.log('[OK] explicit-rest timing regression passed');
await browser.close();
