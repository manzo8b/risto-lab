import {test,expect} from '@playwright/test';
import {readFile} from 'node:fs/promises';
const root=process.env.LIVE_URL||'http://127.0.0.1:4330/risto-lab';
test('all dashboard cards show three actions and real import/export formats',async({page})=>{
 await page.goto(root+'/instructor/professional-suite/');
 const cards=page.locator('.suite-card');await expect(cards).toHaveCount(7);
 for(const c of await cards.all()){await expect(c.locator('.suite-action-guide li')).toHaveCount(3);await expect(c.locator('.suite-formats')).toContainText('Importazione');await expect(c.locator('.suite-formats')).toContainText('XLSX');await expect(c.locator('.suite-formats')).toContainText('DOCX')}
});
test('six report selectors load, and Menu Design retains its gate',async({page})=>{
 for(const path of ['recipe-manager','supplier-manager','food-cost-calculator','menu-engineering-dashboard','menu-design-studio','restaurant-simulator']){
  await page.goto(root+'/instructor/'+path+'/');await expect(page.locator('.rl-report-export')).toBeVisible();
  if(path==='menu-design-studio'){await page.locator('#demo').click();await expect(page.locator('.rl-report-download')).toBeDisabled()}
 }
});
test('simulator exports native Office and Markdown from current results',async({page})=>{
 await page.goto(root+'/instructor/restaurant-simulator/');
 for(const ext of ['md','xlsx','docx']){
  await page.locator('#rl-report-format').selectOption(ext);
  const p=page.waitForEvent('download');await page.locator('.rl-report-download').click();const d=await p;expect(d.suggestedFilename()).toBe('risto-lab-restaurant-scenario.'+ext);
  const path=await d.path();if(!path)throw Error('Missing file');const b=await readFile(path);if(ext==='md'){expect(b.toString()).toContain('SIMULAZIONE');expect(b.toString()).toContain('operatingResult')}else expect(b.subarray(0,4).toString('hex')).toBe('504b0304');
 }
 await page.locator('#scenario-occupancy').fill('');await expect(page.locator('.rl-report-download')).toBeDisabled();
});
