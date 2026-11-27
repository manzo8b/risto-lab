import {test,expect} from '@playwright/test';
import {readFile} from 'node:fs/promises';
const root=process.env.LIVE_URL;
if(!root) throw new Error('LIVE_URL required for production UAT');
test('UAT-01: create, scale, export and restore a synthetic recipe',async({page})=>{
 await page.goto(root+'/instructor/recipe-manager/');
 await page.locator('[data-lang=it]').click();
 await page.locator('.rl-suite-guide summary').click();
 await expect(page.locator('.rl-suite-guide ol li')).toHaveCount(4);
 await page.locator('#new').click();
 const field=async(k:string,v:string)=>{const a=page.locator('#editor [data-field='+k+']');await a.fill(v);await a.press('Tab');};
 const cell=async(i:number,k:string,v:string)=>{const a=page.locator('#editor [data-i="'+i+'"][data-k='+k+']');await a.fill(v);await a.press('Tab');};
 const select=async(i:number,k:string,v:string)=>page.locator('#editor [data-i="'+i+'"][data-k='+k+']').selectOption(v);
 await field('name','UAT Ricetta sintetica');await field('category','QA');await field('servings','2');await field('target','4');
 await cell(0,'name','pomodoro');await select(0,'provenance','declared');await cell(0,'gross','200');await select(0,'unit','g');await cell(0,'waste','10');
 await expect(page.locator('[data-calc="0"]')).toContainText('180');
 await expect(page.locator('[data-scale="0"]')).toContainText('360');
 await page.locator('#add').click();
 await cell(1,'name','basilico');await select(1,'provenance','proposed');
 const pending=page.waitForEvent('download');await page.locator('#save').click();const d=await pending;expect(d.suggestedFilename()).toBe('risto-lab-recipe-archive.json');
 const path=await d.path();if(!path)throw Error('Missing archive');
 const bytes=await readFile(path);const archive=JSON.parse(bytes.toString());
 expect(archive.schema).toBe('ristolab.recipe-archive/1');
 expect(archive.recipes[0]).toMatchObject({name:'UAT Ricetta sintetica',category:'QA',servings:2,ingredients:[{name:'pomodoro',gross:200,waste:10,unit:'g',provenance:'declared'},{name:'basilico',provenance:'proposed',gross:null}]});
 await page.reload();
 await page.locator('#file').setInputFiles({name:'uat-recipe.json',mimeType:'application/json',buffer:bytes});
 await expect(page.locator('#editor [data-field=name]')).toHaveValue('UAT Ricetta sintetica');
 await expect(page.locator('#editor [data-field=servings]')).toHaveValue('2');
 await expect(page.locator('#editor [data-i="1"][data-k=provenance]')).toHaveValue('proposed');
 const csvPending=page.waitForEvent('download');await page.locator('#export').click();const csv=await csvPending;const csvPath=await csv.path();if(!csvPath)throw Error('Missing CSV');const raw=await readFile(csvPath,'utf8');
 expect(raw).toContain('Ingredientes propuestos (no confirmados)');expect(raw).toContain('UAT Ricetta sintetica');expect(raw).toContain('pomodoro');expect(raw).toContain('basilico');
});
test('UAT-01: recipe guide localizes on the live site',async({page})=>{
 await page.goto(root+'/instructor/recipe-manager/');
 for(const [lang,label] of [['it','Come'],['es','Cómo'],['en','How']] as const){
  await page.locator('[data-lang='+lang+']').click();
  await expect(page.locator('.rl-suite-guide summary')).toContainText(label);
  await expect(page.locator('.rl-suite-guide ol li')).toHaveCount(4);
 }
});
