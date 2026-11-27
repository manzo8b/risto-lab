/* RISTO-LAB 2.8: versioned manual composition archive, experimental only. */
(function(root){
'use strict';
const SCHEMA='ristolab.component-archive/1',MAX_COMPONENTS=5000,MAX_NODES=500,MAX_DEPTH=12;
const clone=x=>JSON.parse(JSON.stringify(x));
const fail=code=>{throw new Error(code);};
const id=s=>typeof s==='string'&&/^[A-Za-z0-9][A-Za-z0-9_.:-]{0,79}$/.test(s);
const txt=(s,max=500)=>typeof s==='string'&&s.trim().length>0&&s.length<=max;
const date=s=>typeof s==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s)&&Number.isFinite(Date.parse(s+'T00:00:00Z'))&&new Date(s+'T00:00:00Z').toISOString().slice(0,10)===s;
const key=(i,r)=>i+'@'+r;
const validRef=r=>r&&id(r.id)&&Number.isSafeInteger(r.revision)&&r.revision>=1;
function cleanPart(p){
 if(!p||typeof p!=='object')fail('INVALID_PART');
 if(p.kind==='reference'){if(!validRef(p))fail('INVALID_REFERENCE');return {kind:'reference',id:p.id,revision:p.revision};}
 if(p.kind!=='ingredient'||!txt(p.name)||!['it','es','en','mixed'].includes(p.language)||!['manual','hypothesis'].includes(p.provenance))fail('INVALID_INGREDIENT');
 const out={kind:'ingredient',name:p.name.trim(),language:p.language,provenance:p.provenance};if(p.recipeProvenance!==undefined){if(!['declared','proposed','unknown'].includes(p.recipeProvenance))fail('INVALID_RECIPE_PROVENANCE');out.recipeProvenance=p.recipeProvenance;if(p.recipeProvenance!=='declared'&&p.provenance!=='hypothesis')fail('INVALID_RECIPE_PROVENANCE');}return out;
}
function validate(a){
 if(!a||a.schema!==SCHEMA||a.purpose!=='experimental_internal_only'||!Array.isArray(a.components)||a.components.length>MAX_COMPONENTS)fail('INVALID_ARCHIVE');
 const map=new Map(),latest=new Map();
 const components=a.components.map(c=>{
 if(!validRef(c)||!txt(c.name)||!['it','es','en','mixed'].includes(c.language)||!date(c.updatedOn)||!['manual','hypothesis'].includes(c.provenance)||!Array.isArray(c.parts)||!c.parts.length||c.parts.length>MAX_NODES||!txt(c.source,1000))fail('INVALID_COMPONENT');
 const k=key(c.id,c.revision);if(map.has(k))fail('DUPLICATE_REVISION');
 const clean={id:c.id,revision:c.revision,name:c.name.trim(),language:c.language,updatedOn:c.updatedOn,provenance:c.provenance,source:c.source.trim(),parts:c.parts.map(cleanPart)};
 if(c.recipeOrigin!==undefined){const o=c.recipeOrigin;if(!o||o.schema!=='ristolab.recipe-archive/1'||!txt(o.scope,20)||!txt(o.recipeId,50)||typeof o.snapshot!=='string'||o.snapshot.length>200000||c.id!=='rm:'+o.scope+':'+o.recipeId)fail('INVALID_RECIPE_ORIGIN');clean.recipeOrigin={schema:o.schema,scope:o.scope,recipeId:o.recipeId,snapshot:o.snapshot};}if(c.supplierOrigin!==undefined){clean.supplierOrigin=RLSupplierGKB.cleanOrigin(c.supplierOrigin,c.id);if(c.recipeOrigin!==undefined)fail('CONFLICTING_ORIGIN');const expected=clean.supplierOrigin.product.composition.split(/[;\r\n]/).map(s=>s.trim()).filter(Boolean);if(JSON.stringify(expected)!==JSON.stringify(clean.parts.map(p=>p.kind==='ingredient'?p.name:null))||clean.parts.some(p=>p.language!==clean.language||p.provenance!=='manual'))fail('SUPPLIER_COMPOSITION_MISMATCH');}else if(c.id.startsWith('sm:'))fail('INVALID_SUPPLIER_ORIGIN');map.set(k,clean);latest.set(c.id,Math.max(latest.get(c.id)||0,c.revision));return clean;
 });
 for(const c of components){if(c.revision>1&&!map.has(key(c.id,c.revision-1)))fail('REVISION_GAP');for(const p of c.parts)if(p.kind==='reference'&&!map.has(key(p.id,p.revision)))fail('MISSING_REFERENCE');}
 function check(c,path,depth,budget){if(depth>MAX_DEPTH||++budget.n>MAX_NODES)fail('GRAPH_LIMIT');const k=key(c.id,c.revision);if(path.has(k))fail('CYCLE');const next=new Set(path);next.add(k);for(const p of c.parts){if(p.kind==='reference')check(map.get(key(p.id,p.revision)),next,depth+1,budget);else if(++budget.n>MAX_NODES)fail('GRAPH_LIMIT');}}
 for(const c of components)check(c,new Set(),0,{n:0});
 return {schema:SCHEMA,purpose:'experimental_internal_only',components};
}
function empty(){return {schema:SCHEMA,purpose:'experimental_internal_only',components:[]};}
function latestRevision(a,i){return validate(a).components.filter(c=>c.id===i).reduce((n,c)=>Math.max(n,c.revision),0);}
function save(a,draft,expectedRevision){const clean=validate(a);if(!draft||!id(draft.id)||!Number.isSafeInteger(expectedRevision)||expectedRevision<0)fail('INVALID_WRITE');const current=clean.components.filter(c=>c.id===draft.id).reduce((n,c)=>Math.max(n,c.revision),0);if(current!==expectedRevision)fail('STALE_WRITE');return validate({...clean,components:[...clean.components,{...draft,revision:current+1}]});}
function resolve(a,ref){
 const clean=validate(a);if(!validRef(ref))fail('INVALID_REFERENCE');const map=new Map(clean.components.map(c=>[key(c.id,c.revision),c])),latest=new Map();for(const c of clean.components)latest.set(c.id,Math.max(latest.get(c.id)||0,c.revision));const leaves=[],warnings=[],documents=[];const first=map.get(key(ref.id,ref.revision));if(!first)fail('MISSING_REFERENCE');
 function walk(c,path,provenance){const p=[...path,{id:c.id,revision:c.revision,name:c.name,source:c.source,updatedOn:c.updatedOn,provenance:c.provenance}],effective=provenance==='hypothesis'||c.provenance==='hypothesis'?'hypothesis':'manual';if(c.supplierOrigin)documents.push({id:c.id,revision:c.revision,origin:clone(c.supplierOrigin),path:clone(p)});if(latest.get(c.id)!==c.revision)warnings.push({code:'STALE_REVISION',id:c.id,revision:c.revision,latest:latest.get(c.id),path:p.map(x=>key(x.id,x.revision))});for(const item of c.parts){if(item.kind==='reference')walk(map.get(key(item.id,item.revision)),p,effective);else leaves.push({name:item.name,language:item.language,provenance:effective==='hypothesis'||item.provenance==='hypothesis'?'hypothesis':'manual',...(item.recipeProvenance?{recipeProvenance:item.recipeProvenance}:{}),path:clone(p)});}}
 walk(first,[],'manual');return {ref:clone(ref),leaves,warnings,documents,reviewRequired:true,autoConfirm:false};
}
function recipeSnapshot(recipe){if(!recipe||!id(recipe.id)||!Number.isSafeInteger(recipe.revision)||recipe.revision<1||!Array.isArray(recipe.ingredients)||!recipe.ingredients.length||recipe.ingredients.length>1000)fail('INVALID_RECIPE');const ids=new Set();const ingredients=recipe.ingredients.map(i=>{if(!i||!id(i.id)||ids.has(i.id)||!txt(i.name))fail('INVALID_RECIPE_INGREDIENT');ids.add(i.id);return {id:i.id,name:i.name};});return JSON.stringify(ingredients);}
function bind(recipe,ingredientId,ref,a){const snapshot=recipeSnapshot(recipe),item=recipe.ingredients.find(i=>i.id===ingredientId);if(!item)fail('MISSING_INGREDIENT');resolve(a,ref);return {recipeId:recipe.id,recipeRevision:recipe.revision,ingredientId:item.id,ingredientName:item.name,ingredientSnapshot:snapshot,component:clone(ref)};}
function previewBinding(a,recipe,binding,analyze){const snapshot=recipeSnapshot(recipe);if(!binding||recipe.id!==binding.recipeId||recipe.revision!==binding.recipeRevision||snapshot!==binding.ingredientSnapshot||recipe.ingredients.find(i=>i.id===binding.ingredientId)?.name!==binding.ingredientName)fail('STALE_BINDING');if(typeof analyze!=='function')fail('ANALYZER_REQUIRED');const result=resolve(a,binding.component),evidence=[];for(const leaf of result.leaves){const states=analyze(leaf.name,leaf.language);if(!Array.isArray(states)||states.length!==14||states.some(s=>!Number.isInteger(s)||s<0||s>2))fail('INVALID_ANALYZER_RESULT');states.forEach((s,i)=>{if(s===1||s===2)evidence.push({code:i+1,state:2,origin:'component_preview',provenance:leaf.provenance,ingredient:leaf.name,language:leaf.language,...(leaf.recipeProvenance?{recipeProvenance:leaf.recipeProvenance}:{}),path:clone(leaf.path),autoConfirm:false});});}for(const doc of result.documents){for(const code of doc.origin.product.presence)evidence.push({code,state:2,origin:'supplier_recorded_presence',provenance:'supplier_record_unverified',ingredient:doc.origin.product.name,language:'mixed',path:clone(doc.path),autoConfirm:false});}return {...result,evidence,possibleCodes:[...new Set(evidence.map(e=>e.code))].sort((a,b)=>a-b),absenceInferred:false,reviewRequired:true};}
root.RLManualGKB=Object.freeze({SCHEMA,empty,validate,save,latestRevision,resolve,bind,previewBinding});
})(globalThis);
