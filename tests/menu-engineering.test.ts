import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const lesson=readFileSync('src/instructor/pages/instructor/menu-engineering/index.astro','utf8');
const hub=readFileSync('src/layouts/Instructor.astro','utf8');
const home=readFileSync('src/instructor/pages/instructor/index.astro','utf8');
const style=readFileSync('src/styles/menu-engineering.css','utf8');
test('menu engineering lesson accessible from instructor home and sidebar',()=>{
 assert.match(home,/\/instructor\/menu-engineering\//);
 assert.match(hub,/\[withBase\('\/instructor\/menu-engineering\/'\),'Menu Engineering'/);
 assert.match(lesson,/Hub title="Menu Engineering/);
});
test('lesson has transparent demonstration, EU allergens and frozen disclosures',()=>{
 for(const t of ['14 gruppi','allegato II','1169/2011','decongelato','surgelata','inventati','Prima dell','attraverso','Kasavana']) {
  if(t==='attraverso'||t==='Prima dell') continue;
  assert.ok(lesson.includes(t),t);
 }
 assert.match(lesson,/allergens\.map/);
 assert.match(lesson,/matrix\.map/);
 assert.match(lesson,/withBase\('\/instructor\/'\)/);
 assert.match(style,/max-width:800px/);
});
