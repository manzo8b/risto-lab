/* Sprint 3.2: inspect pinned GKB dependency graph against current Data Hub recipe snapshots.
 * Read-only; no silent updates, no automatic confirmation. */
(function(root){
'use strict';
const prefix='rm:hub-local:',key=r=>r.id+'@'+r.revision;
function index(archive){return new Map(RLManualGKB.validate(archive).components.map(c=>[key(c),c]));}
function collect(map,ref){
 const found=new Map(),seen=new Set();let visits=0;
 function walk(r,depth){if(depth>12||++visits>500)throw Error('GRAPH_LIMIT');const k=key(r);if(seen.has(k))return;seen.add(k);const c=map.get(k);if(!c)throw Error('MISSING_REFERENCE');if(c.id.startsWith(prefix))found.set(k,c);for(const p of c.parts)if(p.kind==='reference')walk(p,depth+1);}
 walk(ref,0);return [...found.values()];
}
function inspect(archive,refs,record){
 const map=index(archive),results=Object.create(null);let current=null,sourceError=null;
 try{if(!record)throw Error('HUB_MISSING');if(record.schema!=='ristolab.data-hub/1'||record.kind!=='recipes'||record.scope!=='local'||!Number.isSafeInteger(record.revision)||record.revision<1)throw Error('HUB_INVALID');current=new Map(RLRecipeGKB.read(record.data).map(r=>[r.id,r]));}catch(e){sourceError=e.message;}
 for(const ref of refs){
  const k=key(ref);if(results[k])continue;
  const changes=[];let dependencies=[];
  try{dependencies=collect(map,ref);}catch(e){results[k]={status:'unresolved',dependencies:[],changes:[{code:e.message}],hubRevision:record?.revision||null};continue;}
  if(!dependencies.length){results[k]={status:'not_shared',dependencies:[],changes:[],hubRevision:null};continue;}
  for(const c of dependencies){
   const dep={id:c.id,revision:c.revision,recipeId:c.recipeOrigin?.recipeId||c.id.slice(prefix.length)};
   if(sourceError){changes.push({...dep,code:sourceError});continue;}
   if(!c.recipeOrigin||c.recipeOrigin.scope!=='hub-local'||c.recipeOrigin.recipeId!==dep.recipeId){changes.push({...dep,code:'ORIGIN_INVALID'});continue;}
   const latest=current.get(dep.recipeId);
   if(!latest){changes.push({...dep,code:'RECIPE_MISSING'});continue;}
   if(latest.snapshot!==c.recipeOrigin.snapshot)changes.push({...dep,code:'RECIPE_CHANGED'});
   // Pinned child references must exactly correspond to the source graph. A malformed imported graph is never current.
   const expected=latest.subrecipes.map(x=>prefix+x.id),actual=c.parts.filter(x=>x.kind==='reference').map(x=>x.id);
   if(JSON.stringify(expected)!==JSON.stringify(actual))changes.push({...dep,code:'DEPENDENCIES_CHANGED'});
  }
  results[k]={status:changes.length?(changes.some(x=>x.code!=='RECIPE_CHANGED'&&x.code!=='DEPENDENCIES_CHANGED')?'unresolved':'stale'):'current',dependencies:dependencies.map(c=>({id:c.id,revision:c.revision,recipeId:c.recipeOrigin?.recipeId||c.id.slice(prefix.length)})),changes,hubRevision:record?.revision||null};
 }
 return results;
}
root.RLDependencyGKB=Object.freeze({key,index,collect,inspect});
})(globalThis);
