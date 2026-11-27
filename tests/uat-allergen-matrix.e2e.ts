import {test,expect} from '@playwright/test';
import {readFile} from 'node:fs/promises';
const root=process.env.LIVE_URL;
if(!root) throw new Error('LIVE_URL required for production UAT');
const route=root+'/instructor/menu-engineering/matrice-allergeni/';
test('UAT-03: explicit synthetic compositions IT ES EN, separate uncertainty and no automatic confirmations',async({page})=>{
 await page.goto(route);
 // Expected groups specified by the synthetic ingredient list, not by the application's dictionary.
 const cases=[
 {name:'IT explicit',ing:'farina di grano; uova; latte',foodLang:'it',expected:[1,3,7]},
 {name:'ES explicit',ing:'merluza; harina de trigo; mantequilla',foodLang:'es',expected:[1,4,7]},
 {name:'EN explicit',ing:'wheat flour; egg; milk',foodLang:'en',expected:[1,3,7]},
 {name:'IT vegetable',ing:'peperoni',foodLang:'it',expected:[]},
 {name:'IT yeast',ing:'farina di grano; lievito di birra; acqua; sale',foodLang:'it',expected:[1]},
 {name:'ES yeast',ing:'harina de trigo; levadura de cerveza; agua; sal',foodLang:'es',expected:[1]},
 {name:'EN yeast',ing:"wheat flour; brewer's yeast; water; salt",foodLang:'en',expected:[1]}
 ];
 const results=await page.evaluate((rows)=>rows.map(c=>{const d=(window as any).make(c.name,c.ing,{foodLang:c.foodLang});return {name:c.name,direct:d.s.flatMap((v:number,i:number)=>v===1?[i+1]:[]),possible:d.s.flatMap((v:number,i:number)=>v===2?[i+1]:[]),states:d.s,auto:d.events.some((e:any)=>e.auto_confirm)};}),cases);
 for(let i=0;i<cases.length;i++){expect(results[i].direct,cases[i].name).toEqual(cases[i].expected);expect(results[i].possible,cases[i].name).toEqual([]);expect(results[i].states).toHaveLength(14);expect(results[i].states.every((v:number)=>v<=2)).toBe(true);expect(results[i].auto).toBe(false);}
});
test('UAT-03: live import, possible codes, draft export, restoration resets review',async({page})=>{
 await page.goto(route);await page.locator('[data-l=it]').click();
 const data='Categoría,Plato,Ingredientes\nPescados,Merluza,"merluza; harina de trigo; mantequilla"\nGuarniciones,Puré,"patatas; Propuestos (no confirmados): leche"\n';
 await page.locator('#file').setInputFiles({name:'UAT-SIMULACION.csv',mimeType:'text/csv',buffer:Buffer.from(data)});
 await expect(page.locator('#count')).toHaveText('2');
 await expect(page.locator('#tb tr .code-summary strong').first()).toHaveText('1, 4, 7');
 const snapshot=await page.evaluate('({states:dishes.map(d=>d.s),langs:dishes.map(d=>d.sourceFoodLang),reviewed:isReviewed(),demo})');
 expect(snapshot.states[1][6]).toBe(2);expect(snapshot.langs).toEqual(['es','es']);expect(snapshot.reviewed).toBe(false);expect(snapshot.demo).toBe(true);
 for(const id of ['excel','word','pdf','md'])await expect(page.locator('#'+id)).toBeDisabled();
 await page.locator('#ack').check();
 const download=async(id:string,name:string)=>{const wait=page.waitForEvent('download');await page.locator('#'+id).click();const d=await wait;expect(d.suggestedFilename()).toBe(name);const p=await d.path();if(!p)throw Error('Missing download');return readFile(p);};
 const xlsx=await download('excel','matrice-allergeni-it.xlsx');expect(xlsx.subarray(0,4).toString('hex')).toBe('504b0304');expect(xlsx.toString()).toContain('xl/workbook.xml');expect(xlsx.toString()).toContain('name="Audit"');
 const word=await download('word','matrice-allergeni-it.docx');expect(word.subarray(0,4).toString('hex')).toBe('504b0304');expect(word.toString()).toContain('VERSIONE SPERIMENTALE');
 const session=await download('sessionSave','risto-lab-session.json');await page.reload();await page.locator('#sessionFile').setInputFiles({name:'uat-session.json',mimeType:'application/json',buffer:session});await expect(page.locator('#count')).toHaveText('2');
 await expect(page.locator('#ack')).not.toBeChecked();await expect(page.locator('#checked')).not.toBeChecked();await expect(page.locator('#excel')).toBeDisabled();
 expect(await page.evaluate('isReviewed()')).toBe(false);
 for(const lang of ['es','en','it']){await page.locator('[data-l='+lang+']').click();expect(await page.evaluate('dishes.every(d=>d.sourceFoodLang==="es")')).toBe(true);}
});
