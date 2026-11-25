import {test,expect} from '@playwright/test';
test('Food Cost: demo, languages, market, persistence and responsive layout',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:4330/risto-lab/instructor/food-cost-calculator/');
 await page.locator('#demo').click();
 await expect(page.locator('#metrics')).toContainText('2,68');
 await expect(page.locator('#issues')).toContainText('Simulato');
 await page.locator('#price').fill('15');await page.locator('#calculate').click();
 await expect(page.locator('#issues')).toContainText('Simulato');
 for(const [lang,heading] of [['es','Inteligencia de mercado'],['en','Market intelligence'],['it','Intelligence di mercato']]){
 await page.locator('#lang').selectOption(lang);await expect(page.locator('html')).toHaveAttribute('lang',lang);await expect(page.locator('#market h2')).toHaveText(heading);
 }
 await page.locator('#simulate').click();await expect(page.locator('#marketResults .metric')).toHaveCount(4);
 await page.locator('#save').click();await expect(page.locator('#history')).toContainText('DEMO-ROMA');
 await page.reload();await expect(page.locator('#history')).toContainText('DEMO-ROMA');
 await page.locator('#history button').first().click();await expect(page.locator('#metrics')).toContainText('2,68');
 const download=page.waitForEvent('download');await page.locator('#csv').click();expect((await download).suggestedFilename()).toBe('food-cost.csv');
 for(const width of [390,768,1440]){await page.setViewportSize({width,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy()}
 expect(errors).toEqual([]);
});
