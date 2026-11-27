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

type DataIntegritySnapshot={categories:string[];langs:string[];basis:string[];raw:string;declared:string;proposed:string;states:number[][];events:(Evidence&{state:number|null})[];unknown:boolean};
test('v2.6 three-column import keeps categories, original text and proposed evidence',async({page})=>{
 await page.goto(route);
 const result=await page.evaluate<{first:DataIntegritySnapshot;second:DataIntegritySnapshot;expectedRaw:string;head:string[];row:string[];last:string;options:string[];edited:number}>(`(async()=>{
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
 expect(result.first.events.filter(e=>e.allergen_code===7).every(e=>e.provenance==='proposed'&&e.state!==1&&e.auto_confirm===false)).toBe(true);
 expect(result.first.unknown).toBe(true);expect(result.options).toContain('Guarniciones');expect(result.row[result.head.indexOf('Categoria')]).toBe('Guarniciones');expect(result.row[result.head.indexOf('Dubbi / possibili da verificare')]).toBe('7');expect(result.last).toBe('Codici allergeni segnalati / confermati');expect(result.edited).toBe(2);
});
test('v2.6 explicit language wins, missing provenance never becomes declared, and imports scale',async({page})=>{
 await page.goto(route);
 const result=await page.evaluate<{lang:string[];p:string[];n:number;categories:number;all:boolean}>(`(()=>{
 const p=importRows([['Category','Dish','Ingredients','Language'],['A','Test','milk','es'],['B','Test','milk','mixed']]);
 const a=p.list.map(x=>make(x.name,x.ing,x));
 const big=importRows([['Categoría','Plato','Ingredientes'],...Array.from({length:195},(_,i)=>['Category '+i%16,'Test '+i,'huevo; Propuestos (no confirmados): leche'])]);
 const d=big.list.map(x=>make(x.name,x.ing,x));
 return {lang:a.map(x=>x.foodLang),p:a.map(x=>x.events[0].provenance),n:d.length,categories:new Set(d.map(x=>x.meta.category)).size,all:d.every(x=>x.s[2]===1&&x.s[6]===2&&x.s.every(v=>v<=2))};
 })()`);
 expect(result.lang).toEqual(['es','mixed']);expect(result.p).toEqual(['unspecified','unspecified']);expect(result.n).toBe(195);expect(result.categories).toBe(16);expect(result.all).toBe(true);
});

test('v2.7 regional pasta, origin labels, shared alternatives and extra interests',async({page})=>{
 await page.goto(route);
 const result=await page.evaluate<Record<string,{s:number[];events:Evidence[];extra:string}>>(`(()=>{
 const cases={fusilli:make('QA','fusilli',{foodLang:'it'}),paccheri:make('QA','paccheri',{foodLang:'it'}),linguine:make('QA','linguine',{foodLang:'it'}),dry:make('QA','fusilli di semola di grano duro',{foodLang:'it'}),dop:make('QA','mozzarella di bufala campana D.O.P.',{foodLang:'it'}),parma:make('QA','prosciutto di Parma DOP',{foodLang:'it'}),fish:make('QA','merluza o eglefino',{foodLang:'es'}),milk:make('QA','leche o agua',{foodLang:'es'}),mixed:make('QA','tonno o gamberi',{foodLang:'it'}),optional:make('QA','merluza o eglefino (opcional)',{foodLang:'es'}),pine:make('QA','pinoli',{foodLang:'it'}),savoiardi:make('QA','savoiardi',{foodLang:'it'}),gelatine:make('QA','gelatina suina',{foodLang:'it'})};
 return Object.fromEntries(Object.entries(cases).map(([k,d])=>[k,{s:d.s,events:d.events,extra:supplementalText(d)}]));
 })()`);
 for(const k of ['fusilli','paccheri','linguine'])expect(result[k].s[0]).toBe(2);
 expect(result.dry.s[0]).toBe(1);expect(result.dop.s[6]).toBe(1);
 expect(result.parma.events.some(e=>e.concept_id==='rlgi:parma_ham_dop')).toBe(true);
 expect(result.fish.s[3]).toBe(1);expect(result.milk.s[6]).toBe(2);expect(result.mixed.s[1]).toBe(2);expect(result.mixed.s[3]).toBe(2);expect(result.optional.s[3]).toBe(2);
 expect(result.pine.s[7]).toBe(0);expect(result.pine.extra).toContain('pinoli');expect(result.savoiardi.s[7]).toBe(0);expect(result.gelatine.s[3]).toBe(0);
 expect(Object.values(result).every(d=>d.s.every(v=>v<=2)&&d.events.every(e=>e.auto_confirm===false))).toBe(true);
});

test('v2.7.1 yeast phrases preserve real beer, starter and explicit ingredient evidence',async({page})=>{
 await page.goto(route);
 const results=await page.evaluate<Record<string,{s:number[];events:{concept_id:string;auto_confirm:boolean;allergen_code:number|null}[];flags:string[]}>>(`(()=>{
 const cases={it:['lievito di birra','it'],es:['levadura de cerveza','es'],en:["brewer's yeast",'en'],curly:["brewer’s yeast",'en'],fresh:['lievito di birra fresco','it'],real:['lievito di birra; birra','it'],realES:['levadura de cerveza; cerveza','es'],realEN:["brewer's yeast; beer",'en'],wheat:['farina di grano; lievito di birra; acqua; sale','it'],rice:['farina di riso; lievito di birra; acqua; sale','it'],starter:['lievito madre','it'],spent:["spent brewer's yeast",'en'],spentIT:['lievito di birra esausto','it'],chemical:['lievito chimico','it'],carrier:['lievito per dolci; farina di grano','it']};
 return Object.fromEntries(Object.entries(cases).map(([k,[ing,foodLang]])=>{const d=make('QA',ing,{foodLang});return [k,{s:d.s,events:d.events,flags:d.flags}]}));
 })()`);
 for(const k of ['it','es','en','curly','fresh','rice','chemical']){
  expect(results[k].s[0]).toBe(0);expect(results[k].s[11]).toBe(0);expect(results[k].flags.length).toBeGreaterThan(0);
 }
 for(const k of ['real','realES','realEN','spent','spentIT']){
  expect(results[k].s[0]).toBe(2);expect(results[k].s[11]).toBe(2);
 }
 expect(results.wheat.s[0]).toBe(1);expect(results.wheat.s[11]).toBe(0);
 expect(results.starter.s[0]).toBe(2);expect(results.carrier.s[0]).toBe(1);
 expect(Object.values(results).every(d=>d.s.every(v=>v<=2)&&d.events.every(e=>e.auto_confirm===false))).toBe(true);
});

test('2.8 GKB read-only multilingual decomposition, recursive variants and graph safeguards',async({page})=>{
 await page.goto(route);
 const q=await page.evaluate<{matches:(string|null)[];nested:boolean;unknown:boolean;cycle:boolean;missing:boolean;n:number;variantCount:number}>(`(()=>{
 const g=RLGKB;
 const matches=[['pane','it'],['bread','en'],['pan','es'],['pan','en'],['pan','mixed'],['salsa brava','es'],['peperoni','it'],['sin pan','es']].map(([s,l])=>g.find(s,l)?.id||null);
 const nested=g.leaves(g.expand('gkb:brava','mayo')).some(x=>x.it==='uova');
 const invalid={schema:'ristolab.gkb/1',concepts:[{id:'a',variants:[{id:'x',components:[{ref:'a',variant:'x'}]}]}]};
 let cycle=false,missing=false;try{g.expand('a','x',invalid)}catch(e){cycle=e.message==='cycle'}try{g.expand('missing','x')}catch(e){missing=e.message==='missing_reference'}
 return {matches,nested,unknown:!g.find('random','it'),cycle,missing,n:g.catalog.concepts.length,variantCount:g.catalog.concepts.reduce((n,c)=>n+c.variants.length,0)};
 })()`);
 expect(q.matches).toEqual(['gkb:bread','gkb:bread','gkb:bread',null,null,'gkb:brava',null,null]);expect(q.nested).toBe(true);expect(q.unknown).toBe(true);expect(q.cycle).toBe(true);expect(q.missing).toBe(true);expect(q.n).toBe(7);expect(q.variantCount).toBe(13);
 await page.evaluate(`load([{name:'QA',ing:'pan; salsa brava',foodLang:'es'}],'SIMULACION','',true)`);
 const before=await page.evaluate('JSON.stringify(dishes)');
 await page.locator('.gkb-preview > summary').click();
 await page.locator('[data-gkb-choice="gkb:bread"]').selectOption('wheat');
 await expect(page.locator('.gkb-item').first()).toContainText('farina di grano');
 await page.locator('[data-gkb-choice="gkb:brava"]').selectOption('mayo');
 await expect(page.locator('.gkb-item').last()).toContainText('uova');
 expect(await page.evaluate('JSON.stringify(dishes)')).toBe(before);
 await page.locator('[data-l="es"]').click();
 await page.locator('.gkb-preview > summary').click();
 await page.locator('[data-gkb-choice="gkb:brava"]').selectOption('tomato');
 await expect(page.locator('.gkb-item').last()).toContainText('harina');
 await expect(page.locator('.gkb-preview')).toContainText('la matriz no cambia');
 expect(await page.evaluate('JSON.stringify(dishes)')).toBe(before);
 await page.setViewportSize({width:390,height:844});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

test('closed-composition 36-recipe synthetic workbook benchmark: 504 cells',async({page})=>{
 await page.goto(route);
 const fixture=require('./fixtures/allergen-benchmark-27-synthetic.json') as {category:string;name:string;ingredients:string;expected:number[]}[];
 const payload=fixture.map(({category,name,ingredients})=>[category,name,ingredients]);
 const actual=await page.evaluate<{name:string;category:string;states:number[]}[]>(`(async()=>{
 const x=await sheets(),wb=x.utils.book_new();
 x.utils.book_append_sheet(wb,x.utils.aoa_to_sheet([['Categoria','Piatto','Ingredienti'],...${JSON.stringify(payload)}]),'SIMULAZIONE');
 const p=await parseFile(new File([x.write(wb,{bookType:'xlsx',type:'array'})],'BENCHMARK-SIMULAZIONE.xlsx'));
 load(p.list,'BENCHMARK-SIMULAZIONE.xlsx','',p.sample);
 return dishes.map(d=>({name:d.name,category:d.meta?.category,states:d.s}));
 })()`);
 expect(actual.length).toBe(36);
 let tp=0,fp=0,fn=0,tn=0;
 const discrepancies:string[]=[];
 for(let i=0;i<fixture.length;i++){
  const a=actual[i],f=fixture[i];expect(a.name).toBe(f.name);expect(a.category).toBe(f.category);
  expect(a.states.length).toBe(14);expect(a.states.every(v=>v<=2)).toBe(true);
  for(let j=0;j<14;j++){
   const expected=f.expected.includes(j+1),flag=a.states[j]===1||a.states[j]===2;
   if(expected&&flag)tp++;else if(expected&&!flag){fn++;discrepancies.push(f.name+' FN '+(j+1));}else if(!expected&&flag){fp++;discrepancies.push(f.name+' FP '+(j+1));}else tn++;
  }
 }
 expect({tp,fp,fn,tn,discrepancies}).toEqual({tp:55,fp:0,fn:0,tn:449,discrepancies:[]});
});

test('2.8 manual composition archive: explicit binding, additive doubts, session, stale revisions',async({page})=>{
 await page.goto(route);await page.locator('[data-l="it"]').click();
 await page.evaluate(`load([{name:'QA',ing:'pane; pomodoro',foodLang:'it'}],'SIMULAZIONE','',true)`);
 await page.locator('#manualArchivePanel > summary').click();
 await page.locator('#mgId').fill('pane-test');await page.locator('#mgName').fill('Pane test');await page.locator('#mgSource').fill('Scenario simulato');await page.locator('#mgParts').fill('farina di grano\nuova');
 await page.locator('#mgSave').click();await expect(page.locator('#mgStatus')).toContainText('Operazione completata');
 await page.locator('.manual-link details > summary').click();await page.locator('[data-mg-term]').selectOption('0');await page.locator('[data-mg-ref]').selectOption('pane-test@1');await page.locator('[data-mg-bind]').click();
 const a=await page.evaluate<{s:number[];path:string;issue:boolean}>(`({s:dishes[0].s,path:manualText(dishes[0]),issue:dishes[0].gkbIssue})`);
 expect(a.s[0]).toBe(2);expect(a.s[2]).toBe(2);expect(a.s.every(v=>v<=2)).toBe(true);expect(a.path).toContain('pane-test@1');expect(a.issue).toBe(false);
 const saved=await page.evaluate<string>(`JSON.stringify({format:'RISTO-LAB-session',version:1,dictionary:DICTIONARY.version,dishes,componentArchive:manualArchive,demo:true})`);
 await page.evaluate(`restoreSession(JSON.parse(${JSON.stringify(saved)}))`);
 expect(await page.evaluate('dishes[0].s[2]')).toBe(2);
 await page.locator('#manualArchivePanel > summary').click();await page.locator('#mgEdit').selectOption('pane-test@1');await page.locator('#mgParts').fill('farina di riso');await page.locator('#mgSave').click();
 expect(await page.evaluate('dishes[0].gkbIssue')).toBe(true);expect(await page.evaluate('dishes[0].s[2]')).toBe(2);expect(await page.evaluate('complete(dishes[0])')).toBe(false);
 expect(await page.evaluate('report().rows[0].slice(-2)[0]')).toContain('STALE_REVISION');
});

test('2.8 Recipe Manager adapter: selective recursive native archive, provenance and revisions',async({page})=>{
 await page.goto(route);await page.locator('[data-l="it"]').click();
 const data={"schema":"ristolab.recipe-archive/1","version":"1.0.0","purpose":"experimental_internal_only","recipes":[{"id":"bread-01","name":"Pane","category":"Preparazioni","foodLang":"it","servings":4,"source":"Ricetta simulata A","notes":"","method":"","ingredients":[{"name":"farina di grano","provenance":"declared"},{"name":"lievito di birra","provenance":"unknown"},{"name":"acqua","provenance":"declared"}],"subrecipes":[],"status":"draft"},{"id":"mayo-01","name":"Mayonesa","category":"Salsas","foodLang":"es","servings":4,"source":"Ricetta simulata B","notes":"","method":"","ingredients":[{"name":"huevo","provenance":"declared"},{"name":"mostaza","provenance":"proposed"}],"subrecipes":[],"status":"draft"},{"id":"brava-01","name":"Salsa brava","category":"Salsas","foodLang":"es","servings":4,"source":"Ricetta simulata C","notes":"","method":"","ingredients":[{"name":"tomate","provenance":"declared"}],"subrecipes":[{"id":"mayo-01","portions":1}],"status":"draft"},{"id":"unfinished","name":"Bozza","foodLang":"it","ingredients":[],"subrecipes":[]}]};
 await page.evaluate(`load([{name:'QA',ing:'salsa brava; patate',foodLang:'es'}],'SIMULAZIONE','',true)`);
 await page.locator('#rmImportPanel > summary').click();await page.locator('#rmFile').setInputFiles({name:'recipe-archive.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(data))});
 await expect(page.locator('#rmStatus')).toContainText('4');await page.locator('#rmScope').fill('qa');await page.locator('#rmRecipe').selectOption('brava-01');await page.locator('#rmApply').click();
 await expect(page.locator('#rmStatus')).toContainText('Nuove revisioni: 2');
 expect(await page.evaluate('manualArchive.components.length')).toBe(2);
 await page.locator('.manual-link details > summary').click();await page.locator('[data-mg-term]').selectOption('0');await page.locator('[data-mg-ref]').selectOption('rm:qa:brava-01@1');await page.locator('[data-mg-bind]').click();
 expect(await page.evaluate('dishes[0].s[2]')).toBe(2);expect(await page.evaluate('dishes[0].s[9]')).toBe(2);
 expect(await page.evaluate('manualText(dishes[0])')).toContain('rm:qa:mayo-01@1');expect(await page.evaluate('manualText(dishes[0])')).toContain('Recipe Manager: proposed');
 const result=await page.evaluate<{same:number;newCount:number;oldWarning:boolean;separate:number;bad:string[];only:boolean}>(`(()=>{
 const data=${JSON.stringify(data)},orig=manualArchive;
 const same=RLRecipeGKB.importSelected(orig,data,'qa',['brava-01'],'2026-11-27');
 const next=JSON.parse(JSON.stringify(data));next.recipes.find(x=>x.id==='mayo-01').ingredients[1].name='ajo';
 const changed=RLRecipeGKB.importSelected(orig,next,'qa',['brava-01'],'2026-11-27');
 const other=RLRecipeGKB.importSelected(orig,data,'other',['brava-01'],'2026-11-27');
 const bad=[];for(const mode of ['missing','cycle','empty']){const d=JSON.parse(JSON.stringify(data));if(mode==='missing')d.recipes[2].subrecipes[0].id='absent';if(mode==='cycle')d.recipes[1].subrecipes=[{id:'brava-01',portions:1}];try{RLRecipeGKB.importSelected(orig,d,'qa',[mode==='empty'?'unfinished':'brava-01'],'2026-11-27')}catch(e){bad.push(e.message)}}
 return {same:same.created,newCount:changed.created,oldWarning:RLManualGKB.resolve(changed.archive,{id:'rm:qa:brava-01',revision:1}).warnings.length>0,separate:other.created,bad,only:orig.components.every(c=>c.id.includes('brava')||c.id.includes('mayo'))};
 })()`);
 expect(result).toEqual({same:0,newCount:2,oldWarning:true,separate:2,bad:['MISSING_SUBRECIPE','CYCLE','INCOMPLETE_RECIPE'],only:true});
 expect(await page.evaluate('dishes[0].s.every(v=>v<=2)')).toBe(true);
});

test('3.1 Local Data Hub: Recipe Manager persistence, stable IDs, explicit Matrix import and CAS',async({page,context})=>{
 await page.goto(root+'/instructor/recipe-manager/');
 await page.locator('#sample').click();
 const first=await page.evaluate<{id:string}[]>(`snapshot().recipes[0].ingredients.map(i=>({id:i.id}))`);
 expect(new Set(first.map(i=>i.id)).size).toBe(3);
 await page.locator('#hubPanel > summary').click();await page.locator('#hubSave').click();
 await expect(page.locator('#hubStatus')).toContainText('Revisione condivisa: 1');
 const other=await context.newPage();await other.goto(root+'/instructor/recipe-manager/');
 await other.locator('#hubPanel > summary').click();await other.locator('#hubLoad').click();
 await expect(other.locator('#hubStatus')).toContainText('revisione: 1');
 expect(await other.evaluate(`snapshot().recipes[0].ingredients.map(i=>({id:i.id}))`)).toEqual(first);
 await page.evaluate(`recipes[0].ingredients[0].name='farina di grano'`);
 await page.locator('#hubSave').click();await expect(page.locator('#hubStatus')).toContainText('Revisione condivisa: 2');
 await other.locator('#hubSave').click();await expect(other.locator('#hubStatus')).toContainText('Archivio aggiornato altrove');
 const h=await page.evaluate<{revision:number;name:string}[]>(`RLDataHub.history('recipes').then(a=>a.map(r=>({revision:r.revision,name:r.data.recipes[0].ingredients[0].name})))`);
 expect(h).toEqual([{revision:1,name:'spaghetti'},{revision:2,name:'farina di grano'}]);
 await page.reload();await page.locator('#hubPanel > summary').click();await page.locator('#hubLoad').click();
 expect(await page.evaluate(`snapshot().recipes[0].ingredients.map(i=>({id:i.id}))`)).toEqual(first);
 await other.goto(route);await other.locator('[data-l="it"]').click();
 await other.evaluate(`load([{name:'QA',ing:'pasta; pomodoro',foodLang:'it'}],'SIMULAZIONE','',true)`);
 await other.locator('#rmImportPanel > summary').click();await other.locator('#rmHubRead').click();await expect(other.locator('#rmStatus')).toContainText('Data Hub rev. 2');
 await expect(other.locator('#rmScope')).toHaveValue('hub-local');await other.locator('#rmRecipe').selectOption('DEMO-001');await other.locator('#rmApply').click();await expect(other.locator('#rmStatus')).toContainText('Nuove revisioni: 1');
 await other.locator('.manual-link details > summary').click();await other.locator('[data-mg-term]').selectOption('0');await other.locator('[data-mg-ref]').selectOption('rm:hub-local:DEMO-001@1');await other.locator('[data-mg-bind]').click();
 expect(await other.evaluate('dishes[0].gkbIssue')).toBe(true);
 expect(await other.evaluate('complete(dishes[0])')).toBe(false);
 expect(await other.evaluate('manualText(dishes[0])')).toContain('DATA_HUB_PILOT_REVIEW_REQUIRED');
 await other.close();
});
