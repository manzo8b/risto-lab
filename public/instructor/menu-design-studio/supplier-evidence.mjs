export const documentSchema='ristolab.supplier-evidence/1';
const fields=['id','supplier','product','reference','revision','issued','expires','kind'];
const date=x=>typeof x==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(x)&&Number.isFinite(Date.parse(x))&&new Date(x).toISOString().slice(0,10)===x;
export function validateDocuments(input){
 if(input?.schema!==documentSchema||!Array.isArray(input.documents)||input.documents.length>1000)throw Error('invalid_documents');
 const ids=new Set();
 const documents=input.documents.map(d=>{
 if(!d||fields.some(k=>typeof d[k]!=='string'||d[k].length>500)||fields.filter(k=>k!=='expires').some(k=>!d[k].trim())||ids.has(d.id)||!date(d.issued)||(d.expires!==''&&(!date(d.expires)||d.expires<d.issued))||!['specification','label','declaration','other'].includes(d.kind))throw Error('invalid_document');
 ids.add(d.id);return Object.fromEntries(fields.map(k=>[k,d[k]]));
 });return {schema:documentSchema,documents};
}
export function documentStatus(d,today){
 if(!date(today))throw Error('invalid_audit_date');
 if(d.issued>today)return 'future_issue';
 if(!d.expires)return 'expiry_unspecified';
 const days=(Date.parse(d.expires)-Date.parse(today))/86400000;
 return days<0?'expired':days<=30?'review_due':'within_recorded_dates';
}
export function auditDocuments(input,today){
 const {documents}=validateDocuments(input);
 return documents.map(d=>({...d,status:documentStatus(d,today)}));
}
