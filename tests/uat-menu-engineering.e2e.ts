import {test,expect} from '@playwright/test';
import {readFile} from 'node:fs/promises';
const root=process.env.LIVE_URL;
if(!root) throw new Error('LIVE_URL required for production UAT');
const route=root+'/instructor/menu-engineering-dashboard/';
const fixture=(name:string,data:unknown)=>({name,mimeType:'application/json',buffer:Buffer.from(JSON.stringify(data))});
async function download(page:import('@playwright/test').Page,id:string,name:string){const pending=page.waitForEvent('download');await page.locator(id).click();const d=await pending;expect(d.suggestedFilename()).toBe(name);const path=await d.path();if(!path)throw Error('Missing download');return readFile(path);}
test('UAT-05: weighted margin, popularity, quadrants, exports, zero and unknown sales',async({page})=>{
 const rows=[['A','Pasta A',40,14,4],['B','Pasta B',40,10,8],['C','Pasta C',10,14,4],['D','Pasta D',10,10,8]].map(([id,name,sold,net,cost])=>({id,name,sold,net,cost,origin:'manual',sourceCategory:'',asOf:'',statuses:[],reference:'Synthetic QA',simulation:true}));
 const session={schema:'ristolab.menu-engineering-session/1',version:'0.1.0',currency:'EUR',start:'2026-11-01',end:'2026-11-30',category:'Primi',salesReference:'Synthetic QA',complete:true,simulation:true,rows};
 await page.goto(route);await page.locator('#importSession').setInputFiles(fixture('uat-session.json',session));await expect(page.locator('#rows .dish')).toHaveCount(4);await page.locator('#calculate').click();
 await expect(page.locator('#resultsTable tbody tr')).toHaveCount(4);
 const out=JSON.parse((await download(page,'#exportReport','risto-lab-menu-report.json')).toString());
 expect(out.purpose).toBe('internal_decision_support_not_validation');expect(out.result.total).toBe(100);expect(out.result.revenue).toBe(1200);expect(out.result.foodCost).toBe(600);expect(out.result.contribution).toBe(600);expect(out.result.foodCostPct).toBeCloseTo(50,8);
 expect(out.result.popularityThreshold).toBeCloseTo(.175,8);expect(out.result.marginThreshold).toBeCloseTo(6,8);expect(out.result.items.map((r:any)=>r.classification)).toEqual(['star','plowhorse','puzzle','dog']);expect(out.result.items.map((r:any)=>r.totalContribution)).toEqual([400,80,100,20]);expect(out.result.simulation).toBe(true);
 const csv=(await download(page,'#exportCSV','risto-lab-menu-analysis.csv')).toString();for(const cls of ['star','plowhorse','puzzle','dog'])expect(csv).toContain('"'+cls+'"');
 const saved=await download(page,'#exportSession','risto-lab-menu-session.json');await page.reload();await page.locator('#importSession').setInputFiles({name:'restored.json',mimeType:'application/json',buffer:saved});await expect(page.locator('#rows .dish')).toHaveCount(4);await page.locator('#calculate').click();const restored=JSON.parse((await download(page,'#exportReport','risto-lab-menu-report.json')).toString());expect(restored.result).toEqual(out.result);
 await page.locator('#row-D [data-field=sold]').fill('');await expect(page.locator('#exportReport')).toBeDisabled();await page.locator('#calculate').click();await expect(page.locator('#status')).toContainText('incompleti');
 await page.locator('#row-D [data-field=sold]').fill('0');await page.locator('#calculate').click();const zero=JSON.parse((await download(page,'#exportReport','risto-lab-menu-report.json')).toString());expect(zero.result.items[3].sold).toBe(0);expect(zero.result.items[3].classification).toBe('dog');expect(zero.result.total).toBe(90);
 for(const id of ['A','B','C'])await page.locator('#row-'+id+' [data-field=sold]').fill('0');await page.locator('#calculate').click();await expect(page.locator('#status')).toContainText('Nessuna vendita');await expect(page.locator('#exportReport')).toBeDisabled();
});
test('UAT-05: import actual Food Cost export, reject inconsistent values and preserve unknown sales',async({page})=>{
 await page.goto(root+'/instructor/food-cost-calculator/');await page.locator('#demo').click();
 const raw=await download(page,'#json','food-cost.json');const cost=JSON.parse(raw.toString());
 await page.goto(route);const tampered=structuredClone(cost);tampered.metrics.perPortion+=1;
 await page.locator('#importCost').setInputFiles(fixture('tampered.json',tampered));await expect(page.locator('#status')).toContainText('non coincide');await expect(page.locator('#rows .dish')).toHaveCount(0);
 await page.locator('#importCost').setInputFiles({name:'actual.json',mimeType:'application/json',buffer:raw});await expect(page.locator('#rows .dish')).toHaveCount(1);await expect(page.locator('#rows [data-field=sold]')).toHaveValue('');await expect(page.locator('#category')).toHaveValue('Primi / Pasta');
 await expect(page.locator('#rl-human-review')).toContainText('Vendite mancanti');await expect(page.locator('#rows [data-field=cost]')).toHaveValue(String(cost.metrics.perPortion));await expect(page.locator('#rows [data-field=net]')).toHaveValue(String(cost.metrics.netRevenue));await expect(page.locator('#complete')).not.toBeChecked();
 await page.locator('#category').fill('Pizza');await expect(page.locator('#rl-human-review')).toContainText('Categoria del Food Cost diversa');
 for(const [lang,label] of [['es','Cómo'],['en','How'],['it','Come']] as const){await page.locator('#lang').selectOption(lang);await expect(page.locator('.rl-suite-guide summary')).toContainText(label);}
});
