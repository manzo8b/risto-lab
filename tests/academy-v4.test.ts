import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=(p:string)=>readFileSync(p,'utf8');
const c=read('src/styles/academy-v4.css');
const publicShell=read('src/layouts/Public.astro');
const instructor=read('src/layouts/Instructor.astro');
const home=read('src/instructor/pages/instructor/index.astro');

test('one brand system is loaded last across public and teaching layouts',()=>{
 for(const p of ['src/layouts/Public.astro','src/layouts/Instructor.astro','src/layouts/PrismaKit.astro','src/instructor/pages/instructor/aula.astro'])assert.match(read(p),/academy-v4\.css\?url/,p);
 assert.match(publicShell,/risto-lab-icon\.webp/);
 assert.match(instructor,/academy-sidebar-brand/);
 assert.match(instructor,/academy-header-search/);
});
test('the dashboard uses only actual learning inventory, not sample statistics',()=>{
 assert.match(home,/\{units\.length\}/);
 assert.match(home,/\{resources\.length\}/);
 for(const fabricated of ['Prof. Rossi','124','1.200 risorse','5 programmi attivi','76%'])assert.ok(!home.includes(fabricated),fabricated);
 for(const hook of ['id="home-lookup"','id="today-plans"','id="resume"','id="recent-link"','id="recent-materials"'])assert.ok(home.includes(hook),hook);
});
test('design is white-first, saturated and includes mobile reflow rules',()=>{
 for(const token of ['--academy-purple:#5b16d6','--academy-blue:#0968e8','--academy-teal:#008e90'])assert.ok(c.includes(token),token);
 assert.match(c,/body\.instructor-shell \.menu-lesson \.me-xray/);
 assert.match(c,/@media\(max-width:580px\)/);
 assert.match(c,/body\.instructor-shell \.academy-dash \.quick-access\.gourmet-menu/);
 assert.match(publicShell,/\[withBase\('\/risorse\/'\),'Risorse'\]/);
});
