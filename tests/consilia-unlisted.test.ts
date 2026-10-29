import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync,readdirSync} from 'node:fs';
import {join} from 'node:path';

const target='src/instructor/pages/atelier/scheda-pc4m8q2.astro';
const page=readFileSync(target,'utf8');
const slug='scheda-pc4m8q2';

test('Consilia proposal is a single unlisted noindex static RISTO-LAB page',()=>{
 assert.match(page,/name="robots" content="noindex,nofollow,noarchive,nosnippet"/);
 assert.match(page,/name="googlebot" content="noindex,nofollow,noarchive,nosnippet"/);
 assert.match(page,/Studio progettuale non commissionato|Studio progettuale non commissionato|Studio progettuale non commissionato/);
 assert.match(page,/non protetta da autenticazione/i);
 assert.match(page,/Non è stato commissionato, approvato o patrocinato/i);
 assert.doesNotMatch(page,/<form[^>]*action=/);
 assert.doesNotMatch(page,/(?:fetch|XMLHttpRequest)\s*\(/);
});
test('no public navigation or sitemap exposes unlisted slug',()=>{
 const walk=(dir:string):string[]=>readdirSync(dir,{withFileTypes:true}).flatMap(item=>item.isDirectory()?walk(join(dir,item.name)):[join(dir,item.name)]);
 const files=walk('src/instructor').filter(x=>x!==target&&/\.(astro|ts|js|json)$/.test(x));
 for(const file of files){
  assert.ok(!readFileSync(file,'utf8').includes(slug),'unlisted slug leaked via '+file);
 }
 assert.ok(!existsSync('public/sitemap.xml'));
 assert.ok(!existsSync('public/robots.txt'));
});
test('both proposed four-hour sessions include exactly one ten-minute break',()=>{
 const minuteMatches=[...page.matchAll(/name:'[^']+',minutes:(\d+),kind:/g)];
 assert.equal(minuteMatches.length,8);
 const times=minuteMatches.map(m=>Number(m[1]));
 assert.equal(times.slice(0,4).reduce((a,b)=>a+b,0)+10,240);
 assert.equal(times.slice(4).reduce((a,b)=>a+b,0)+10,240);
 assert.equal(times.reduce((a,b)=>a+b,0)+20,480);
});
test('proposal and project work have educational deliverables and working quizzes',()=>{
 for(const marker of ['id="progetto"','id="programma"','id="project-work"','id="valutazione"','id="fonti"','id="practice-choices"','id="check-scenario"','id="work-quiz"','id="check-quiz"','id="print-project"','aria-live="polite"','fonti normative']){
  assert.ok(page.includes(marker),marker);
 }
 assert.match(page,/D\.Lgs\. 81\/2008/);
 assert.match(page,/Accordo Stato-Regioni 17 aprile 2025/);
 assert.match(page,/Non costituisce corso HSE obbligatorio/);
});
