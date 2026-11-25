export const languages=['it','es','en','fr','de','pt','nl','ro','ar','zh','ja','ru'];
export function configureLanguages(local,extra=[],mode='combined'){
 if(!languages.includes(local)||!Array.isArray(extra)||extra.length>2||extra.some(x=>!languages.includes(x))||new Set([local,...extra]).size!==extra.length+1||!['combined','separate','digital'].includes(mode))throw Error('invalid_language_configuration');
 return {local,extra:[...extra],mode,directions:Object.fromEntries([local,...extra].map(x=>[x,x==='ar'?'rtl':'ltr']))};
}
export function translationIssues(items,config){
 return items.filter(x=>x.approved===true).flatMap(x=>[config.local,...config.extra].flatMap(lang=>{
 const issues=[];for(const field of ['name','category','description'])if(typeof x[field]?.[lang]!=='string'||!x[field][lang].trim())issues.push({id:x.id,lang,field,code:'missing_translation'});
 if(x.translationReview?.[lang]?.status!=='validated'||typeof x.translationReview[lang].reference!=='string'||!x.translationReview[lang].reference.trim())issues.push({id:x.id,lang,code:'review_required'});
 return issues;
 }));
}
