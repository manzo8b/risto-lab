import {test,expect} from '@playwright/test';
import {readFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
const root=process.env.LIVE_URL;
if(!root) throw new Error('LIVE_URL required for production UAT');
const route=root+'/instructor/menu-design-studio/';
const ref='SYNTHETIC QA ONLY';
const reviews=Object.fromEntries(['it','en','es','fr'].map(lang=>[lang,{status:'validated',reference:ref}]));
const item={id:'QA-01',approved:true,name:{it:'Pasta al pomodoro QA',en:'Tomato pasta QA',es:'Pasta con tomate QA',fr:'Pâtes à la tomate QA'},category:{it:'Primi',en:'First courses',es:'Primeros',fr:'Entrées'},description:{it:'Pomodoro e basilico',en:'Tomato and basil',es:'Tomate y albahaca',fr:'Tomate et basilic'},grossPrice:12,internalCost:98765.43,supplier:'PRIVATE-QA-SECRET',allergenReview:{status:'validated',reference:ref,codes:[1]},translationReview:reviews};
const data={items:[item,{...item,id:'QA-02',approved:false,name:{it:'EXCLUDED-QA-DISH'}}]};
test('UAT-06: three editorial templates, three languages, separate and digital modes, internal-only projection',async({page},info)=>{
 await page.goto(route);await page.locator('#demo').click();await expect(page.locator('#print')).toBeDisabled();await expect(page.locator('#export')).toBeDisabled();
 await page.locator('#source').fill(JSON.stringify(data));await page.locator('#load').click();await page.locator('#restaurant').fill('Ristorante QA');await page.locator('#local').selectOption('it');await page.locator('#extra1').selectOption('en');await page.locator('#extra2').selectOption('es');
 await expect(page.locator('#export')).toBeEnabled();await expect(page.locator('.paper .dish')).toHaveCount(1);await expect(page.locator('.paper .legend')).toHaveCount(3);
 for(const l of ['it','en','es'])await expect(page.locator('.paper .legend[lang='+l+'] li')).toHaveCount(14);
 const fonts=new Set<string>();
 for(const style of ['modern','classic','bistro']){
  await page.locator('#style').selectOption(style);await expect(page.locator('.paper')).toHaveAttribute('data-style',style);fonts.add(await page.locator('.paper').evaluate(e=>getComputedStyle(e).fontFamily));
  await page.setViewportSize({width:1440,height:1000});await page.locator('.paper').screenshot({path:info.outputPath(style+'-desktop.png')});
  for(const width of [360,390,768,1440]){await page.setViewportSize({width,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),style+' '+width).toBe(true);}
  await page.setViewportSize({width:390,height:900});await page.locator('.paper').screenshot({path:info.outputPath(style+'-mobile.png')});
  await page.emulateMedia({media:'print'});await expect(page.locator('.rl-suite-nav')).toBeHidden();await expect(page.locator('aside')).toBeHidden();await expect(page.locator('.paper .watermark')).toContainText('NON DISTRIBUIRE');
  const path=info.outputPath(style+'-A4.pdf');const pdf=await page.pdf({path,format:'A4',printBackground:true,margin:{top:'12mm',bottom:'12mm',left:'12mm',right:'12mm'}});expect(pdf.subarray(0,5).toString()).toBe('%PDF-');
  const printed=execFileSync('pdftotext',[path,'-'],{encoding:'utf8'});for(const text of ['Pasta al pomodoro QA','Tomato pasta QA','Pasta con tomate QA','NON DISTRIBUIRE'])expect(printed).toContain(text);for(const text of ['PRIVATE-QA-SECRET','98765','EXCLUDED-QA-DISH','Supplier Manager','Configurazione menu'])expect(printed).not.toContain(text);
  await page.emulateMedia({media:'screen'});
 }
 expect(fonts.size).toBe(3);
 await page.locator('#mode').selectOption('separate');await expect(page.locator('.paper')).toHaveCount(3);await expect(page.locator('.paper .legend')).toHaveCount(3);
 await page.locator('#mode').selectOption('digital');await page.locator('#digitalLang').selectOption('es');await expect(page.locator('.paper .dish')).toContainText('Pasta con tomate QA');await expect(page.locator('.paper')).toHaveCount(1);
 const pending=page.waitForEvent('download');await page.locator('#export').click();const d=await pending;expect(d.suggestedFilename()).toBe('menu-bozza-revisione.json');const path=await d.path();if(!path)throw Error('Missing export');const raw=await readFile(path,'utf8');const out=JSON.parse(raw);
 expect(out.purpose).toBe('internal_review_only_not_for_customer_use');expect(out.menus.map((m:any)=>m.language)).toEqual(['it','en','es']);for(const m of out.menus){expect(m.items).toHaveLength(1);expect(m.items[0].grossPrice).toBe(12);expect(m.items[0].allergens).toEqual([1]);expect(m.items[0]).not.toHaveProperty('internalCost');}expect(raw).not.toContain('PRIVATE-QA-SECRET');
});
test('UAT-06: draft, changed data, missing translation review and missing legend block print/export',async({page})=>{
 await page.goto(route);await page.locator('#source').fill(JSON.stringify(data));await page.locator('#load').click();await expect(page.locator('#export')).toBeEnabled();
 await page.locator('#extra1').selectOption('fr');await expect(page.locator('#issues')).toContainText('legenda allergeni da validare');await expect(page.locator('#print')).toBeDisabled();await expect(page.locator('#export')).toBeDisabled();
 await page.locator('#extra1').selectOption('');await expect(page.locator('#print')).toBeEnabled();
 const invalid=structuredClone(data);invalid.items[0].translationReview={...reviews,it:{status:'pending',reference:ref}};await page.locator('#source').fill(JSON.stringify(invalid));await expect(page.locator('#print')).toBeDisabled();await page.locator('#load').click();await expect(page.locator('#issues')).toContainText('review_required');await expect(page.locator('#export')).toBeDisabled();
 await page.emulateMedia({media:'print'});expect(await page.locator('body').evaluate(e=>getComputedStyle(e,'::before').content)).toContain('Stampa bloccata');
});
