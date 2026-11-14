import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read=(path:string)=>readFileSync(path,'utf8');
const paths=['legal','privacy','cookie','ai-act'];

test('all four privacy and transparency pages exist and use the same layout',()=>{
 for(const path of paths){
  const content=read('src/instructor/pages/'+path+'.astro');
  assert.match(content, /import LegalPage from/);
  assert.match(content, /<LegalPage title=/);
  assert.match(content, /<\/LegalPage>/);
 }
 const shared=read('src/components/LegalPage.astro');
 for(const path of paths)assert.ok(shared.includes('/'+path+'/'),path);
});
test('public, instructor and PRISMA footers expose the same permanent disclosures',()=>{
 for(const file of ['src/layouts/Public.astro','src/components/InstructorFooter.astro','src/layouts/PrismaKit.astro']){
  const source=read(file);
  for(const path of paths)assert.ok(source.includes("'/"+path+"/'"),file+' -> '+path);
 }
});
test('privacy claims are specific about host security logs and browser storage',()=>{
 const privacy=read('src/instructor/pages/privacy.astro');
 assert.match(privacy,/GitHub Pages/);
 assert.match(privacy,/indirizzi IP/);
 assert.match(privacy,/localStorage/);
 assert.match(privacy,/sessionStorage/);
 assert.match(privacy,/posta elettronica|email/);
 assert.match(privacy,/Marcelo Javier Fernandez Caballero/);
 assert.match(privacy,/Regolamento \(UE\) 2016\/679/);
 const cookie=read('src/instructor/pages/cookie.astro');
 assert.match(cookie,/cookie di profilazione/);
 assert.match(cookie,/localStorage|memoria locale/i);
 assert.match(cookie,/Garante/);
});
test('AI Act disclosure is precise and does not claim blanket certification',()=>{
 const ai=read('src/instructor/pages/ai-act.astro');
 assert.match(ai,/2024\/1689/);
 assert.match(ai,/2 agosto 2026/);
 assert.match(ai,/non una certificazione automatica di conformit/i);
 assert.match(ai,/marcelo2020\.it@gmail\.com/);
 const tool=read('src/instructor/pages/instructor/ai/index.astro');
 assert.match(tool,/Non incollare dati riservati/);
 assert.match(tool,/withBase\('\/ai-act\/'\)/);
});
test('no advertising or paid offer is invented',()=>{
 const legal=read('src/instructor/pages/legal.astro');
 assert.match(legal,/non ospita inserzioni pubblicitarie/);
 assert.match(legal,/opportunit\u00e0 professionali/);
 assert.match(legal,/Marcelo Javier Fernandez Caballero/);
});
