import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {test} from 'node:test';

const read=(path:string)=>readFileSync(path,'utf8');
const lab='src/instructor/pages/instructor/laboratorio-sicurezza.astro';
const pub='src/instructor/pages/formazione-aziende.astro';
const docs='docs/BUSINESS_ACADEMY_SAFETY_2026.md';

test('Business Academy source assets are present',()=>{
 for(const path of [lab,pub,docs])assert.ok(existsSync(path),path);
});
test('instructor safety laboratory is explicitly non-certifying',()=>{
 const t=read(lab);
 assert.match(t,/non certificante|non certificanti/i);
 assert.match(t,/D\.Lgs\. 81\/2008/);
 assert.match(t,/17 aprile 2025/);
 assert.match(t,/Decreto_interministeriale_6_marzo_2013|D\.I\. 6 marzo 2013/);
 assert.match(t,/id="lab-quiz"/);
 assert.match(t,/name=\{'q'\+i\}/);
 assert.match(t,/window\.print\(\)/);
});
test('business marketing clearly segregates mandatory training',()=>{
 const t=read(pub);assert.match(t,/non certificanti/i);
 assert.match(t,/non sostituiscono la formazione obbligatoria/i);
 assert.match(t,/Sicurezza che si applica/);
 assert.match(t,/formazione-aziende/);
});
test('curriculum links to the lab and company offer',()=>{
 const program=read('src/instructor/pages/instructor/programmi/index.astro');
 const formazione=read('src/instructor/pages/formazione.astro');
 assert.match(program,/laboratorio-sicurezza/);
 assert.match(program,/formazione-aziende/);
 assert.match(formazione,/formazione-aziende/);
});
test('source register separates mandatory and non-certifying offerings',()=>{
 const text=read(docs);
 assert.match(text,/Workshop non certificanti/);
 assert.match(text,/Percorsi obbligatori/);
 assert.match(text,/soggetto formatore/);
 assert.match(text,/Accordo Stato-Regioni/);
});
