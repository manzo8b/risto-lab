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


test('v2.5 semantic context: evidence, composition, alternatives, claims and traces',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(route);
 const cases=await page.evaluate(`(()=>{
 const run=(ing,foodLang='es')=>{const d=make('Synthetic',ing,{foodLang});return {s:d.s,events:d.events,cross:d.crossEvents,flags:d.flags};};
 return {
 egg:run('huevos fritos o revueltos'),milk:run('leche o agua'),butter:run('aceite de oliva o mantequilla'),sesame:run('sésamo (opcional)'),
 bread:run('pan blanco'),multi:run('pan multicereales'),lupin:run('harina de altramuz'),negative:run('sin leche'),gluten:run('pan sin gluten'),lactose:run('sin lactosa'),
 trace:run('puede contener leche; huevos'),traceList:run('puede contener leche, huevos'),wine:run('vino blanco'),gin:run('gin'),
 pepper:run('peperoni','it'),sausage:run('pepperoni','en'),coconut:run('coconut cream','en'),suppli:run('supplì','it')
 };
 })()`);
 expect(cases.egg.s[2]).toBe(1);
 expect(cases.milk.s[6]).toBe(2);expect(cases.butter.s[6]).toBe(2);expect(cases.sesame.s[10]).toBe(2);
 expect(cases.bread.s).toEqual([2,...Array(13).fill(0)]);expect(cases.multi.s[10]).toBe(0);expect(cases.multi.s[12]).toBe(0);
 expect(cases.lupin.s[12]).toBe(1);
 expect(cases.negative.events.some(e=>e.channel==='negative_claim')).toBe(true);expect(cases.negative.s[6]).toBe(2);
 expect(cases.gluten.events.some(e=>e.channel==='negative_claim')).toBe(true);expect(cases.lactose.s[6]).toBe(2);
 expect(cases.trace.s[6]).toBe(0);expect(cases.trace.s[2]).toBe(1);expect(cases.trace.cross.some(e=>e.allergen_code===7)).toBe(true);
 expect(cases.traceList.flags.some(f=>f.includes('trace_scope_review'))).toBe(true);
 expect(cases.wine.s[11]).toBe(2);expect(cases.wine.events.some(e=>e.channel==='threshold_check')).toBe(true);
 expect(cases.gin.s.every(s=>s===0)).toBe(true);expect(cases.pepper.s.every(s=>s===0)).toBe(true);
 expect(cases.sausage.events.some(e=>e.concept_id==='rlgi:pepperoni_sausage')).toBe(true);
 expect(cases.coconut.s[6]).toBe(0);expect(cases.suppli.s.every(s=>s===0)).toBe(true);expect(cases.suppli.flags.length).toBeGreaterThan(0);
 for(const c of Object.values(cases))expect(c.s.every(s=>s<=2)).toBe(true);
 expect(errors).toEqual([]);
});
test('v2.5 synthetic 227-row structured CSV, language, provenance, session and Excel audit',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(route);
 const header=['ID','Categoría','Plato','Ingredientes declarados (carta/ficha)','Ingredientes propuestos (no confirmados)','Verificación / discrepancia','Fuente Canva','Estado','Idioma'];
 const rows=Array.from({length:227},(_,i)=>['SYN-'+i,'Category '+i%17,'Synthetic '+i,'huevo frito o revuelto','leche','Otra carta indica mostaza','Synthetic source','SIMULACION','ES-es']);
 const data=[header,...rows].map(row=>row.map(v=>'"'+v.replace(/"/g,'""')+'"').join(',')).join('\n');
 await page.locator('#file').setInputFiles({name:'synthetic-SIMULACION.csv',mimeType:'text/csv',buffer:Buffer.from(data)});
 await expect(page.locator('#count')).toHaveText('227');
 const audit=await page.evaluate(`(async()=>{
 const inspect=()=>({n:dishes.length,categories:new Set(dishes.map(d=>d.meta.category)).size,cells:dishes.reduce((n,d)=>n+d.s.length,0),langs:dishes.every(d=>d.foodLang==='es'&&d.sourceFoodLang==='es'),provenance:dishes.every(d=>d.s[2]===1&&d.s[6]===2&&d.s[9]===0&&d.events.some(e=>e.channel==='document_discrepancy')),ids:new Set(dishes.map(d=>d.meta.id)).size});
 const before=inspect();
 const data=JSON.parse(JSON.stringify({format:'RISTO-LAB-session',version:1,dictionary:DICTIONARY.version,dishes,source,raw,demo}));
 data.dishes[0].foodLang='mixed';restoreSession(data);
 const after=inspect();
 const reportData=report(),sourceCol=reportData.head.indexOf('Lingua sorgente');
 const bytes=new Uint8Array(await excelBlob().arrayBuffer()),view=new DataView(bytes.buffer),decoder=new TextDecoder(),files={};
 for(let p=0;p+30<=bytes.length&&view.getUint32(p,true)===0x04034b50;){const len=view.getUint32(p+18,true),nl=view.getUint16(p+26,true),el=view.getUint16(p+28,true),start=p+30+nl+el;files[decoder.decode(bytes.slice(p+30,p+30+nl))]=decoder.decode(bytes.slice(start,start+len));p=start+len;}
 return {before,after,sourceCol,sourceValues:reportData.rows.every(r=>r[sourceCol]==='es'),audit:files['xl/workbook.xml'].includes('name="Audit"')&&files['xl/worksheets/sheet3.xml'].includes('document_discrepancy'),matrixRows:(files['xl/worksheets/sheet1.xml'].match(/<row r=/g)||[]).length};
 })()`);
 const expected={n:227,categories:17,cells:3178,langs:true,provenance:true,ids:227};
 expect(audit.before).toEqual(expected);expect(audit.after).toEqual(expected);expect(audit.sourceCol).toBeGreaterThan(0);expect(audit.sourceValues).toBe(true);expect(audit.audit).toBe(true);expect(audit.matrixRows).toBe(228);
 for(const l of ['es','en','it']){await page.locator('[data-l="'+l+'"]').click();expect(await page.evaluate('dishes.every(d=>d.foodLang==="es"&&d.sourceFoodLang==="es")')).toBe(true);}
 await page.setViewportSize({width:390,height:844});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 expect(errors).toEqual([]);
});
test('v2.5 proposed ingredients never become direct evidence after language or name edits',async({page})=>{
 await page.goto(route);
 const result=await page.evaluate(`(()=>{
 const d=make('Synthetic','huevo; leche',{foodLang:'es',sourceFoodLang:'es',meta:{declared:'huevo',proposed:'leche',question:'Otra carta: mostaza',simulation:true}});
 d.name='Edited';d.meta.modified=true;d.foodLang='en';analyze(d);
 const unchanged=d.s.slice();d.ing='huevo; leche; mantequilla';analyze(d);
 return {unchanged,edited:d.s,source:d.sourceFoodLang,events:d.events};
 })()`);
 expect(result.unchanged[2]).toBe(1);expect(result.unchanged[6]).toBe(2);expect(result.edited[2]).toBe(2);expect(result.edited[6]).toBe(2);expect(result.source).toBe('es');expect(result.events.some(e=>e.channel==='document_discrepancy')).toBe(true);
});
