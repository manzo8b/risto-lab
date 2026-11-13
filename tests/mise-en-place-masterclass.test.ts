import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const html=readFileSync(new URL('../public/materiali/mise-en-place-masterclass.html',import.meta.url),'utf8');
const catalog=JSON.parse(readFileSync(new URL('../src/instructor/data/catalog.public.json',import.meta.url),'utf8'));
const unitPage=readFileSync(new URL('../src/instructor/pages/instructor/unita/[slug].astro',import.meta.url),'utf8');

test('mise en place masterclass has twelve semantic, labelled slides',()=>{
  assert.equal((html.match(/aria-roledescription="slide"/g)||[]).length,12);
  assert.equal((html.match(/<h2 tabindex="-1">/g)||[]).length,12);
  assert.match(html,/lang="it"/);
  assert.match(html,/role="status" aria-live="polite"/);
});

test('masterclass supports controlled keyboard navigation without autoplay',()=>{
  for(const key of ['ArrowRight','ArrowLeft','Home','End'])assert.ok(html.includes(key),key);
  assert.match(html,/id="prev"/);assert.match(html,/id="next"/);
  assert.match(html,/prefers-reduced-motion:reduce/);
  assert.doesNotMatch(html,/setInterval\s*\(/);
});

test('Unit 06 links to the deck without claiming course completion',()=>{
  const unit=catalog.units.find((u:{order:number})=>u.order===6);
  assert.equal(unit.status,'PARTIAL');
  assert.ok(unit.objectives.length>=5);
  assert.ok(unit.objectives.some((x:string)=>/Controllare/.test(x)));
  assert.match(unitPage,/mise-en-place-masterclass\.html/);
  assert.match(unitPage,/unità rimane PARTIAL/);
});
