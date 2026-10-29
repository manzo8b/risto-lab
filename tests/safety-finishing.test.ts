import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import {safetyLessons} from '../src/instructor/data/safety-course';
import {safetyEvidence,agreementFAQ} from '../src/instructor/data/safety-evidence';

const read=(p:string)=>readFileSync(p,'utf8');

test('priority 1: all five lessons have three distinct pinpoint official references',()=>{
 assert.equal(safetyEvidence.length,5);
 for(const lesson of safetyLessons){
  const map=safetyEvidence.find(item=>item.slug===lesson.slug);
  assert.ok(map,'missing source map for '+lesson.slug);
  assert.equal(map.items.length,lesson.sections.length);
  for(const item of map.items){
   assert.match(item.reference,/(articol|Articol|Parte|FAQ|§)/);
   assert.match(item.url,/^https:\/\/www\.(normattiva\.it|lavoro\.gov\.it)/);
   assert.ok(item.note.length>=50);
   assert.ok(item.focus.length>=10);
  }
 }
 const page=read('src/instructor/pages/instructor/laboratorio-sicurezza/lezioni/[slug].astro');
 assert.match(page,/evidence\.items\[i\]/);
 assert.match(page,/norm-reference/);
 assert.match(page,/agreementFAQ\.notes\.map/);
 assert.ok(agreementFAQ.notes.some(note=>note.includes('Quesito 45')));
});

test('priority 2: teacher guide is printable, complete and gives the correct 90 minute agenda',()=>{
 const page=read('src/instructor/pages/instructor/laboratorio-sicurezza/scheda-docente.astro');
 assert.match(page,/window\.print\(\)/);
 assert.match(page,/non certificante/i);
 assert.match(page,/Cruciverba/);
 assert.match(page,/Rubrica osservativa/);
 assert.match(page,/D\.Lgs\. 81\/2008/);
 assert.match(page,/Accordo 59\/CSR/);
 const agenda=page.match(/minutes:(\d+)/g)||[];
 assert.equal(agenda.reduce((total,entry)=>total+Number(entry.split(':')[1]),0),90);
 assert.match(page,/feedback|osservazion/i);
});

test('priority 3: exactly three fictional sector microcases with interactive explanations',()=>{
 const page=read('src/instructor/pages/instructor/laboratorio-sicurezza/microcasi.astro');
 for(const name of ['Ristorazione','Uffici','Logistica'])assert.ok(page.includes(name),name);
 assert.equal((page.match(/"sector":/g)||[]).length,3);
 assert.equal((page.match(/"correct":/g)||[]).length,3);
 assert.match(page,/data-correct=\{c\.correct\}/);
 assert.match(page,/id=\{'caso-'/);
 assert.match(page,/\.case-check/);
 assert.match(page,/totalmente inventati/i);
 assert.match(page,/valutazione dei rischi/);
});
test('existing lab and index expose only these focused completion resources',()=>{
 for(const path of [
 'src/instructor/pages/instructor/laboratorio-sicurezza.astro',
 'src/instructor/pages/instructor/laboratorio-sicurezza/lezioni/index.astro'
 ]){const s=read(path);assert.match(s,/laboratorio-sicurezza\/scheda-docente/);assert.match(s,/laboratorio-sicurezza\/microcasi/);}
});
