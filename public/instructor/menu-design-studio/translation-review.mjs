import {languages} from './languages.mjs';
const fields=['name','category','description'];
const value=(item,k,l)=>typeof item[k]?.[l]==='string'?item[k][l]:'';
export function linguisticFlags(item,lang){
 const text=fields.map(k=>value(item,k,lang)).join(' ');
 const flags=[];
 if(lang==='en'&&/\bpepperoni\b/i.test(text))flags.push('Pepperoni: salame piccante, non peperoni vegetali. Verificare la ricetta.');
 if(lang==='en'&&/\bpeppers?\b/i.test(text))flags.push('Pepper(s): precisare se pepe, peperone o peperoncino.');
 if(lang==='it'&&/\bpepperoni\b/i.test(text))flags.push('Pepperoni: verificare se salame piccante o refuso.');
 if(/\bsalsa brava\b/i.test(text))flags.push('Salsa brava: composizione variabile; consultare la ricetta.');
 if(/\b(bread|pane|pan)\b/i.test(text))flags.push('Pane: ingrediente composto; consultare la scheda tecnica.');
 return flags;
}
export function reviseTranslation(item,lang,values,reference,approve=false){
 if(!languages.includes(lang)||!values||fields.some(k=>typeof values[k]!=='string'||values[k].length>2000))throw Error('invalid_translation');
 if(approve&&(fields.some(k=>!values[k].trim())||typeof reference!=='string'||!reference.trim()||reference.length>500))throw Error('review_reference_required');
 const next=structuredClone(item);
 const changed=fields.some(k=>value(item,k,lang)!==values[k]);
 for(const k of fields)next[k]={...next[k],[lang]:values[k]};
 if(changed){next.translationReview={};next.allergenReview={...next.allergenReview,status:'pending'};delete next.internalEngineering;next.approved=false;}
 next.translationReview={...next.translationReview,[lang]:approve?{status:'validated',reference:reference.trim()}:{status:'pending'}};
 return next;
}
