import {test,expect} from '@playwright/test';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
type Evidence={channel:string;rule:string;allergen_code:number|null;concept_id:string;auto_confirm:boolean;provenance:string};
type Analysis={s:number[];events:Evidence[];cross:Evidence[];flags:string[]};
type AuditSnapshot={n:number;categories:number;cells:number;langs:boolean;provenance:boolean;ids:number};
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
 const cases=await page.evaluate<Record<string,Analysis>>(`(()=>{
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
 const audit=await page.evaluate<{before:AuditSnapshot;after:AuditSnapshot;sourceCol:number;sourceValues:boolean;audit:boolean;matrixRows:number}>(`(async()=>{
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
 const result=await page.evaluate<{unchanged:number[];edited:number[];source:string;events:Evidence[]}>(`(()=>{
 const d=make('Synthetic','huevo; leche',{foodLang:'es',sourceFoodLang:'es',meta:{declared:'huevo',proposed:'leche',question:'Otra carta: mostaza',simulation:true}});
 d.name='Edited';d.meta.modified=true;d.foodLang='en';analyze(d);
 const unchanged=d.s.slice();d.ing='huevo; leche; mantequilla';analyze(d);
 return {unchanged,edited:d.s,source:d.sourceFoodLang,events:d.events};
 })()`);
 expect(result.unchanged[2]).toBe(1);expect(result.unchanged[6]).toBe(2);expect(result.edited[2]).toBe(2);expect(result.edited[6]).toBe(2);expect(result.source).toBe('es');expect(result.events.some(e=>e.channel==='document_discrepancy')).toBe(true);
});

test('research context lexicon is non-assertive; provenance and trace ambiguity stay explicit',async({page})=>{
 await page.goto(route);
 const result=await page.evaluate<{count:number;profile:string;context:Evidence[];states:number[];before:Evidence[];edited:Evidence[];editedStates:number[];trace:Evidence[];cross:Evidence[];names:{events:Evidence[];states:number[]}[]}>(`(()=>{
 const dish=make('Supplì','riso',{foodLang:'it'});
 const declared=make('Synthetic','huevo',{foodLang:'es',meta:{declared:'huevo',simulation:true}});
 const before=declared.events.slice();declared.ing='huevo; leche';analyze(declared);
 const trace=make('Synthetic','may contain milk, egg',{foodLang:'en'});
 const reportNames=['tortilla de patatas','full English','croque-monsieur','clam chowder','negroni'];
 const names=reportNames.map(name=>make(name,'',{foodLang:'mixed'}));
 return {count:GI.context_lexicon.length,profile:GI.regulatory_profile.id,context:dish.events,states:dish.s,before,edited:declared.events,editedStates:declared.s,trace:trace.events,cross:trace.crossEvents,names:names.map(d=>({events:d.events,states:d.s}))};
 })()`);
 expect(result.count).toBeGreaterThanOrEqual(50);expect(result.profile).toBe('EU_1169');
 expect(result.states.every(s=>s===0)).toBe(true);
 expect(result.context.some(e=>e.rule==='dish_name_recipe_required'&&e.allergen_code===null&&e.auto_confirm===false)).toBe(true);
 expect(result.before.some(e=>e.provenance==='declared'&&e.channel==='ingredient_evidence')).toBe(true);
 expect(result.editedStates[2]).toBe(2);expect(result.editedStates[6]).toBe(2);
 expect(result.edited.every(e=>e.provenance==='edited_unverified'&&e.auto_confirm===false)).toBe(true);
 expect(result.trace.some(e=>e.channel==='cross_contact_scope_ambiguous')).toBe(true);
 expect(result.cross.every(e=>e.channel==='cross_contact')).toBe(true);
 for(const d of result.names){expect(d.states.every(s=>s===0)).toBe(true);expect(d.events.some(e=>e.rule==='dish_name_recipe_required')).toBe(true);}
});

test('optional private CSV release gate (local only, no recipe content in assertions)',async({page})=>{
 const privatePath=process.env.RISTOLAB_PRIVATE_CSV;
 test.skip(!privatePath,'Private dataset not provided; run locally with RISTOLAB_PRIVATE_CSV');
 test.skip(!!process.env.CI,'Private data must never be uploaded to CI');
 const errors:string[]=[];page.on('pageerror',()=>errors.push('page error'));
 await page.goto(route);
 await page.locator('#file').setInputFiles(privatePath!);
 await expect(page.locator('#count')).toHaveText('227');
 await page.locator('[data-l="it"]').click();
 const audit=await page.evaluate(`(async()=>{
 const ids=dishes.map(d=>d.meta.id),meta=JSON.stringify(dishes.map(d=>d.meta)),states=JSON.stringify(dishes.map(d=>d.s));
 const session=JSON.parse(JSON.stringify({format:'RISTO-LAB-session',version:1,dictionary:DICTIONARY.version,dishes,source,raw,demo}));
 session.dishes[0].foodLang='mixed';restoreSession(session);
 const events=dishes.flatMap(d=>[...d.events,...d.crossEvents]);
 const bytes=new Uint8Array(await excelBlob().arrayBuffer()),view=new DataView(bytes.buffer),decoder=new TextDecoder(),files={};
 for(let p=0;p+30<=bytes.length&&view.getUint32(p,true)===0x04034b50;){const len=view.getUint32(p+18,true),nl=view.getUint16(p+26,true),el=view.getUint16(p+28,true),start=p+30+nl+el;files[decoder.decode(bytes.slice(p+30,p+30+nl))]=decoder.decode(bytes.slice(start,start+len));p=start+len;}
 const audit=files['xl/worksheets/sheet3.xml'];
 return {n:dishes.length,categories:new Set(dishes.map(d=>d.meta.category)).size,ids:new Set(ids).size,stable:JSON.stringify(ids)===JSON.stringify(dishes.map(d=>d.meta.id)),metadata:meta===JSON.stringify(dishes.map(d=>d.meta)),states:states===JSON.stringify(dishes.map(d=>d.s)),cells:dishes.reduce((n,d)=>n+d.s.length,0),language:dishes.every(d=>d.foodLang==='es'&&d.sourceFoodLang==='es'),simulation:demo&&!isReviewed(),noConfirm:dishes.every(d=>d.s.every(s=>s<=2))&&events.every(e=>e.auto_confirm===false),noProposedDirect:!events.some(e=>e.provenance==='proposed'&&e.channel==='ingredient_evidence'),audit:!!audit&&audit.includes('EU_1169')&&(audit.match(/<row r=/g)||[]).length===234,exportLanguages:(()=>{const r=report(),a=r.head.indexOf('Lingua sorgente'),b=r.head.indexOf('Lingua del ricettario');return a>=0&&b>=0&&r.rows.every(row=>row[a]==='es'&&row[b]==='es')})()};
 })()`);
 expect(audit).toEqual({n:227,categories:17,ids:227,stable:true,metadata:true,states:true,cells:3178,language:true,simulation:true,noConfirm:true,noProposedDirect:true,audit:true,exportLanguages:true});
 for(const l of ['es','en','it']){await page.locator('[data-l="'+l+'"]').click();expect(await page.evaluate('dishes.every(d=>d.foodLang==="es"&&d.sourceFoodLang==="es")')).toBe(true);}
 await page.setViewportSize({width:390,height:844});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 expect(errors).toEqual([]);
});

test('v2.6 three-column import keeps categories, original text and proposed evidence',async({page})=>{
 await page.goto(route);
 const result=await page.evaluate(`(async()=>{
 const x=await sheets(),wb=x.utils.book_new();
 const raw='patatas; Propuestos (no confirmados): leche; mantequilla; sal';
 const rows=[['Categoría','Plato','Ingredientes'],['Guarniciones','Puré de patatas [SIMULACIÓN]',raw],['Pescados','Merluza','merluza'],['Guarniciones','Otro','huevo; Propuestos (no confirmados): leche']];
 x.utils.book_append_sheet(wb,x.utils.aoa_to_sheet(rows),'SIMULACION');
 const p=await parseFile(new File([x.write(wb,{bookType:'xlsx',type:'array'})],'QA-SIMULACION.xlsx'));
 load(p.list,'QA-SIMULACION.xlsx','',p.sample);
 const inspect=()=>({categories:dishes.map(d=>d.meta.category),langs:dishes.map(d=>d.foodLang),basis:dishes.map(d=>d.meta.languageBasis),raw:dishes[0].ing,declared:dishes[0].meta.declared,proposed:dishes[0].meta.proposed,states:dishes.map(d=>d.s),events:dishes[0].events,unknown:dishes[1].meta.unspecified});
 const first=inspect(),r=report();const v=JSON.parse(JSON.stringify({format:'RISTO-LAB-session',version:1,dictionary:DICTIONARY.version,dishes,source,raw:'',demo}));restoreSession(v);
 const second=inspect();
 return {first,second,expectedRaw:raw,head:r.head,row:r.rows[0],last:r.head.at(-1),options:[...document.querySelector('#categoryFilter').options].map(o=>o.value),edited:(()=>{const d=dishes[0];d.ing+='; huevo';analyze(d);return d.s[2]})()};
 })()`);
 expect(result.first).toEqual(result.second);
 expect(result.first.categories).toEqual(['Guarniciones','Pescados','Guarniciones']);
 expect(result.first.langs).toEqual(['es','es','es']);expect(result.first.basis).toEqual(['header_hint','header_hint','header_hint']);
 expect(result.first.raw).toBe(result.expectedRaw);expect(result.first.declared).toBe('patatas');expect(result.first.proposed).toContain('leche');
 expect(result.first.states[0][6]).toBe(2);expect(result.first.states[1][3]).toBe(1);expect(result.first.states[2][2]).toBe(1);expect(result.first.states[2][6]).toBe(2);
 expect(result.first.events.filter((e:any)=>e.allergen_code===7).every((e:any)=>e.provenance==='proposed'&&e.state!==1&&e.auto_confirm===false)).toBe(true);
 expect(result.first.unknown).toBe(true);expect(result.options).toContain('Guarniciones');expect(result.row[result.head.indexOf('Categoria')]).toBe('Guarniciones');expect(result.row[result.head.indexOf('Dubbi / possibili da verificare')]).toBe('7');expect(result.last).toBe('Codici allergeni segnalati / confermati');expect(result.edited).toBe(2);
});
test('v2.6 explicit language wins, missing provenance never becomes declared, and imports scale',async({page})=>{
 await page.goto(route);
 const result=await page.evaluate(`(()=>{
 const p=importRows([['Category','Dish','Ingredients','Language'],['A','Test','milk','es'],['B','Test','milk','mixed']]);
 const a=p.list.map(x=>make(x.name,x.ing,x));
 const big=importRows([['Categoría','Plato','Ingredientes'],...Array.from({length:195},(_,i)=>['Category '+i%16,'Test '+i,'huevo; Propuestos (no confirmados): leche'])]);
 const d=big.list.map(x=>make(x.name,x.ing,x));
 return {lang:a.map(x=>x.foodLang),p:a.map(x=>x.events[0].provenance),n:d.length,categories:new Set(d.map(x=>x.meta.category)).size,all:d.every(x=>x.s[2]===1&&x.s[6]===2&&x.s.every(v=>v<=2))};
 })()`);
 expect(result.lang).toEqual(['es','mixed']);expect(result.p).toEqual(['unspecified','unspecified']);expect(result.n).toBe(195);expect(result.categories).toBe(16);expect(result.all).toBe(true);
});
