import {test,expect} from '@playwright/test';

const root=process.env.LIVE_URL||'http://127.0.0.1:4330/risto-lab';
const lab=root+'/instructor/laboratorio-sicurezza/';
const teacher=lab+'scheda-docente/';
const cases=lab+'microcasi/';
const lesson=root+'/instructor/laboratorio-sicurezza/lezioni/accordo-stato-regioni-2025/';

test('new resources are linked and lessons show official pinpoint references',async({page,request})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 for(const url of [teacher,cases,lesson])expect((await request.get(url)).status()).toBe(200);
 await page.goto(lab);
 await expect(page.locator('a[href*="scheda-docente/"]').first()).toBeVisible();
 await expect(page.locator('a[href*="microcasi/"]').first()).toBeVisible();
 await page.goto(lesson);
 await expect(page.locator('.norm-reference')).toHaveCount(3);
 await expect(page.locator('.norm-reference a')).toHaveCount(3);
 await expect(page.locator('.faq-update')).toContainText('Quesito');
 await expect(page.locator('.faq-update a')).toHaveAttribute('href',/faq-accordo-stato-regioni/);
 expect(errors).toEqual([]);
});

test('guide is ready for print and rubric is present',async({page})=>{
 await page.goto(teacher);
 await expect(page.locator('h1')).toHaveText('La sicurezza non è una firma');
 await expect(page.locator('.agenda-row')).toHaveCount(6);
 await expect(page.locator('table tbody tr')).toHaveCount(5);
 await expect(page.locator('.answer-words span')).toHaveCount(10);
 const printed=await page.evaluate(()=>{
  let called=false;
  const original=window.print;
  window.print=()=>{called=true;};
  document.querySelector<HTMLButtonElement>('#teacher-print')?.click();
  window.print=original;
  return called;
 });
 expect(printed).toBeTruthy();
});

test('sector microcases offer independent choices with feedback',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(cases);
 await expect(page.locator('.sector-case')).toHaveCount(3);
 const right=['1','2','0'];
 for(let i=0;i<3;i++){
  const sector=page.locator('.sector-case').nth(i);
  await sector.locator('input[value="'+right[i]+'"]').check();
  await sector.locator('.case-check').click();
  await expect(sector.locator('.case-result')).toContainText('Scelta più adeguata');
  await sector.locator('.case-debrief summary').click();
  await expect(sector.locator('.case-debrief')).toHaveAttribute('open','');
 }
 expect(errors).toEqual([]);
});

test('mobile pages do not cause horizontal overflow',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 for(const url of [teacher,cases,lesson]){
  await page.goto(url);
  await expect(page.locator('h1')).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
 }
});
