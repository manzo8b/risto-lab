import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import {safetyLessons,safetySources} from '../src/instructor/data/safety-course';

const index=readFileSync('src/instructor/pages/instructor/laboratorio-sicurezza/lezioni/index.astro','utf8');
const page=readFileSync('src/instructor/pages/instructor/laboratorio-sicurezza/lezioni/[slug].astro','utf8');

test('exactly five substantial lessons with independent stable routes',()=>{
 assert.equal(safetyLessons.length,5);
 assert.equal(new Set(safetyLessons.map(x=>x.slug)).size,5);
 safetyLessons.forEach((lesson,i)=>{
   assert.equal(lesson.number,i+1);
   assert.ok(lesson.duration>=10);
   assert.equal(lesson.objectives.length,3);
   assert.equal(lesson.sections.length,3);
   assert.ok(lesson.sections.every(s=>s.paragraphs.length>=2&&s.paragraphs.every(x=>x.length>=80)));
   assert.ok(lesson.case.situation.length>75&&lesson.case.solution.length>100);
   assert.equal(lesson.vocab.length,3);
   assert.equal(lesson.quiz.length,3);
   assert.ok(lesson.quiz.every(q=>q.choices.length===3&&q.correct>=0&&q.correct<3&&q.why.length>=50));
 });
});

test('direct official links cover law, agreement and Gazzetta Ufficiale',()=>{
 assert.match(safetySources.normattiva.url,/^https:\/\/www\.normattiva\.it\/eli/);
 assert.match(safetySources.accordo.url,/^https:\/\/lavoro\.gov\.it\/temi-e-priorita/);
 assert.match(safetySources.gu.url,/^https:\/\/www\.gazzettaufficiale\.it\/atto/);
 for(const src of Object.values(safetySources))assert.match(src.url,/^https:\/\//);
 assert.match(page,/safetySources\.normattiva\.url/);
 assert.match(page,/safetySources\.accordo\.url/);
 assert.match(index,/safetySources\.accordo\.url/);
});

test('all lessons explicitly non-certifying and correctable in browser',()=>{
 assert.match(page,/non certificante/);
 assert.match(page,/getStaticPaths/);
 assert.match(page,/data-correct=\{q\.correct\}/);
 assert.match(page,/id="grade-lesson"/);
 assert.match(page,/id="lesson-score"/);
 assert.match(page,/aria-live="polite"/);
 assert.match(page,/type="reset"/);
 assert.match(page,/lesson\.case\.solution/);
 assert.match(page,/lesson\.sections\.map/);
 assert.match(index,/non certificante/);
});

test('five-lesson index is discoverable on public formation and Instructor lab',()=>{
 for(const path of ['src/instructor/pages/formazione.astro','src/instructor/pages/instructor/programmi/index.astro','src/instructor/pages/instructor/laboratorio-sicurezza.astro','src/instructor/pages/instructor/index.astro']){
   assert.match(readFileSync(path,'utf8'),/laboratorio-sicurezza\/lezioni/);
 }
});
