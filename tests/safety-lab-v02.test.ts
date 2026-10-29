import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';

const page=readFileSync('src/instructor/pages/instructor/laboratorio-sicurezza.astro','utf8');

test('Instructor lab has six interactive teaching modalities and explicit non-certifying scope',()=>{
  for(const marker of ['id="minilezioni"','id="slide"','id="telefonata"','id="vocabolario"','id="cruciverba"','id="quiz"','non certificante','Accordo Stato-Regioni','D.Lgs. 81/2008','window.print()']){
    assert.ok(page.includes(marker),marker);
  }
  assert.match(page,/https:\/\/www\.normattiva\.it/);
  assert.match(page,/https:\/\/lavoro\.gov\.it/);
  assert.match(page,/source-list/);
  assert.match(page,/id="gossip-check"/);
  assert.match(page,/id="slide-project"/);
  assert.match(page,/id="cross-check"/);
  assert.match(page,/id="cross-reset"/);
  assert.match(page,/id="cross-reveal"/);
  assert.match(page,/id="quiz-grade"/);
  assert.match(page,/set:html=\{JSON\.stringify/);
});
test('crossword is a real connected 10-word 14x18 grid with exact solution letters',()=>{
  const block=page.split('const crossword={')[1]?.split('const starts=')[0]||'';
  const rows=[...block.matchAll(/^\s*'([A-Z.]+)',?\s*$/gm)].map(m=>m[1]);
  const words=[...block.matchAll(/\{n:(\d+),w:'([A-Z]+)',r:(\d+),c:(\d+),d:'([ad])'/g)]
    .map(m=>({n:Number(m[1]),w:m[2],r:Number(m[3]),c:Number(m[4]),d:m[5]}));
  assert.equal(rows.length,14);
  rows.forEach(row=>assert.equal(row.length,18));
  assert.equal(words.length,10);
  assert.equal(new Set(words.map(x=>x.n)).size,10);
  const positions=new Map<string,number>();
  let crossings=0;
  for(const word of words){
    for(let i=0;i<word.w.length;i++){
      const r=word.r+(word.d==='d'?i:0),c=word.c+(word.d==='a'?i:0);
      assert.equal(rows[r]?.[c],word.w[i],word.w);
      const key=r+','+c;
      if(positions.has(key))crossings++;
      positions.set(key,(positions.get(key)||0)+1);
    }
  }
  assert.ok(crossings>=9,'expected connected crossings');
});
test('Instructor discovery and commercial separation',()=>{
 const home=readFileSync('src/instructor/pages/instructor/index.astro','utf8');
 const program=readFileSync('src/instructor/pages/instructor/programmi/index.astro','utf8');
 const layout=readFileSync('src/layouts/Instructor.astro','utf8');
 for(const item of [home,program,layout])assert.match(item,/laboratorio-sicurezza/);
 assert.doesNotMatch(page,/formazione-aziende/);
});
