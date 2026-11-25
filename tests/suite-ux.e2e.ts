import {test,expect} from '@playwright/test';
const root=process.env.LIVE_URL||'http://127.0.0.1:4330/risto-lab';
const suite='/instructor/professional-suite/';
const routes=['/instructor/recipe-manager/','/instructor/supplier-manager/','/instructor/menu-engineering/matrice-allergeni/','/instructor/food-cost-calculator/','/instructor/menu-engineering-dashboard/','/instructor/menu-design-studio/','/instructor/restaurant-simulator/'];
test('home, suite, and seven app routes are connected with review guidance',async({page})=>{
 await page.goto(root+'/');await page.locator('#strumenti a.button').click();await expect(page).toHaveURL(root+suite);
 await expect(page.locator('.suite-grid:not(.suite-planned) .suite-card')).toHaveCount(7);
 await expect(page.locator('.suite-planned .suite-card')).toHaveCount(0);
 for(const route of routes){
  await page.goto(root+suite);
  await page.locator('.suite-card a[href$="'+route+'"]').click();await expect(page).toHaveURL(root+route);
  const nav=page.locator('.rl-suite-nav');await expect(nav.locator('.rl-suite-apps a')).toHaveCount(7);
  await expect(nav.locator('[aria-current=page]')).toHaveAttribute('href',new RegExp(route.replace('/instructor/','')+'$'));
  await page.locator('.rl-suite-guide summary').click();await expect(page.locator('.rl-suite-guide ol li')).toHaveCount(3);
  await expect(page.locator('.rl-suite-guide ol')).toBeVisible();
  await nav.locator('.rl-suite-home').click();await expect(page).toHaveURL(root+suite);
 }
});
test('navigation at 360, 390, 768 and 1440 pixels; language and reduced motion',async({page})=>{
 for(const width of [360,390,768,1440]){
  await page.setViewportSize({width,height:900});
  for(const route of [suite,...routes]){await page.goto(root+route);const geometry=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,overflow:Array.from(document.querySelectorAll('body *')).filter(e=>e.getBoundingClientRect().right>innerWidth+1).slice(0,8).map(e=>({tag:e.tagName,id:e.id,cls:String(e.className).slice(0,80)}))}));expect(geometry.scrollWidth<=geometry.width,route+' '+width+' '+JSON.stringify(geometry)).toBe(true)}
 }
 await page.goto(root+routes[0]);await page.locator('[data-lang="es"]').click();await expect(page.locator('.rl-suite-guide summary')).toContainText('Verificación asistida');
 await page.locator('[data-lang="en"]').click();await expect(page.locator('.rl-suite-guide summary')).toContainText('Assisted review');
 await page.emulateMedia({reducedMotion:'reduce'});expect(await page.locator('.rl-suite-apps a').first().evaluate(e=>getComputedStyle(e).transitionDuration)).toBe('0s');
});
test('native links and guidance remain usable without JavaScript',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});const page=await context.newPage();
 await page.goto(root+routes[0]);await page.locator('.rl-suite-guide summary').click();await expect(page.locator('.rl-suite-guide ol')).toBeVisible();await page.locator('.rl-suite-apps a').nth(1).click();await expect(page).toHaveURL(root+routes[1]);await context.close();
});
