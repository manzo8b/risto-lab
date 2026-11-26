import test from 'node:test';
import assert from 'node:assert/strict';
import {assessEvidence,procedures} from './allergen-compliance.mjs';
import {emptyRegister,appendRevision,revisionSummary,validateRegister} from './compliance-register.mjs';
import {validateDocuments,auditDocuments,documentSchema} from './supplier-evidence.mjs';
const fixture=(jurisdiction,recipeId)=>({jurisdiction,recipeId,recipeRevision:'1',reviewer:'TEST',reviewReference:'SYNTHETIC',service:'non_prepacked',simulation:true,allergens:Array.from({length:14},(_,i)=>({code:i+1,presence:'absent',evidence:'TEST ONLY',crossContact:'no_identified_risk',crossEvidence:'TEST ONLY'})),procedures:Object.fromEntries(procedures.map(p=>[p,'TEST ONLY']))});
for(const [jur,id] of [['IT','bruschetta'],['ES','patatas-bravas'],['GB-ENG','fish-and-chips'],['GB-WLS','test-wales'],['GB-SCT','test-scotland'],['GB-NIR','test-ni']]){
 test(jur+' simulation never eligible',()=>{const a=assessEvidence(fixture(jur,id));assert.equal(a.readyForInternalReview,false);assert.equal(a.customerRelease,false);assert.equal(a.legalCertification,false)});
}
test('Italian bread documentation missing',()=>{const r=fixture('IT','bruschetta');r.allergens[0].presence='unknown';r.allergens[0].evidence='';assert.ok(assessEvidence(r).issues.includes('presence_evidence_1'))});
test('Spanish shared fryer unresolved',()=>{const r=fixture('ES','patatas-bravas');r.allergens[3].crossContact='unknown';assert.ok(assessEvidence(r).issues.includes('cross_contact_evidence_4'))});
test('British batter incomplete',()=>{const r=fixture('GB-ENG','fish-and-chips');r.allergens[0].evidence='';assert.ok(assessEvidence(r).issues.includes('presence_evidence_1'))});
test('duplicate allergen rejected',()=>{const r=fixture('IT','test');r.allergens[13].code=1;assert.ok(assessEvidence(r).issues.includes('allergen_matrix_incomplete'))});
test('PPDS out of scope',()=>{const r=fixture('GB-ENG','test');r.service='ppds';assert.ok(assessEvidence(r).issues.includes('service_out_of_scope'))});
test('unknown jurisdiction rejected',()=>{const r=fixture('en','test');assert.ok(assessEvidence(r).issues.includes('jurisdiction_required'))});
test('revision history independent and no approval inheritance',()=>{const r=fixture('ES','test');const first=appendRevision(emptyRegister(),r,'initial','2026-11-25T10:00:00Z');r.recipeRevision='2';const next=appendRevision(first,r,'supplier change','2026-11-26T10:00:00Z');assert.equal(first.records[0].revisions.length,1);assert.equal(next.records[0].revisions[0].record.recipeRevision,'1');assert.equal(revisionSummary(next.records[0])[1].approval,'not_granted');assert.deepEqual(validateRegister(JSON.parse(JSON.stringify(next))),next)});
const doc={id:'d1',supplier:'TEST',product:'TEST',reference:'TEST',revision:'1',issued:'2026-01-01',expires:'2026-11-26',kind:'specification'};
test('expiry boundaries and unspecified expiry',()=>{for(const [expires,status] of [['2026-11-25','expired'],['2026-11-26','review_due'],['2026-12-26','review_due'],['2026-12-27','within_recorded_dates'],['','expiry_unspecified']])assert.equal(auditDocuments({schema:documentSchema,documents:[{...doc,expires}]},'2026-11-26')[0].status,status)});
test('impossible dates and duplicate document IDs',()=>{assert.throws(()=>validateDocuments({schema:documentSchema,documents:[{...doc,issued:'2026-02-30'}]}));assert.throws(()=>validateDocuments({schema:documentSchema,documents:[doc,doc]}))});
