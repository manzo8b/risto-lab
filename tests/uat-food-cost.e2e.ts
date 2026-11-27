import {test,expect} from '@playwright/test';
import {readFile} from 'node:fs/promises';
const root=process.env.LIVE_URL;
if(!root) throw new Error('LIVE_URL required for production UAT');
test('UAT-04: yield, mass/volume conversions, subrecipe allocation, VAT, margins and missing data',async({page})=>{
 const date='2026-11-27';
 const archive={schema:'ristolab.recipe-archive/1',recipes:[
 {id:'UAT-MAIN',name:'Piatto sintetico QA',servings:4,ingredients:[{name:'Ortaggi',gross:null,net:800,waste:20,unit:'g'},{name:'Olio',gross:250,unit:'ml'}],subrecipes:[{id:'UAT-SUB',portions:2}]},
 {id:'UAT-SUB',name:'Salsa sintetica QA',servings:4,ingredients:[{name:'Base salsa',gross:2,unit:'kg'}],subrecipes:[]}]};
 const suppliers={schema:'ristolab.supplier-links/1',currency:'EUR',priceBasis:'net_excluding_vat',products:[
 {id:'P1',pack:1,unit:'kg',price:4,date},{id:'P2',pack:1,unit:'l',price:8,date},{id:'P3',pack:1,unit:'kg',price:4,date}],
 links:[{recipeId:'UAT-MAIN',index:0,ingredientName:'Ortaggi',productId:'P1'},{recipeId:'UAT-MAIN',index:1,ingredientName:'Olio',productId:'P2'},{recipeId:'UAT-SUB',index:0,ingredientName:'Base salsa',productId:'P3'}]};
 const file=(name:string,data:unknown)=>({name,mimeType:'application/json',buffer:Buffer.from(JSON.stringify(data))});
 const download=async(id:string,name:string)=>{const wait=page.waitForEvent('download');await page.locator(id).click();const d=await wait;expect(d.suggestedFilename()).toBe(name);const p=await d.path();if(!p)throw Error('Missing download');return readFile(p);};
 const result=async()=>JSON.parse((await download('#json','food-cost.json')).toString());
 await page.goto(root+'/instructor/food-cost-calculator/');
 await page.locator('#lang').selectOption('it');
 await page.locator('.rl-suite-guide summary').click();await expect(page.locator('.rl-suite-guide ol li')).toHaveCount(4);
 await page.locator('#recipes').setInputFiles(file('recipes.json',archive));await expect(page.locator('#recipe')).toHaveValue('UAT-MAIN');
 await page.locator('#suppliers').setInputFiles(file('suppliers.json',suppliers));await expect(page.locator('#status')).toHaveText('✓');
 for(const [id,v] of Object.entries({date,age:'30',price:'11',vat:'10',target:'25',labor:'1.2',overhead:'0.8'}))await page.locator('#'+id).fill(v);
 await page.locator('#calculate').click();const out=await result();
 expect(out.result.cost).toBeCloseTo(10,8);expect(out.result.knownSubtotal).toBeCloseTo(10,8);expect(out.result.covered).toBe(3);
 const expected={perPortion:2.5,netRevenue:10,foodCostPct:25,cm1:7.5,targetGross:11,primeCost:3.7,fullCost:4.5};
 for(const [key,value] of Object.entries(expected))expect(out.metrics[key],key).toBeCloseTo(value,8);
 expect(out.sourceStatus).toEqual(['unverified']);expect(out.used).toHaveLength(3);
 const csv=(await download('#csv','food-cost.csv')).toString();expect(csv).toContain('"UAT-MAIN"');expect(csv).toContain('"2.5"');
 await page.locator('#save').click();await expect(page.locator('#history')).toContainText('UAT-MAIN');
 await page.reload();await expect(page.locator('#history')).toContainText('UAT-MAIN');await page.locator('#history button').first().click();expect((await result()).metrics).toEqual(out.metrics);
 await page.locator('#price').fill('0');await expect(page.locator('#json')).toBeDisabled();await page.locator('#calculate').click();
 const zero=await result();expect(zero.metrics.netRevenue).toBe(0);expect(zero.metrics.foodCostPct).toBeNull();expect(zero.metrics.cm1).toBeCloseTo(-2.5,8);
 const incompatible=structuredClone(suppliers);incompatible.products[0].unit='l';
 await page.locator('#suppliers').setInputFiles(file('incompatible.json',incompatible));await expect(page.locator('#status')).toHaveText('✓');await page.locator('#calculate').click();
 const partial=await result();expect(partial.result.cost).toBeNull();expect(partial.result.knownSubtotal).toBeCloseTo(6,8);expect(partial.metrics.perPortion).toBeNull();expect(partial.metrics.foodCostPct).toBeNull();expect(partial.result.issues).toContain('0:incompatible_units');
});
test('UAT-04: market stress scenario and translated guide, no automatic supplier price substitution',async({page})=>{
 await page.goto(root+'/instructor/food-cost-calculator/');
 for(const [lang,label] of [['it','Come'],['es','Cómo'],['en','How']] as const){
  await page.locator('#lang').selectOption(lang);await expect(page.locator('.rl-suite-guide summary')).toContainText(label);
 }
 await page.locator('#lang').selectOption('it');
 for(const [id,v] of Object.entries({mf:'2.5',ml:'1.2',mo:'0.8',mp:'11',mv:'10',df:'20',dl:'25',do:'0'}))await page.locator('#'+id).fill(v);
 await page.locator('#simulate').click();const results=page.locator('#marketResults .metric');
 await expect(results).toHaveCount(4);
 await expect(results.nth(0)).toContainText(/30\s*%/);
 await expect(results.nth(1)).toContainText(/7,00\s*€/);
 await expect(results.nth(2)).toContainText(/5,30\s*€/);
 await expect(results.nth(3)).toContainText(/4,70\s*€/);
 await expect(page.locator('#json')).toBeDisabled();
});
