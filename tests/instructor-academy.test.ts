import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const page=readFileSync('src/instructor/pages/instructor/index.astro','utf8');
const css=readFileSync('src/styles/instructor-gourmet.css','utf8');
test('Academy Instructor home preserves teaching session and resume controls',()=>{
 for(const text of ['id="home-lookup"','id="today-plans"','id="resume"','id="recent-link"','id="recent-materials"','renderPlans(']) assert.ok(page.includes(text),text);
});
test('Academy visual uses full didactic infographic, without botanical decoration',()=>{
 const refinement=css.split('RISTO-LAB Academy · 31 ottobre 2026')[1];
 assert.ok(refinement);
 assert.match(refinement,/object-fit:contain/);
 assert.ok(refinement.includes('object-fit:contain'));
 const next=readFileSync('src/styles/academy-v4.css','utf8');
 assert.match(next,/academy-launch-grid/);
 assert.match(next,/--academy-purple:#5b16d6/);
 assert.doesNotMatch(refinement,/palm|leaf|foglie|palme|laurel/i);
 assert.ok(page.indexOf('gourmet-carte"')<page.indexOf('gourmet-hero-media"'));
});
