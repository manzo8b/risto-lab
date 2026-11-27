/* RISTO-LAB Data Hub v0.1. Local-first draft workspace. No server, no user isolation. */
(function(root){
'use strict';
const DB='risto-lab-professional-suite-data-hub-v1',CHANNEL=DB+':events',SCHEMA='ristolab.data-hub/1',MAX_BYTES=15*1024*1024;
const key=(kind,scope)=>kind+':'+scope,validScope=s=>typeof s==='string'&&/^[A-Za-z0-9][A-Za-z0-9_.-]{0,19}$/.test(s);
const fail=c=>{throw Error(c);};
const validId=s=>typeof s==='string'&&/^[A-Za-z0-9][A-Za-z0-9_.:-]{0,49}$/.test(s);
const id=()=> 'ing-'+crypto.randomUUID();
function payload(kind,data){
 if(kind!=='recipes'||data?.schema!=='ristolab.recipe-archive/1'||data.version!=='1.0.0'||data.purpose!=='experimental_internal_only'||!Array.isArray(data.recipes)||!data.recipes.length||data.recipes.length>5000)fail('INVALID_ARCHIVE');
 const recipes=new Set(),ingredients=new Set();
 for(const r of data.recipes){if(!r||!validId(r.id)||recipes.has(r.id)||!Array.isArray(r.ingredients)||r.ingredients.length>1000||!Array.isArray(r.subrecipes))fail('INVALID_RECIPE');recipes.add(r.id);for(const x of r.ingredients){if(!x||!validId(x.id)||ingredients.has(x.id)||typeof x.name!=='string')fail('INVALID_INGREDIENT_ID');ingredients.add(x.id);}}
 const serialized=JSON.stringify(data);if(new TextEncoder().encode(serialized).length>MAX_BYTES)fail('ARCHIVE_LIMIT');return serialized;
}
function validateKey(kind,scope){if(kind!=='recipes'||!validScope(scope))fail('INVALID_KEY');}
function open(){return new Promise((resolve,reject)=>{if(!root.indexedDB){reject(Error('STORAGE_UNAVAILABLE'));return;}const r=root.indexedDB.open(DB,1);r.onupgradeneeded=()=>{const db=r.result;db.createObjectStore('heads',{keyPath:'key'});db.createObjectStore('revisions',{keyPath:['key','revision']});};r.onerror=()=>reject(r.error||Error('STORAGE_UNAVAILABLE'));r.onblocked=()=>reject(Error('STORAGE_BLOCKED'));r.onsuccess=()=>{const db=r.result;db.onversionchange=()=>db.close();resolve(db);};});}
function notify(event){try{if(typeof root.BroadcastChannel==='function'){const c=new root.BroadcastChannel(CHANNEL);c.postMessage(event);c.close();}}catch{}}
function subscribe(fn){if(typeof fn!=='function')fail('INVALID_LISTENER');if(typeof root.BroadcastChannel!=='function')return ()=>{};const c=new root.BroadcastChannel(CHANNEL);c.onmessage=e=>{const x=e.data;if(x?.schema===SCHEMA&&x.kind==='recipes'&&validScope(x.scope)&&Number.isSafeInteger(x.revision)&&x.revision>0)fn(x);};return ()=>c.close();}
async function get(kind,scope='local'){
 validateKey(kind,scope);const db=await open();
 return new Promise((resolve,reject)=>{const tx=db.transaction(['heads','revisions'],'readonly');let result=null;const r=tx.objectStore('heads').get(key(kind,scope));r.onsuccess=()=>{if(!r.result)return;const x=tx.objectStore('revisions').get([key(kind,scope),r.result.revision]);x.onsuccess=()=>{result=x.result||null;if(!result)tx.abort();};};tx.oncomplete=()=>{db.close();resolve(result);};tx.onabort=tx.onerror=()=>{db.close();reject(tx.error||Error('READ_FAILED'));};});
}
async function put(kind,scope,data,expectedRevision){
 validateKey(kind,scope);if(!Number.isSafeInteger(expectedRevision)||expectedRevision<0)fail('EXPECTED_REVISION_REQUIRED');const json=payload(kind,data),db=await open();
 const result=await new Promise((resolve,reject)=>{const tx=db.transaction(['heads','revisions'],'readwrite'),heads=tx.objectStore('heads'),revs=tx.objectStore('revisions'),k=key(kind,scope);let result,error,changed=false;
 const abort=e=>{error=e;tx.abort();};
 const h=heads.get(k);h.onsuccess=()=>{const n=h.result?.revision||0;if(n!==expectedRevision){abort(Error('REVISION_CONFLICT'));return;}
 const write=()=>{const revision=n+1;result={schema:SCHEMA,key:k,kind,scope,revision,updatedAt:new Date().toISOString(),data:JSON.parse(json)};revs.add(result);heads.put({key:k,revision});changed=true;};
 if(!n){write();return;}const r=revs.get([k,n]);r.onsuccess=()=>{if(!r.result){abort(Error('MISSING_REVISION'));return;}if(JSON.stringify(r.result.data)===json){result=r.result;return;}write();};};
 tx.oncomplete=()=>{db.close();resolve({record:result,changed});};tx.onabort=tx.onerror=()=>{db.close();reject(error||tx.error||Error('WRITE_FAILED'));};});
 if(result.changed)notify({schema:SCHEMA,kind,scope,revision:result.record.revision});return result;
}
async function history(kind,scope='local'){
 validateKey(kind,scope);const db=await open();return new Promise((resolve,reject)=>{const tx=db.transaction('revisions','readonly'),out=[],r=tx.objectStore('revisions').openCursor(IDBKeyRange.bound([key(kind,scope),1],[key(kind,scope),Number.MAX_SAFE_INTEGER]));r.onsuccess=()=>{const c=r.result;if(!c)return;out.push(c.value);c.continue();};tx.oncomplete=()=>{db.close();resolve(out);};tx.onabort=tx.onerror=()=>{db.close();reject(tx.error||Error('HISTORY_FAILED'));};});
}
root.RLDataHub=Object.freeze({SCHEMA,id,get,put,history,subscribe});
})(globalThis);
