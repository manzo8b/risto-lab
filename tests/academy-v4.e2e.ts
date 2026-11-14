import {test,expect} from '@playwright/test';
const root=process.env.LIVE_URL||'http://127.0.0.1:4330/risto-lab';
test('Instructor uses the approved brand, five live tools and grounded KPIs',async({page})=>{
 await page.goto(root+'/instructor/');
 const logo=page.locator('.academy-sidebar-brand img');
 await expect(logo).toBeVisible();
 expect(await logo.evaluate((x:HTMLImageElement)=>x.complete&&x.naturalWidth>0)).toBeTruthy();
 await expect(page.locator('.academy-launch')).toHaveCount(5);
 await expect(page.locator('.academy-stat-grid strong')).toHaveText(['26','178','5']);
 await expect(page.locator('.academy-featured')).toContainText('PARTIAL');
 await expect(page.locator('.academy-tools a')).toHaveCount(4);
 const colors=await page.locator('.academy-launch-head').evaluateAll(nodes=>nodes.map(e=>getComputedStyle(e).backgroundImage));
 expect(new Set(colors).size).toBe(5);
});
test('the menu-engineering lesson no longer uses cream-colored surfaces',async({page})=>{
 await page.goto(root+'/instructor/menu-engineering/');
 const intro=page.locator('.me-intro');
 await expect(intro).toBeVisible();
 expect(await intro.evaluate(el=>getComputedStyle(el).backgroundColor)).toBe('rgb(255, 255, 255)');
 const example=page.locator('.me-ill-menu');
 await expect(example).toBeVisible();
 expect(await example.evaluate(el=>getComputedStyle(el).backgroundColor)).toBe('rgb(9, 31, 88)');
});
test('mobile has usable full-width layout on public, teaching and specialist pages',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 for(const path of ['/','/risorse/','/formazione/','/instructor/','/instructor/biblioteca/','/instructor/unita/06-la-mise-en-place/','/instructor/menu-engineering/','/instructor/sessioni/nuova/']){
  await page.goto(root+path);
  await expect(page.locator('h1')).toBeVisible();
  const geo=await page.evaluate(()=>({width:document.documentElement.scrollWidth,viewport:window.innerWidth,bodyWidth:Math.round(document.body.getBoundingClientRect().width),offenders:Array.from(document.querySelectorAll('*')).filter(el=>{const b=el.getBoundingClientRect();return b.width>0&&(b.right>window.innerWidth+2||b.left<-2)}).slice(0,16).map(el=>({tag:el.tagName,cls:typeof el.className==='string'?el.className.slice(0,65):'',right:Math.round(el.getBoundingClientRect().right),width:Math.round(el.getBoundingClientRect().width)}))}));
  expect(geo.width<=geo.viewport,JSON.stringify({path,geo})).toBeTruthy();
  expect(geo.bodyWidth>=geo.viewport-2,JSON.stringify({path,geo})).toBeTruthy();
 }
});
