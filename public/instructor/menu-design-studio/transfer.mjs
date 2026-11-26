// Explicit local transfers. No name matching or automatic documentary approval.
const langs=['it','es','en','fr','de','pt','nl','ro','ar','zh','ja','ru'];
const str=x=>typeof x==='string'?x.trim():'';
const price=x=>typeof x==='number'&&Number.isFinite(x)&&x>=0;
export function importTransfer(current,source,lang){
 if(!langs.includes(lang))throw Error('invalid_language');
 const next=structuredClone(current??{items:[]});
 if(!Array.isArray(next.items)||next.items.length>1000)throw Error('invalid_menu');
 const ids=new Map();
 for(const item of next.items){if(!str(item.id)||ids.has(item.id))throw Error('duplicate_or_invalid_id');ids.set(item.id,item)}
 let count=0;
 function addRecipes(recipes){
 if(!Array.isArray(recipes)||recipes.length>1000)throw Error('invalid_archive');
 const seen=new Set();
 for(const r of recipes){
 if(!str(r?.id)||seen.has(r.id)||!str(r.name))throw Error('invalid_recipe');
 seen.add(r.id);
 if(ids.has(r.id))continue;
 const l=langs.includes(r.foodLang)?r.foodLang:lang;
 const item={id:r.id,approved:false,name:{[l]:r.name},category:{[l]:str(r.category)},description:{[l]:''},grossPrice:null,allergenReview:{status:'pending'},translationReview:{},provenance:{recipe:{schema:'ristolab.recipe-archive/1',id:r.id,languageConfirmed:langs.includes(r.foodLang)}}};
 next.items.push(item);ids.set(r.id,item);count++;
 }
 }
 if(source?.schema==='ristolab.recipe-archive/1')addRecipes(source.recipes);
 else if(source?.schema==='ristolab.cost-run/1'){
 const id=source.recipeId,p=source.inputs?.options?.grossPrice;
 if(!str(id)||!price(p))throw Error('missing_gross_price');
 const item=ids.get(id);if(!item)throw Error('import_recipe_first');
 const archived=source.inputs?.archive?.recipes?.find(r=>r.id===id);
 if(!archived||!Object.values(item.name??{}).includes(archived.name))throw Error('recipe_identity_mismatch');
 item.grossPrice=p;item.approved=false;item.provenance={...item.provenance,price:{schema:source.schema,recipeId:id,asOf:str(source.asOf)}};count++;
 }else throw Error('unsupported_transfer');
 if(next.items.length>1000)throw Error('too_many_items');
 return {menu:next,count};
}
