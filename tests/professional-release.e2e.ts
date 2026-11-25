import {test,expect} from '@playwright/test';
const root=process.env.LIVE_URL||'http://127.0.0.1:4330/risto-lab';
test('Menu Design Studio has distinct layouts and blocks unvalidated exports',async({page})=>{
 await page.goto(root+'/instructor/menu-design-studio/');
 await page.locator('#demo').click();
 await expect(page.locator('.paper')).toBeVisible();
 await expect(page.locator('#print')).toBeDisabled();
 await expect(page.locator('#export')).toBeDisabled();
 const layouts=[];
 for(const style of ['modern','classic','bistro']){
  await page.locator('#style').selectOption(style);
  await expect(page.locator('.paper')).toHaveAttribute('data-style',style);
  layouts.push(await page.locator('.paper').evaluate(e=>getComputedStyle(e).fontFamily));
 }
 expect(new Set(layouts).size).toBe(3);
 await expect(page.locator('.menu-dishes')).toHaveCSS('display','grid');
 await page.locator('#extra1').selectOption('en');
 await expect(page.locator('.paper [lang=en]').first()).toBeVisible();
 await expect(page.locator('#export')).toBeDisabled();
});
test('Restaurant Simulator recomputes, exports and invalidates missing inputs',async({page})=>{
 await page.goto(root+'/instructor/restaurant-simulator/');
 await expect(page.locator('#metrics')).toContainText('6.375');
 await page.locator('#copy').click();
 await expect(page.locator('#metrics')).toContainText('8.500');
 await page.locator('#scenario-occupancy').fill('0');
 await expect(page.locator('#metrics')).toContainText('20.000');
 await page.locator('#scenario-occupancy').fill('');
 await expect(page.locator('#save')).toBeDisabled();
 await page.locator('#reset').click();
 await expect(page.locator('#save')).toBeEnabled();
 const d=page.waitForEvent('download');await page.locator('#save').click();expect((await d).suggestedFilename()).toBe('restaurant-scenario.json');
});
