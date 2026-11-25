// Public menu projection: explicit allowlist, never expose internal costs.
export function publicMenu(input,lang='it'){
 if(!['it','es','en'].includes(lang)||!Array.isArray(input?.items))throw Error('invalid_menu');
 const ids=new Set;
 const items=input.items.filter(x=>x.approved===true).map(x=>{
 if(typeof x.id!=='string'||!x.id||ids.has(x.id)||typeof x.name?.[lang]!=='string'||!x.name[lang].trim()||typeof x.category?.[lang]!=='string'||!x.category[lang].trim()||!Number.isFinite(x.grossPrice)||x.grossPrice<0)throw Error('invalid_item');
 ids.add(x.id);
 const verified=x.allergenReview?.status==='validated'&&typeof x.allergenReview.reference==='string'&&x.allergenReview.reference.trim()&&Array.isArray(x.allergenReview.codes)&&x.allergenReview.codes.every(n=>Number.isInteger(n)&&n>=1&&n<=14);
 return {id:x.id,name:x.name[lang],category:x.category[lang],description:typeof x.description?.[lang]==='string'?x.description[lang]:'',grossPrice:x.grossPrice,allergens:verified?[...new Set(x.allergenReview.codes)].sort((a,b)=>a-b):null};
 });
 return {schema:'ristolab.menu-publication/1',language:lang,currency:'EUR',items,readyForReview:items.length>0&&items.every(x=>x.allergens!==null)};
}
