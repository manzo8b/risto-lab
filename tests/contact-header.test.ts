import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=(p:string)=>readFileSync(p,'utf8');
const email='marcelo2020.it@gmail.com';
test('public contact email has a visible mailto link',()=>{
 const component=read('src/components/ContactHeader.astro');
 assert.ok(component.includes(email));
 assert.ok(component.includes('mailto:'));
 assert.ok(component.includes('Contatti e servizi'));
});
test('shared public, instructor, and PRISMA pages include site header contact',()=>{
 for(const path of ['src/layouts/Public.astro','src/layouts/Instructor.astro','src/layouts/PrismaKit.astro']){
  const s=read(path);
  assert.ok(s.includes('<ContactHeader/>'),path);
  assert.ok(s.includes('contact-header.css'),path);
 }
 const css=read('src/styles/contact-header.css');
 assert.ok(css.includes('.ecosystem-contact-header'));
 assert.ok(css.includes('@media(max-width:650px)'));
});
