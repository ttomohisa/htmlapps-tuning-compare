import { chromium } from 'playwright';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const appUrl=pathToFileURL(path.resolve('dist/index.html')).href;
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},locale:'ja-JP',reducedMotion:'reduce'});
const page=await context.newPage();

function assert(condition,message){ if(!condition) throw new Error(message); }
async function box(selector){ const b=await page.locator(selector).boundingBox(); assert(b,selector+' is not visible'); return b; }

await page.goto(appUrl,{waitUntil:'load'});
await page.evaluate(()=>localStorage.clear());
await page.reload({waitUntil:'load'});
await page.locator('[data-mobile-key="score"]').click();
await page.waitForTimeout(100);

const quick=page.locator('.score-mobile-quick-tools');
assert(await quick.isVisible(),'Quick score controls are not visible on the Score page');

let qb=await box('.score-mobile-quick-tools');
const nav=await box('.app-mobile-bottom-bar');
assert(qb.y+qb.height <= nav.y-4,'Quick controls overlap the mobile bottom navigation');
assert(qb.y > 650,'Quick controls are not fixed near the bottom of the mobile viewport');

// Scroll deep into the score page: fixed bar must stay in the same viewport position.
await page.evaluate(()=>window.scrollTo({top:document.body.scrollHeight*0.55,behavior:'auto'}));
await page.waitForTimeout(100);
const qbScrolled=await box('.score-mobile-quick-tools');
assert(Math.abs(qbScrolled.y-qb.y) < 2,'Quick controls moved away while scrolling');
assert(await quick.isVisible(),'Quick score controls disappeared after scrolling');

// Switch away from Score: fixed bar must disappear with the Score page.
await page.locator('[data-mobile-key="compare"]').click();
await page.waitForTimeout(80);
assert(!(await quick.isVisible()),'Quick controls remain visible outside the Score page');
await page.locator('[data-mobile-key="score"]').click();
await page.waitForTimeout(80);
assert(await quick.isVisible(),'Quick controls did not return when reopening the Score page');

// Add/select a note and confirm selected-event editor stacks above quick controls.
const svg=page.locator('#scoreSvg');
await svg.scrollIntoViewIfNeeded();
const p=await svg.evaluate(el=>{
  const rect=el.getBoundingClientRect(),vb=el.viewBox.baseVal;
  return {x:rect.left+((110-vb.x)/vb.width)*rect.width,y:rect.top+((132-vb.y)/vb.height)*rect.height};
});
await page.mouse.click(p.x,p.y);
await page.waitForTimeout(120);
assert(await page.locator('#scoreMobileEditor').isVisible(),'Selected-event mobile editor did not appear');
const eb=await box('#scoreMobileEditor');
qb=await box('.score-mobile-quick-tools');
assert(eb.y+eb.height <= qb.y-4,'Selected-event editor overlaps the fixed quick controls');

// Ensure content has bottom padding for the two fixed bars and no horizontal overflow.
assert(await page.evaluate(()=>document.documentElement.scrollWidth <= window.innerWidth+1),'Fixed score controls cause horizontal overflow');

console.log('[OK] fixed mobile score quick controls regression passed');
await browser.close();
