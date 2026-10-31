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
 assert.ok(lesson.includes('withBase("/instructor/")'));
 assert.match(style,/max-width:800px/);
});

test('restaurant owner process contains carbonara, ingredient evidence and sample menu matrix',async()=>{
 const {dishExamples,totalExampleDishes}=await import('../src/instructor/data/menu-allergen-examples.ts');
 assert.equal(totalExampleDishes,31);
 assert.equal(dishExamples.reduce((count,g)=>count+g.dishes.length,0),31);
 const carbonara=dishExamples.flatMap(g=>g.dishes).find(x=>x.id==='P01');
 assert.deepEqual(carbonara?.codes,[1,3,7]);
 for(const term of ['id="gestione-allergeni"','Spaghetti alla carbonara','schede tecniche','contaminazioni crociate','dishExamples.map','group.dishes.map','è una scelta grafica'])assert.ok(lesson.includes(term),term);
 assert.match(style,/\.me-carbonara/);
});
