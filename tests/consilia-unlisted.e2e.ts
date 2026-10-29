import {test,expect} from '@playwright/test';

const origin=process.env.LIVE_URL||'http://127.0.0.1:4330/risto-lab';
const root=origin+'/atelier/prisma-hse-q7m4v9n2/';
const pages=['','progetto/','slide/','attivita/','docente/','valutazione/'];

test('all six kit routes exist, noindexed, no ordinary public navigation',async({page,request})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 for(const path of pages){
  const response=await request.get(root+path);
  expect(response.status(),root+path).toBe(200);
  await page.goto(root+path);
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('meta[name=robots]')).toHaveAttribute('content',/noindex/);
  await expect(page.locator('meta[name=referrer]')).toHaveAttribute('content','no-referrer');
  await expect(page.locator('.prisma-nav a')).toHaveCount(6);
  await expect(page.locator('.topbar,.sidebar')).toHaveCount(0);
 }
 expect((await request.get(origin+'/atelier/scheda-pc4m8q2/')).status()).toBe(404);
 await page.goto(origin+'/');
 expect(await page.locator('a[href*="prisma-hse-q7m4v9n2"]').count()).toBe(0);
 expect(errors).toEqual([]);
});

test('slide deck has 12 steps, explanations, projector button and printable deck',async({page})=>{
 await page.goto(root+'slide/');
 await expect(page.locator('.prisma-slide')).toHaveCount(12);
 await expect(page.locator('#position')).toHaveText('Slide 1 di 12');
 await page.locator('#next').click();
 await expect(page.locator('#position')).toHaveText('Slide 2 di 12');
 await page.locator('#notes-toggle').click();
 await expect(page.locator('#lecturer-notes')).toBeVisible();
 await expect(page.locator('#note-content')).not.toBeEmpty();
 await page.locator('#prev').click();
 await expect(page.locator('#position')).toHaveText('Slide 1 di 12');
 const printed=await page.evaluate(()=>{
  const p=window.print;let called=false;window.print=()=>{called=true;};
  document.querySelector<HTMLButtonElement>('#print-slides')?.click();
  window.print=p;return called;
 });
 expect(printed).toBe(true);
});

test('three scenarios, gossip and worksheet feedback work without backend',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(root+'attivita/');
 await expect(page.locator('.prisma-check')).toHaveCount(4);
 await page.locator('input[name=gossip][value="1"]').check();
 await page.locator('.prisma-check').first().locator('button').click();
 await expect(page.locator('.prisma-check').first().locator('.prisma-feedback')).toContainText('Scelta adeguata');
 for(const [i,n] of [1,0,2].entries()){
  const field=page.locator('.prisma-check').nth(i+1);
  await field.locator('input[value="'+n+'"]').check();
  await field.locator('button').click();
  await expect(field.locator('.prisma-feedback')).toContainText('Scelta adeguata');
 }
 await page.locator('#example-work').click();
 await expect(page.locator('#goal')).not.toBeEmpty();
 expect(errors).toEqual([]);
});

test('12-question assessment, reset and analytic rubric are interactive',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(root+'valutazione/');
 await expect(page.locator('.bank-question')).toHaveCount(12);
 await page.locator('input[name=q0][value="1"]').check();
 await page.locator('#grade').click();
 await expect(page.locator('#quiz-result')).toContainText('corrette 1/12');
 await page.locator('button[type=reset]').click();
 await expect(page.locator('#quiz-result')).toBeEmpty();
 for(let i=0;i<5;i++)await page.locator('input[name="rubric-'+i+'"][value="2"]').check();
 await page.locator('#score-rubric').click();
 await expect(page.locator('#rubric-result')).toContainText('punteggio 10/10');
 expect(errors).toEqual([]);
});

test('desktop and mobile avoid body-level horizontal overflow',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 for(const width of [1280,390]){
  await page.setViewportSize({width,height:844});
  for(const path of pages){
   await page.goto(root+path);
   await expect(page.locator('h1')).toBeVisible();
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),path+' @ '+width).toBeTruthy();
  }
 }
 expect(errors).toEqual([]);
});
