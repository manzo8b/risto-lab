/* Recipe Manager native archive → explicit, conservative GKB composition import. */
(function(root){
'use strict';
const SCHEMA='ristolab.recipe-archive/1',fail=c=>{throw Error(c);};
const validId=s=>typeof s==='string'&&/^[A-Za-z0-9][A-Za-z0-9_.:-]{0,49}$/.test(s);
const validScope=s=>typeof s==='string'&&/^[A-Za-z0-9][A-Za-z0-9_.-]{0,19}$/.test(s);
const text=(x,max)=>typeof x==='string'&&x.length<=max;
const langs=['it','es','en','mixed'],provs=['declared','proposed','unknown'];
function read(input){
 if(!input||input.schema!==SCHEMA||input.version!=='1.0.0'||input.purpose!=='experimental_internal_only'||!Array.isArray(input.recipes)||!input.recipes.length||input.recipes.length>5000)fail('INVALID_RECIPE_ARCHIVE');
 const ids=new Set();
 return input.recipes.map(r=>{
 if(!r||!validId(r.id)||ids.has(r.id)||!text(r.name,500)||!Array.isArray(r.ingredients)||r.ingredients.length>1000||!Array.isArray(r.subrecipes)||r.subrecipes.length>500||!langs.includes(r.foodLang))fail('INVALID_RECIPE');
 ids.add(r.id);
 for(const x of r.ingredients){if(!x||!text(x.name,500)||!provs.includes(x.provenance)||(x.id!==undefined&&!validId(x.id)))fail('INVALID_INGREDIENT');}
 for(const x of r.subrecipes){if(!x||!validId(x.id)||!(x.portions===null||x.portions===undefined||(typeof x.portions==='number'&&Number.isFinite(x.portions)&&x.portions>0)))fail('INVALID_SUBRECIPE');}
 for(const k of ['source','notes','category','method'])if(r[k]!==undefined&&!text(r[k],20000))fail('INVALID_RECIPE_METADATA');
 const snapshot=JSON.stringify({name:r.name,category:r.category||'',foodLang:r.foodLang,servings:r.servings??null,source:r.source||'',notes:r.notes||'',method:r.method||'',ingredients:r.ingredients.map(x=>({...(x.id?{id:x.id}:{}),name:x.name,provenance:x.provenance,gross:x.gross??null,unit:x.unit??'',waste:x.waste??null,net:x.net??null,notes:x.notes??''})),subrecipes:r.subrecipes.map(x=>({id:x.id,portions:x.portions??null}))});
 if(snapshot.length>200000)fail('RECIPE_SIZE');
 return {id:r.id,name:r.name,foodLang:r.foodLang,source:r.source||'',category:r.category||'',ingredients:r.ingredients.map(x=>({name:x.name,provenance:x.provenance})),subrecipes:r.subrecipes.map(x=>({id:x.id})),snapshot};
 });
}
function importSelected(archive,input,scope,selected,updatedOn){
 if(!validScope(scope)||!Array.isArray(selected)||!selected.length||selected.length>500||new Set(selected).size!==selected.length||!selected.every(validId))fail('SELECT_RECIPE_AND_SCOPE');
 const recipes=read(input),map=new Map(recipes.map(r=>[r.id,r])),base=RLManualGKB.validate(archive),components=base.components.slice(),latest=new Map(),resolved=new Map();let visited=0,created=0,unchanged=0;
 for(const c of components)if(!latest.has(c.id)||latest.get(c.id).revision<c.revision)latest.set(c.id,c);
 function visit(id,path,depth){
 if(depth>12||++visited>10000)fail('GRAPH_LIMIT');
 if(path.includes(id))fail('CYCLE');
 if(resolved.has(id))return resolved.get(id);
 const r=map.get(id);if(!r)fail('MISSING_SUBRECIPE');
 if(!r.name.trim()||r.ingredients.some(x=>!x.name.trim())||!r.ingredients.length&&!r.subrecipes.length)fail('INCOMPLETE_RECIPE');
 const parts=r.ingredients.map(x=>({kind:'ingredient',name:x.name.trim(),language:r.foodLang,provenance:x.provenance==='declared'?'manual':'hypothesis',recipeProvenance:x.provenance}));
 for(const sub of r.subrecipes){const c=visit(sub.id,[...path,id],depth+1);parts.push({kind:'reference',id:c.id,revision:c.revision});}
 const cid='rm:'+scope+':'+id,old=latest.get(cid),origin={schema:SCHEMA,scope,recipeId:id,snapshot:r.snapshot};
 if(old&&(!old.recipeOrigin||old.recipeOrigin.scope!==scope||old.recipeOrigin.recipeId!==id))fail('IDENTITY_CONFLICT');
 const draft={id:cid,name:r.name.trim(),language:r.foodLang,updatedOn,provenance:'manual',source:'Recipe Manager ['+scope+'/'+id+']'+(r.source.trim()?' · '+r.source.trim().slice(0,800):' · source not supplied; verify'),parts,recipeOrigin:origin};
 let ref;
 if(old&&old.recipeOrigin.snapshot===origin.snapshot&&JSON.stringify(old.parts)===JSON.stringify(parts)){ref={id:cid,revision:old.revision};unchanged++;}
 else {const revision=(old?.revision||0)+1,c={...draft,revision};components.push(c);latest.set(cid,c);ref={id:cid,revision};created++;}
 resolved.set(id,ref);return ref;
 }
 const roots=selected.map(id=>visit(id,[],0));
 return {archive:RLManualGKB.validate({...base,components}),roots,created,unchanged,reviewRequired:true,autoConfirm:false};
}
root.RLRecipeGKB=Object.freeze({read,importSelected});
})(globalThis);
