import { chromium } from 'playwright';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const appUrl=pathToFileURL(path.resolve('dist/index.html')).href;
const storageKey='tuning-compare:settings';
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},locale:'ja-JP',reducedMotion:'reduce'});
const page=await context.newPage();

function assert(condition,message){ if(!condition) throw new Error(message); }
async function waitSaved(){ await page.waitForTimeout(240); }
async function reset(){
  await page.goto(appUrl,{waitUntil:'load'});
  await page.evaluate(()=>localStorage.clear());
  await page.reload({waitUntil:'load'});
  await page.locator('[data-mobile-key="score"]').click();
  await page.waitForTimeout(100);
}
async function score(){
  await waitSaved();
  return page.evaluate(key=>{
    const raw=localStorage.getItem(key);
    return raw?JSON.parse(raw).score:null;
  },storageKey);
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

// Mobile duplicates: fixed bar is the only place for mode/duration/accidental.
await reset();
assert(!(await page.locator('.score-tool-input').isVisible()),'Upper Note/Rest control is still visible on mobile');
assert(!(await page.locator('.score-tool-duration').isVisible()),'Upper duration control is still visible on mobile');
assert(!(await page.locator('.score-tool-accidental').isVisible()),'Upper accidental control is still visible on mobile');
assert(await page.locator('#scoreTempo').isVisible(),'Tempo should remain visible in the upper toolbar');
assert(await page.locator('.score-mobile-quick-tools').isVisible(),'Fixed mobile quick bar is missing');

// Rest mode changes the duration labels to rest symbols/terms.
await page.locator('#scoreMobileModeRest').click();
await page.locator('#scoreMobileQuickDuration').selectOption('0.5');
let selectedText=await page.locator('#scoreMobileQuickDuration option:checked').textContent();
assert(selectedText.trim()==='8分休符','Rest mode still displays an eighth-note label: '+selectedText);
await page.locator('#scoreMobileModeNote').click();
selectedText=await page.locator('#scoreMobileQuickDuration option:checked').textContent();
assert(selectedText.trim()==='8分音符','Note mode did not restore note duration label: '+selectedText);

// Tapping a different blank staff position dismisses selection first and does not add on that tap.
await page.locator('#scoreMobileQuickDuration').selectOption('1');
await clickSvg(90,106);
let state=await score();
assert(state.events.length===1,'Initial note setup failed');
assert(await page.locator('#scoreMobileEditor').isVisible(),'Newly added note is not selected');
await clickSvg(190,100);
state=await score();
assert(state.events.length===1,'Selection-dismiss tap unexpectedly added another event');
assert(!(await page.locator('#scoreMobileEditor').isVisible()),'Selection did not clear after tapping a different blank position');
await clickSvg(190,100);
state=await score();
assert(state.events.length===2,'Second tap after deselection did not add the next note');

// Symbol-driven playback: visual gap must not become silence.
await reset();
await page.locator('#scoreTempo').fill('300');
await page.locator('#scoreTempo').dispatchEvent('change');
await page.locator('#scoreMobileQuickDuration').selectOption('1');
await clickSvg(82,112);        // first quarter note
await clickSvg(350,100);       // dismiss current selection
await clickSvg(350,100);       // second quarter note visually far away
state=await score();
assert(state.events.length===2,'Sparse two-note score setup failed');
const starts=state.events.map(e=>e.start).sort((a,b)=>a-b);
assert(starts[1]-starts[0]>=2,'Test notes are not visually separated enough');
await page.locator('#scorePlayA').click();
assert(await page.locator('#scorePlayA').getAttribute('aria-pressed')==='true','Playback did not start');
await page.waitForTimeout(900);
assert(await page.locator('#scorePlayA').getAttribute('aria-pressed')==='false','Playback still treats visual spacing as implicit silence');

console.log('[OK] mobile score symbol semantics regression passed');
await browser.close();
