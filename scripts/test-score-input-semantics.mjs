import { chromium } from 'playwright';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const appUrl=pathToFileURL(path.resolve('dist/index.html')).href;
const storageKey='tuning-compare:settings';
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},locale:'ja-JP',reducedMotion:'reduce'});
const page=await context.newPage();

function assert(condition,message){ if(!condition) throw new Error(message); }
async function waitSaved(){ await page.waitForTimeout(260); }
async function reset(){
  await page.goto(appUrl,{waitUntil:'load'});
  await page.evaluate(()=>localStorage.clear());
  await page.reload({waitUntil:'load'});
  await page.locator('[data-mobile-key="score"]').click();
  await page.waitForTimeout(120);
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
}

// 1) Input duration must not edit the already-selected note.
await reset();
const quickDebug=await page.evaluate(()=>({
  bodyClass:document.body.className,
  scoreClass:document.querySelector('#mobileScorePage')?.className,
  quickDisplay:getComputedStyle(document.querySelector('.score-mobile-quick-tools')).display,
  quickRect:document.querySelector('.score-mobile-quick-tools')?.getBoundingClientRect().toJSON?.()||null,
  viewport:[innerWidth,innerHeight]
}));
console.log('[debug quick]',JSON.stringify(quickDebug));
assert(await page.locator('#scoreMobileQuickDuration').isVisible(),'Mobile quick duration is not visible: '+JSON.stringify(quickDebug));
await page.locator('#scoreMobileQuickDuration').selectOption('1');
await clickSvg(90,106); // E4, beat 0
let state=await score();
assert(state.events.length===1 && state.events[0].duration===1,'Quarter-note setup failed');
assert(await page.locator('#scoreMobileEditor').isVisible(),'Selected-event editor is missing');

// Change NEXT input to eighth while the prior note remains selected.
await page.locator('#scoreMobileQuickDuration').selectOption('0.5');
state=await score();
assert(state.events[0].duration===1,'Changing next input duration modified the selected prior note');

// Add next note at beat 1 and verify only the new note uses eighth duration.
await clickSvg(185,100);
state=await score();
assert(state.events.length===2,'Second note was not added');
const durations=state.events.slice().sort((a,b)=>a.start-b.start).map(e=>e.duration);
assert(durations[0]===1 && durations[1]===0.5,'Input duration was not applied only to the next note');

// 2) Mobile accidental controls are visible and synchronized.
const accGroup=page.locator('#scoreMobileAccidentalGroup');
assert(await accGroup.isVisible(),'Mobile accidental controls are not visible');
await accGroup.locator('[data-accidental="flat"]').click();
assert(await page.locator('#scoreAccidentalGroup [data-accidental="flat"]').getAttribute('aria-pressed')==='true','Mobile flat did not sync the accidental tool');

// 3) One-tap chord helper adds a third below.
await reset();
await clickSvg(90,106); // E4
assert(await page.locator('#scoreMobileChordTools').isVisible(),'Chord helper buttons are not visible for a selected note');
await page.locator('#scoreMobileThirdBelow').click();
state=await score();
assert(state.events.length===1,'Third-below helper should keep one chord event');
const chordDisplays=state.events[0].notes.map(n=>n.display).sort();
assert(chordDisplays.includes('C4') && chordDisplays.includes('E4') && chordDisplays.length===2,'Third-below helper did not create C4 + E4');

// 4/5) Same-position accidental input replaces the note instead of retaining the original.
await reset();
await page.locator('#scoreMobileQuickDuration').selectOption('1');
await page.locator('#scoreMobileAccidentalGroup [data-accidental="natural"]').click();
await clickSvg(90,112); // D4 natural at beat 0
state=await score();
assert(state.events.length===1 && state.events[0].notes.length===1 && state.events[0].notes[0].display==='D4','D4 setup failed');

await page.locator('#scoreMobileAccidentalGroup [data-accidental="flat"]').click();
await clickSvg(90,112); // same staff position, same beat
state=await score();
assert(state.events.length===1,'Flat replacement created a second event');
assert(state.events[0].notes.length===1,'Flat replacement left the original natural note in the chord');
assert(state.events[0].notes[0].display==='D♭4','Same-position flat input did not replace D4 with D♭4');

// Accidental glyph itself must have priority over blank staff position.
const accidentalHit=page.locator('.score-accidental-hitbox');
assert(await accidentalHit.count()===1,'Accidental hit target is missing');
const before=JSON.stringify(state.events);
await accidentalHit.click();
state=await score();
assert(state.events.length===1 && state.events[0].notes.length===1,'Tapping the accidental glyph created another note/event');
assert(state.events[0].start===0,'Tapping the accidental glyph moved input to another position');
assert(JSON.stringify(state.events)===before,'Tapping an already-selected flat glyph unexpectedly altered the score');

console.log('[OK] duration / mobile accidental / chord helper / accidental-priority regression passed');
await browser.close();
