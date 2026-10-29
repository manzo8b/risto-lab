import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const css=readFileSync('src/styles/learning-colors.css','utf8');
const pub=readFileSync('src/layouts/Public.astro','utf8');
const ins=readFileSync('src/layouts/Instructor.astro','utf8');

const luminance=(hex:string)=>{
 const v=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255);
 const c=v.map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);
 return c[0]*.2126+c[1]*.7152+c[2]*.0722;
};
const contrast=(a:string,b:string)=>{
 const x=luminance(a),y=luminance(b);
 return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);
};

test('semantic colors meet WCAG AA normal text contrast on white and warm ivory',()=>{
 const colors=['#0C615D','#244F9B','#B13F28','#67439A','#7B4B10'];
 for(const color of colors){
  assert.ok(contrast(color,'#FFFFFF')>=4.5,color+' on white');
  assert.ok(contrast(color,'#F6F3ED')>=4.5,color+' on ivory');
 }
 assert.ok(contrast('#FFFFFF','#123F68')>=4.5,'white on dark blue');
 assert.ok(contrast('#FFFFFF','#0C615D')>=4.5,'white on teal');
});
test('both layouts load color system and retain neutral reading and print mode',()=>{
 for(const layout of [pub,ins])assert.match(layout,/learning-colors\.css/);
 assert.match(css,/\\.lesson-card:nth-child\(5n\\+5\)/);
 assert.match(css,/\\.cycle>div:nth-child\(5\)/);
 assert.match(css,/\\.sector-case:nth-of-type/);
 assert.match(css,/@media print/);
 assert.match(css,/:focus-visible/);
 assert.match(css,/@media\(max-width:640px\)/);
 assert.doesNotMatch(css,/animation\s*:/);
});
test('color-led lessons have stable number binding',()=>{
 const page=readFileSync('src/instructor/pages/instructor/laboratorio-sicurezza/lezioni/[slug].astro','utf8');
 assert.match(page,/data-course-lesson=\{lesson\\.number\}/);
});
