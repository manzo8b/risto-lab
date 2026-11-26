export const jurisdictions=Object.freeze({
 IT:{language:'it',sources:['EU1169','EU2021','IT231'],review:'preliminary'},
 ES:{language:'es',sources:['EU1169','EU2021','ES126'],review:'preliminary'},
 'GB-ENG':{language:'en',sources:['FSA2025'],review:'incomplete'},
 'GB-WLS':{language:'en',sources:['FSA2025'],review:'incomplete'},
 'GB-SCT':{language:'en',sources:[],review:'incomplete'},
 'GB-NIR':{language:'en',sources:['EU1169','FSA2025'],review:'incomplete'}
});
export const sources=Object.freeze({
 EU1169:{kind:'law',title:'Regulation (EU) 1169/2011, Articles 9, 21, 44 and Annex II',url:'https://eur-lex.europa.eu/eli/reg/2011/1169/oj/eng'},
 EU2021:{kind:'law',title:'Regulation (EU) 2021/382',url:'https://eur-lex.europa.eu/eli/reg/2021/382/oj/eng'},
 IT231:{kind:'law',title:'D.Lgs. 231/2017, art. 19',url:'https://www.normattiva.it/eli/id/2018/02/08/18G00023/CONSOLIDATED/20261112'},
 ES126:{kind:'law',title:'Real Decreto 126/2015',url:'https://www.boe.es/eli/es/rd/2015/02/27/126/con'},
 FSA2025:{kind:'guidance',title:'FSA non-prepacked foods best practice',url:'https://www.food.gov.uk/business-guidance/allergen-information-for-non-prepacked-foods-best-practice-voluntary-information'}
});
export const procedures=Object.freeze(['supplier_specs','incoming_goods','compound_ingredients','recipe_review','cross_contact','responsible_review','customer_information','change_control','staff_training','emergency_procedure']);
const nonempty=x=>typeof x==='string'&&x.trim().length>0;
export function assessEvidence(record){
 const issues=[];
 if(!Object.hasOwn(jurisdictions,record?.jurisdiction??''))issues.push('jurisdiction_required');
 if(record?.service!=='non_prepacked')issues.push('service_out_of_scope');
 if(record?.simulation!==false)issues.push('simulation_or_unknown');
 for(const k of ['recipeId','recipeRevision','reviewer','reviewReference'])if(!nonempty(record?.[k]))issues.push(k+'_required');
 const rows=record?.allergens;
 if(!Array.isArray(rows)||rows.length!==14||new Set(rows.map(r=>r?.code)).size!==14||rows.some(r=>!Number.isInteger(r?.code)||r.code<1||r.code>14))issues.push('allergen_matrix_incomplete');
 else for(const r of rows){
 if(!['present','absent'].includes(r.presence)||!nonempty(r.evidence))issues.push('presence_evidence_'+r.code);
 if(!['residual_risk','no_identified_risk'].includes(r.crossContact)||!nonempty(r.crossEvidence))issues.push('cross_contact_evidence_'+r.code);
 }
 for(const p of procedures)if(!nonempty(record?.procedures?.[p]))issues.push('procedure_'+p);
 return {issues,readyForInternalReview:issues.length===0,customerRelease:false,legalCertification:false};
}
