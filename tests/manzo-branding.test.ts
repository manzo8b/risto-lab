import {test} from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
const read=(name:string)=>readFileSync(name,'utf8');

test('official MANZO AI bull icon present as a local project asset',()=>{
 const asset='public/brand/manzo-mark.svg';
 assert.ok(existsSync(asset));
 assert.match(read(asset),/MANZO geometric bull emblem/);
});
test('a reusable brand component links visually to the canonical MANZO AI site',()=>{
 const src=read('src/components/ManzoSignature.astro');
 assert.match(src,/manzo-mark\.svg/);
 assert.match(src,/https:\/\/manzo8b\.github\.io\/manzo-ai\/it\//);
 assert.match(src,/<img/);
 assert.match(src,/loading="lazy"/);
});
test('branding appears at the bottom of all three site layouts',()=>{
 const global=read('src/layouts/Public.astro');
 const instructor=read('src/components/InstructorFooter.astro');
 const prisma=read('src/layouts/PrismaKit.astro');
 for(const src of [global,instructor,prisma])assert.ok(src.includes('<ManzoSignature/>'));
 for(const path of ['src/layouts/Public.astro','src/layouts/Instructor.astro','src/layouts/PrismaKit.astro'])assert.match(read(path),/manzo-signature\.css/);
});
