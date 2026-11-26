import {assessEvidence} from './allergen-compliance.mjs';
export const schema='ristolab.compliance-register/1';
const clone=x=>JSON.parse(JSON.stringify(x));
export function emptyRegister(){return {schema,records:[]}}
export function validateRegister(input){
 if(input?.schema!==schema||!Array.isArray(input.records)||input.records.length>500)throw Error('invalid_register');
 const ids=new Set();
 for(const r of input.records){
 if(typeof r?.id!=='string'||!r.id||ids.has(r.id)||!Array.isArray(r.revisions)||!r.revisions.length||r.revisions.length>100)throw Error('invalid_record');
 ids.add(r.id);
 for(const [i,v] of r.revisions.entries()){
 if(v?.number!==i+1||typeof v.createdAt!=='string'||!Number.isFinite(Date.parse(v.createdAt))||typeof v.reason!=='string'||!v.reason.trim()||!v.record||typeof v.record!=='object'||Array.isArray(v.record)||v.record.recipeId!==r.id)throw Error('invalid_revision');
 assessEvidence(v.record);
 }
 }
 return clone(input);
}
export function appendRevision(register,record,reason,now=new Date().toISOString()){
 const next=validateRegister(register);
 if(typeof record?.recipeId!=='string'||!record.recipeId.trim()||record.recipeId.length>500||typeof reason!=='string'||!reason.trim()||reason.length>500||!Number.isFinite(Date.parse(now)))throw Error('revision_metadata_required');
 assessEvidence(record);
 let entry=next.records.find(r=>r.id===record.recipeId);
 if(!entry){entry={id:record.recipeId,revisions:[]};next.records.push(entry)}
 entry.revisions.push({number:entry.revisions.length+1,createdAt:now,reason:reason.trim(),record:clone(record)});
 return validateRegister(next);
}
export function revisionSummary(entry){
 return entry.revisions.map((v,i)=>({number:v.number,createdAt:v.createdAt,reason:v.reason,current:i===entry.revisions.length-1,assessment:assessEvidence(v.record),approval:'not_granted'}));
}
