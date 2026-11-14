import {test,expect} from '@playwright/test';
const root=process.env.LIVE_URL||'http://127.0.0.1:4330/risto-lab';

test('homepage main visual is compact and white-first without losing the blue identity',async({page})=>{
 await page.setViewportSize({width:1440,height:900});
 await page.goto(root+'/');
 const hero=page.locator('.rl-home .rl-visual');
 await expect(hero).toBeVisible();
 const metrics=await hero.evaluate(el=>({height:Math.round(el.getBoundingClientRect().height),background:getComputedStyle(el).backgroundImage,borderTop:getComputedStyle(el).borderTopWidth}));
 expect(metrics.height).toBeLessThanOrEqual(365);
 expect(metrics.background).toContain('linear-gradient');
 expect(metrics.background).toContain('rgb(255, 255, 255)');
 expect(parseFloat(metrics.borderTop)).toBeGreaterThanOrEqual(4);
 await expect(page.locator('.rl-home #in-evidenza .rl-course-card')).toHaveCount(3);
 const card=page.locator('.rl-home .rl-course-card').first();
 expect(await card.evaluate(el=>getComputedStyle(el).boxShadow)).not.toBe('none');
 const imageHeight=await card.locator('.rl-card-image').evaluate(el=>el.getBoundingClientRect().height);
 expect(imageHeight).toBeLessThanOrEqual(190);
});
test('separate homepage bands are lighter than saturated blue slabs while remaining identifiable',async({page})=>{
 await page.setViewportSize({width:1440,height:900});
 await page.goto(root+'/');
 for(const id of ['in-evidenza','metodo','formati','docenti']){
  const band=page.locator('#'+id);
  await expect(band).toBeVisible();
  const data=await band.evaluate(el=>({image:getComputedStyle(el).backgroundImage,rail:getComputedStyle(el).borderTopWidth}));
  expect(data.image,id).toContain('linear-gradient');
  expect(data.image,id).toContain('rgb(255, 255, 255)');
  expect(parseFloat(data.rail),id).toBeGreaterThanOrEqual(4);
 }
 const heading=page.locator('#metodo h2');
 await expect(heading).toBeVisible();
 const color=await heading.evaluate(el=>getComputedStyle(el).color);
 expect(color).not.toBe('rgb(255, 255, 255)');
});
test('homepage and resources cards fit phone width and leave the official brand unchanged',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 for(const path of ['/','/risorse/','/formazione/']){
  await page.goto(root+path);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),path).toBeTruthy();
  await expect(page.locator('header .risto-brand-symbol')).toBeVisible();
 }
 await page.goto(root+'/');
 const hero=page.locator('.rl-home .rl-visual');
 expect(await hero.evaluate(el=>el.getBoundingClientRect().height)).toBeLessThanOrEqual(260);
 await expect(page.getByRole('link',{name:'Scopri le risorse libere'})).toBeVisible();
});
