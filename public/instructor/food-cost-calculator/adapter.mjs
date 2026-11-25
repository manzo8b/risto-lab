import {recipeCost,metrics} from './core.mjs';
const dateOK=s=>typeof s==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s)&&Number.isFinite(Date.parse(s))&&new Date(s).toISOString().slice(0,10)===s;
const key=(id,i)=>JSON.stringify([id,i]);
export function integrate(archive,supplier){
 if(archive?.schema!=='ristolab.recipe-archive/1'||supplier?.schema!=='ristolab.supplier-links/1'||supplier.currency!=='EUR'||supplier.priceBasis!=='net_excluding_vat'||![archive.recipes,supplier.products,supplier.links].every(Array.isArray))throw Error('invalid_schema');
 const recipes=structuredClone(archive.recipes),products=structuredClone(supplier.products),links=structuredClone(supplier.links);
 const unique=(rows)=>{const m=new Map;for(const r of rows){if(typeof r?.id!=='string'||!r.id||m.has(r.id))throw Error('invalid_id');m.set(r.id,r)}return m};
 const rm=unique(recipes),pm=unique(products),lm=new Map;
 for(const r of recipes)if(!Array.isArray(r.ingredients)||!Array.isArray(r.subrecipes))throw Error('invalid_recipe');
 for(const l of links){const r=rm.get(l.recipeId),k=key(l.recipeId,l.index);if(!Number.isInteger(l.index)||r?.ingredients[l.index]?.name!==l.ingredientName||!pm.has(l.productId)||lm.has(k))throw Error('invalid_link');lm.set(k,l.productId)}
 return {recipes,products,links,resolve:(r,i)=>pm.get(lm.get(key(r.id,i)))};
}
export function runCost(archive,supplier,id,options={}){
 const {asOf,maxAgeDays=30,history=[],grossPrice,vat,target,labor,overhead}=options;
 if(!dateOK(asOf)||!Number.isInteger(maxAgeDays)||maxAgeDays<0||!Array.isArray(history))throw Error('invalid_date_policy');
 const data=integrate(archive,supplier),used=[],excluded=[];
 const recipe=data.recipes.find(r=>r.id===id);if(!recipe)throw Error('unknown_recipe');
 const result=recipeCost(id,data.recipes,(r,i)=>{
 const p=data.resolve(r,i);if(!p){excluded.push({recipeId:r.id,index:i,reason:'unlinked'});return null}
 const candidates=[{...p,status:'unverified'},...history.filter(h=>h.productId===p.id)].filter(h=>dateOK(h.date)&&h.date<=asOf).sort((a,b)=>b.date.localeCompare(a.date));
 const h=candidates[0];if(!h||candidates.filter(x=>x.date===h.date).length>1||Date.parse(asOf)-Date.parse(h.date)>maxAgeDays*86400000){excluded.push({recipeId:r.id,index:i,reason:'missing_stale_or_ambiguous_price'});return null}
 if(!['observed','benchmark','simulated','unverified'].includes(h.status))throw Error('invalid_source_status');
 used.push({recipeId:r.id,index:i,productId:p.id,snapshot:structuredClone(h)});return h;
 });
 return {schema:'ristolab.cost-run/1',version:'0.1.0',asOf,maxAgeDays,recipeId:id,inputs:{archive:structuredClone(archive),supplier:structuredClone(supplier),options:structuredClone(options)},used,excluded,result,metrics:metrics({cost:result.cost,portions:recipe.servings,grossPrice,vat,target,labor,overhead}),sourceStatus:[...new Set(used.map(x=>x.snapshot.status))]};
}
