/* Sprint 4: recorded supplier data, not verified documentary evidence. */
(function(root){
'use strict';
const fail=c=>{throw Error(c);},validId=s=>typeof s==='string'&&/^[A-Za-z0-9][A-Za-z0-9_.:-]{0,49}$/.test(s),validScope=s=>typeof s==='string'&&/^[A-Za-z0-9][A-Za-z0-9_.-]{0,19}$/.test(s),langs=['it','es','en','mixed'];
function text(x,max=1000){if(x===undefined||x===null)return '';if(typeof x!=='string'||x.length>max)fail('INVALID_PRODUCT_TEXT');return x.trim();}
function codes(x){if(!Array.isArray(x)||x.some(n=>!Number.isInteger(n)||n<1||n>14))fail('INVALID_ALLERGEN_CODES');return [...new Set(x)].sort((a,b)=>a-b);}
function cleanProduct(p){
 if(!p||!validId(p.id))fail('INVALID_PRODUCT_ID');
 return {id:p.id,name:text(p.name,500),supplier:text(p.supplier,500),sku:text(p.sku,200),doc:text(p.doc,1000),docdate:text(p.docdate,50),composition:text(p.composition,20000),review:text(p.review,500),notes:text(p.notes,4000),presence:codes(p.presence),trace:codes(p.trace)};
}
function read(input){
 if(!input||!['ristolab.supplier-links/1','ristolab.supplier-session/1'].includes(input.schema)||input.version!=='1.0.0'||input.purpose!=='experimental_internal_only'||!Array.isArray(input.products)||input.products.length>5000||!Array.isArray(input.links)||input.links.length>20000)fail('INVALID_SUPPLIER_ARCHIVE');
 const ids=new Set(),products=input.products.map(p=>{const c=cleanProduct(p);if(ids.has(c.id))fail('DUPLICATE_PRODUCT');ids.add(c.id);return c;});
 const links=input.links.map(l=>{if(!l||!validId(l.recipeId)||!ids.has(l.productId)||!Number.isInteger(l.index)||l.index<0||typeof l.ingredientName!=='string'||l.ingredientName.length>500||(l.ingredientId!==undefined&&!validId(l.ingredientId)))fail('INVALID_PRODUCT_LINK');return {recipeId:l.recipeId,index:l.index,ingredientName:l.ingredientName,productId:l.productId,...(l.ingredientId?{ingredientId:l.ingredientId}:{})};});
 return {products,links};
}
function ready(p){
 return !!(p.name&&p.supplier&&p.sku&&p.doc&&p.docdate&&/^\d{4}-\d{2}-\d{2}$/.test(p.docdate)&&Number.isFinite(Date.parse(p.docdate+'T00:00:00Z'))&&new Date(p.docdate+'T00:00:00Z').toISOString().slice(0,10)===p.docdate&&p.review&&p.composition);
}
function importSelected(archive,input,scope,productId,language,updatedOn){
 if(!validScope(scope)||!validId(productId)||!langs.includes(language))fail('SELECT_PRODUCT_AND_SCOPE');
 const {products}=read(input),p=products.find(x=>x.id===productId);if(!p)fail('PRODUCT_MISSING');if(!ready(p))fail('INCOMPLETE_DOCUMENT_RECORD');
 const id='sm:'+scope+':'+p.id,base=RLManualGKB.validate(archive),revision=RLManualGKB.latestRevision(base,id),old=base.components.find(c=>c.id===id&&c.revision===revision);
 if(old&&(!old.supplierOrigin||old.supplierOrigin.scope!==scope||old.supplierOrigin.productId!==p.id))fail('IDENTITY_CONFLICT');
 const origin={schema:'ristolab.supplier-product/1',scope,productId:p.id,product:p};
 // Keep full composition in the snapshot; reject long individual segments instead of truncating or guessing.
 const parts=p.composition.split(/[;\r\n]/).map(s=>s.trim()).filter(Boolean).map(name=>({kind:'ingredient',name,language,provenance:'manual'}));
 if(!parts.length||parts.some(x=>x.name.length>500))fail('COMPOSITION_SEGMENT_LIMIT');
 if(old&&JSON.stringify(old.supplierOrigin)===JSON.stringify(origin)&&old.language===language&&JSON.stringify(old.parts)===JSON.stringify(parts))return {archive:base,ref:{id,revision},created:false};
 const next=RLManualGKB.save(base,{id,name:p.name,language,updatedOn,provenance:'manual',source:('Supplier Manager ['+scope+'/'+p.id+'] · '+p.supplier+' · SKU '+p.sku+' · '+p.doc+' · '+p.docdate).slice(0,1000),parts,supplierOrigin:origin},revision);
 return {archive:next,ref:{id,revision:revision+1},created:true};
}
function cleanOrigin(o,id){
 if(!o||o.schema!=='ristolab.supplier-product/1'||!validScope(o.scope)||!validId(o.productId)||id!=='sm:'+o.scope+':'+o.productId)fail('INVALID_SUPPLIER_ORIGIN');
 const p=cleanProduct(o.product);if(p.id!==o.productId||!ready(p))fail('INVALID_SUPPLIER_ORIGIN');return {schema:o.schema,scope:o.scope,productId:o.productId,product:p};
}
function inspect(documents,record){
 let latest=null,error=null;
 try{if(!record||record.kind!=='suppliers'||record.scope!=='local'||record.schema!=='ristolab.data-hub/1')throw Error('SUPPLIER_HUB_UNAVAILABLE');latest=new Map(read(record.data).products.map(p=>[p.id,p]));}catch(e){error=e.message;}
 return documents.filter(d=>d.origin.scope==='hub-local').flatMap(d=>{const p=latest?.get(d.origin.productId);const code=error||(!p?'PRODUCT_MISSING':!ready(p)?'DOCUMENT_INCOMPLETE':JSON.stringify(p)!==JSON.stringify(d.origin.product)?'PRODUCT_CHANGED':null);return code?[{id:d.id,revision:d.revision,code}]:[];});
}
root.RLSupplierGKB=Object.freeze({read,ready,importSelected,cleanOrigin,inspect});
})(globalThis);
