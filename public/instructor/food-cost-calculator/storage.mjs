// Browser-only persistence. Explicit backup remains necessary.
const DB='ristolab-food-cost',STORE='runs';
function open(){return new Promise((resolve,reject)=>{const req=indexedDB.open(DB,1);req.onupgradeneeded=()=>req.result.createObjectStore(STORE,{keyPath:'id'});req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);req.onblocked=()=>reject(Error('database_blocked'))})}
async function transact(mode,fn){const db=await open();try{return await new Promise((resolve,reject)=>{const tx=db.transaction(STORE,mode);let req;tx.oncomplete=()=>resolve(req.result);tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error??Error('transaction_aborted'));req=fn(tx.objectStore(STORE))})}finally{db.close()}}
export function saveRun(run){if(run?.schema!=='ristolab.cost-run/1')throw Error('invalid_run');const id=crypto.randomUUID();return transact('readwrite',s=>s.add({id,savedAt:new Date().toISOString(),run:structuredClone(run)}))}
export const listRuns=()=>transact('readonly',s=>s.getAll());
export const deleteRun=id=>transact('readwrite',s=>s.delete(id));
export function exportJSON(run){return JSON.stringify(run,null,2)}
const cell=x=>{let s=String(x??'');if(typeof x==='string'&&/^[\s]*[=+@-]/.test(s))s="'"+s;return '"'+s.replaceAll('"','""')+'"'};
export function exportCSV(run){const m=run.metrics??{};return [['recipe_id','as_of','cost','per_portion','net_revenue','food_cost_pct','cm1','target_gross','source_status'],[run.recipeId,run.asOf,run.result?.cost,m.perPortion,m.netRevenue,m.foodCostPct,m.cm1,m.targetGross,run.sourceStatus?.join('|')]].map(r=>r.map(cell).join(',')).join('\r\n')}
