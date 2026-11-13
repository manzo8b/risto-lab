import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read=(p:string)=>readFileSync(p,'utf8');
const css=read('src/styles/white-ecosystem.css');
const publicShell=read('src/layouts/Public.astro');
const instructorShell=read('src/layouts/Instructor.astro');
const prismaShell=read('src/layouts/PrismaKit.astro');
const classroomShell=read('src/instructor/pages/instructor/aula.astro');

test('white canvas is explicit on every platform shell',()=>{
 assert.match(css,/--paper:#fff/);
 assert.match(css,/background:#fff!important/);
 for(const layout of [publicShell,instructorShell,prismaShell,classroomShell])assert.match(layout,/white-ecosystem\.css\?url/);
});

test('responsive navigation offers all public destinations without JS dependency',()=>{
 for(const target of ['/programmi/','/gratuita/','/premium/','/aziende/','/area-docente/'])assert.ok(publicShell.includes(target),target);
 assert.match(publicShell,/rl-mobile-menu/);
 assert.match(publicShell,/rl-mobile-links/);
 assert.match(publicShell,/aria-current/);
 assert.match(css,/@media\(max-width:800px\)/);
});

test('public catalog and tier pages represent actual project maturity',()=>{
 const paths=['src/instructor/pages/programmi.astro','src/instructor/pages/gratuita.astro','src/instructor/pages/premium.astro','src/instructor/pages/aziende.astro'];
 for(const p of paths)assert.match(read(p),/<Public title=/,p);
 assert.match(read(paths[0]),/units\.filter/);
 assert.match(read(paths[1]),/non certificante/i);
 assert.match(read(paths[2]),/non è ancora attivo un abbonamento/i);
 assert.match(read(paths[3]),/non è ancora una piattaforma operativa/);
});

test('Unit 06 learning deck stays white and its curriculum status stays pending',()=>{
 const deck=read('public/materiali/mise-en-place-masterclass.html');
 assert.match(deck,/--ivory:#ffffff/);
 assert.equal((deck.match(/aria-roledescription="slide"/g)||[]).length,12);
 const catalog=JSON.parse(read('src/instructor/data/catalog.public.json'));
 assert.equal(catalog.units.find((u:{order:number})=>u.order===6).status,'PARTIAL');
});
