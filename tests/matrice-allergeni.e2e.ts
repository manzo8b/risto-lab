import {test,expect} from '@playwright/test';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const root=process.env.LIVE_URL||'http://127.0.0.1:4330/risto-lab';
const route=root+'/instructor/menu-engineering/matrice-allergeni/';
const csv='Plato,Ingredientes\nMerluza,"merluza, harina de trigo, mantequilla"\n';
function pdfFixture(){
 const stream='BT /F1 12 Tf 50 750 Td (Merluza) Tj 0 -20 Td (Ingredientes: merluza, mantequilla) Tj ET';
 const objects=['<< /Type /Catalog /Pages 2 0 R >>','<< /Type /Pages /Kids [3 0 R] /Count 1 >>','<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>','<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>','<< /Length '+Buffer.byteLength(stream)+' >>\nstream\n'+stream+'\nendstream'];
 let s='%PDF-1.4\n';const offsets=[0];objects.forEach((o,i)=>{offsets.push(Buffer.byteLength(s));s+=(i+1)+' 0 obj\n'+o+'\nendobj\n';});const x=Buffer.byteLength(s);s+='xref\n0 6\n0000000000 65535 f \n'+offsets.slice(1).map(o=>String(o).padStart(10,'0')+' 00000 n \n').join('')+'trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n'+x+'\n%%EOF\n';return Buffer.from(s);
}
test('beta route, CSV, code summary, mobile and accessibility',async({page})=>{
 await page.goto(root+'/instructor/menu-engineering/');
 await page.getByRole('link',{name:/Apri Matrice Allergeni Beta/}).click();
 await expect(page).toHaveURL(route);
 await page.locator('[data-l="it"]').click();
 await expect(page.locator('#releaseNotice')).toContainText('VERSIONE SPERIMENTALE');
 await page.locator('#file').setInputFiles({name:'test-SIMULACION.csv',mimeType:'text/csv',buffer:Buffer.from(csv)});
 await expect(page.locator('#tb tr')).toHaveCount(1);
 await expect(page.locator('#tb tr .code-summary strong')).toHaveText('1, 4, 7');
 expect(await page.evaluate('demo && !isReviewed()')).toBe(true);
 await page.setViewportSize({width:390,height:844});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.addScriptTag({path:require.resolve('axe-core/axe.min.js')});
 const issues=await page.evaluate('axe.run(document,{runOnly:{type:"tag",values:["wcag2a","wcag2aa","wcag21a","wcag21aa"]}}).then(r=>r.violations.filter(v=>["critical","serious"].includes(v.impact)).map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)})))');
 expect(issues).toEqual([]);
});
test('CDN spreadsheet, Word and PDF imports on built route',async({page})=>{
 test.setTimeout(120000);
 await page.goto(route);
 const results=await page.evaluate(`(async()=>{
  const out={};const check=(p)=>({count:p.list.length,name:p.list[0]?.name,ing:p.list[0]?.ing});
  const x=await sheets();const w=x.utils.book_new();x.utils.book_append_sheet(w,x.utils.aoa_to_sheet([['Plato','Ingredientes'],['Merluza','merluza, mantequilla']]),'Recipes');
  for(const type of ['xlsx','xls']){const bytes=x.write(w,{bookType:type==='xls'?'biff8':'xlsx',type:'array'});out[type]=check(await parseFile(new File([bytes],'test.'+type)));}
  const doc=zip({'[Content_Types].xml':'<?xml version="1.0"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>','_rels/.rels':'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>','word/document.xml':'<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body><w:p><w:r><w:t>Merluza</w:t></w:r></w:p><w:p><w:r><w:t>Ingredientes: merluza, mantequilla</w:t></w:r></w:p></w:body></w:document>'});
  out.docx=check(await parseFile(new File([doc],'test.docx')));return out;
 })()`);
 const pdf=await page.evaluate(async(bytes)=>{const parsed=await (window as any).parseFile(new File([new Uint8Array(bytes)],'test.pdf'));return parsed.list;},Array.from(pdfFixture()));
 for(const f of ['xlsx','xls','docx'])expect((results as any)[f]).toEqual({count:1,name:'Merluza',ing:'merluza, mantequilla'});
 expect(pdf).toEqual([{name:'Merluza',ing:'merluza, mantequilla'}]);
});
