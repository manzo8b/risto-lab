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

async function reportFiles(page:import('@playwright/test').Page,basename:string,needle:string,notice:string,additional:string[]=[]){
 for(const ext of ['md','xlsx','docx']){
  await page.locator('#rl-report-format').selectOption(ext);
  const pending=page.waitForEvent('download');await page.locator('.rl-report-download').click();const d=await pending;expect(d.suggestedFilename()).toBe(basename+'.'+ext);
  const file=await d.path();if(!file)throw Error('Missing file');const bytes=await readFile(file);const raw=bytes.toString('utf8');
  expect(raw).toContain(needle);expect(raw).toContain(notice);for(const value of additional)expect(raw).toContain(value);
  if(ext!=='md'){expect(bytes.subarray(0,4).toString('hex')).toBe('504b0304');expect(raw).toContain('[Content_Types].xml');expect(raw).toContain(ext==='xlsx'?'xl/workbook.xml':'word/document.xml')}
 }
}
test('recipe and supplier produce reports from actual workspace data',async({page})=>{
 await page.goto(root+'/instructor/recipe-manager/');await page.locator('#sample').click();await reportFiles(page,'risto-lab-recipe-report','Pasta al pomodoro','Bozza interna');
 await page.goto(root+'/instructor/supplier-manager/');await page.locator('#new').click();await reportFiles(page,'risto-lab-supplier-report','products','Uso interno');
});
test('food cost and menu engineering export current calculated results',async({page})=>{
 await page.goto(root+'/instructor/food-cost-calculator/');await page.locator('#demo').click();await reportFiles(page,'risto-lab-food-cost-report','DEMO-ROMA','Nessuna certificazione contabile');await page.locator('#price').fill('15');await expect(page.locator('.rl-report-download')).toBeDisabled();
 await page.goto(root+'/instructor/menu-engineering-dashboard/');await page.locator('#demo').click();await page.locator('#calculate').click();await reportFiles(page,'risto-lab-menu-analysis','Star','simulation=true',['Plowhorse','Puzzle','Dog','Carbonara','classification','star']);await page.locator('#rows [data-field=sold]').first().fill('');await expect(page.locator('.rl-report-download')).toBeDisabled();
});
test('allergen Markdown preserves acknowledgement, possible codes and warnings',async({page})=>{
 await page.goto(root+'/instructor/menu-engineering/matrice-allergeni/');await page.locator('[data-l=it]').click();await page.locator('#file').setInputFiles({name:'test-SIMULACION.csv',mimeType:'text/csv',buffer:Buffer.from('Plato,Ingredientes\nMerluza,"merluza, harina de trigo, mantequilla"\n')});await expect(page.locator('#tb tr .code-summary strong')).toHaveText('1, 4, 7');
 await expect(page.locator('#md')).toBeDisabled();await page.locator('#ack').check();await expect(page.locator('#md')).toBeEnabled();const pending=page.waitForEvent('download');await page.locator('#md').click();const d=await pending;expect(d.suggestedFilename()).toBe('matrice-allergeni-it.md');const file=await d.path();if(!file)throw Error('Missing Markdown');const raw=await readFile(file,'utf8');expect(raw).toContain('VERSIONE SPERIMENTALE');expect(raw).toContain('1, 4, 7');expect(raw).toContain('Merluza');await page.locator('#ack').uncheck();await expect(page.locator('#md')).toBeDisabled();
});
test('validated fixture exports menu review reports without private cost',async({page})=>{
 await page.goto(root+'/instructor/menu-design-studio/');
 const fixture={items:[{id:'fixture',approved:true,name:{it:'Pasta QA'},category:{it:'Primi'},description:{it:'Pomodoro'},grossPrice:12,internalCost:3,allergenReview:{status:'validated',reference:'synthetic QA fixture',codes:[]},translationReview:{it:{status:'validated',reference:'synthetic QA fixture'}}}]};
 await page.locator('#source').fill(JSON.stringify(fixture));await page.locator('#load').click();await reportFiles(page,'menu-bozza-revisione','Pasta QA','NON DISTRIBUIRE');
 await page.locator('#rl-report-format').selectOption('md');const p=page.waitForEvent('download');await page.locator('.rl-report-download').click();const d=await p;const file=await d.path();if(!file)throw Error('Missing report');expect(await readFile(file,'utf8')).not.toContain('internalCost');
});
