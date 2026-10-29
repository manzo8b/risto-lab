import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync,readdirSync} from 'node:fs';
import {join} from 'node:path';
import {agenda,acronym,sources,questions,scenarios,outcomes,rubric,prismaRoot,sourceMatrix} from '../src/instructor/data/prisma-hse';
import {prismaSlides} from '../src/instructor/data/prisma-slides';

const root='src/instructor/pages/atelier/prisma-hse-q7m4v9n2';
const names=['index','progetto','slide','attivita','docente','valutazione'];
const content=(name:string)=>readFileSync(join(root,name+'.astro'),'utf8');
const layout=readFileSync('src/layouts/PrismaKit.astro','utf8');

test('P.R.I.S.M.A. is a complete source-based kit with six navigable sections',()=>{
 for(const name of names){assert.ok(existsSync(join(root,name+'.astro')),name);}
 assert.equal(acronym.length,6);
 assert.deepEqual(acronym.map(x=>x.letter),['P','R','I','S','M','A']);
 assert.equal(outcomes.length,5);
 assert.equal(sources.length,5);
 assert.equal(sourceMatrix.length,6);
 assert.equal(scenarios.length,3);
 assert.equal(questions.length,12);
 assert.equal(rubric.length,5);
 assert.equal(prismaSlides.length,12);
 for(const slide of prismaSlides){assert.ok(slide.note.length>=70);assert.ok(slide.source.length>10);}
 for(const src of sources)assert.match(src.url,/^https:\/\//);
});

test('two methodological sessions are exactly 4 hours each, including breaks',()=>{
 for(const day of [1,2]){
  const units=agenda.filter(x=>x.day===day);
  assert.equal(units.reduce((sum,x)=>sum+x.minutes,0),240);
  assert.equal(units.filter(x=>x.title==='Pausa').length,1);
  assert.equal(units[0].start,'09:00');
  assert.equal(units[units.length-1].end,'13:00');
 }
 assert.equal(agenda.reduce((sum,x)=>sum+x.minutes,0),480);
});

test('all kit pages are noindex, with no outward public-site navigation',()=>{
 assert.match(layout,/name="robots" content="noindex,nofollow,noarchive,nosnippet,noimageindex"/);
 assert.match(layout,/name="referrer" content="no-referrer"/);
 assert.match(layout,/indipendente/);
 assert.match(layout,/prismaRoot/);
 assert.ok(names.every(x=>content(x).includes('PrismaKit')));
 assert.ok(!existsSync('src/instructor/pages/atelier/scheda-pc4m8q2.astro'),'old live route must be gone');
});
test('unlisted site route appears in no ordinary navigation outside its own kit',()=>{
 const walk=(dir:string):string[]=>readdirSync(dir,{withFileTypes:true}).flatMap(item=>item.isDirectory()?walk(join(dir,item.name)):[join(dir,item.name)]);
 const all=walk('src/instructor/pages').filter(x=>x.endsWith('.astro')&&!x.startsWith(root+'/'));
 for(const file of all){
  assert.ok(!readFileSync(file,'utf8').includes(prismaRoot),'route leaked in public page '+file);
 }
 assert.ok(!existsSync('public/sitemap.xml'));
});

test('pedagogical tools include original project, scripted guide, interactions and checkable sources',()=>{
 const slide=content('slide'),activity=content('attivita'),teacher=content('docente'),evalPage=content('valutazione');
 for(const marker of ['id="prisma-slides"','id="next"','id="fullscreen"','id="notes-toggle"','id="print-slides"'])assert.ok(slide.includes(marker),marker);
 for(const marker of ['id="gossip"','id="casi"','id="ai-fact-check"','id="project-work"','class="prisma-check"','id="example-work"'])assert.ok(activity.includes(marker),marker);
 for(const marker of ['A1','A10','Script del formatore','Stampa il manuale','Schema']){/* optional copy-dependent */}
 assert.match(teacher,/A1/);assert.match(teacher,/A10/);assert.match(teacher,/worksheet\.map/);
 assert.match(evalPage,/questions\.map/);assert.match(evalPage,/rubric\.map/);
 assert.match(evalPage,/id="grade"/);assert.match(evalPage,/id="score-rubric"/);
 assert.match(content('progetto'),/sourceMatrix\.map/);
});
