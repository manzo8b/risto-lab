import {test,expect} from '@playwright/test';
import {safetyLessons} from '../src/instructor/data/safety-course';
const root=process.env.LIVE_URL||'http://127.0.0.1:4330/risto-lab';
const base=root+'/instructor/laboratorio-sicurezza/lezioni/';

test('index and five published lesson pages are reachable with normative links',async({page,request})=>{
 const errors:string[]=[];
 page.on('pageerror',error=>errors.push(error.message));
 await page.goto(base);
 await expect(page.locator('h1')).toContainText('Conoscere la sicurezza');
 await expect(page.locator('.lesson-card')).toHaveCount(5);
 for(const lesson of safetyLessons){
  const url=base+lesson.slug+'/';
  expect((await request.get(url)).status()).toBe(200);
  await page.goto(url);
  await expect(page.locator('h1')).toHaveText(lesson.title);
  await expect(page.locator('.lesson-part')).toHaveCount(3);
  await expect(page.locator('.lesson-q')).toHaveCount(3);
  await expect(page.getByRole('link',{name:/D\.Lgs\. 9 aprile 2008/})).toHaveAttribute('href',/normattiva/);
  await expect(page.getByRole('link',{name:/Accordo Stato-Regioni 17 aprile 2025/})).toHaveAttribute('href',/lavoro\.gov\.it/);
  await page.locator('.scenario summary').click();
  await expect(page.locator('.scenario details')).toHaveAttribute('open','');
 }
 expect(errors).toEqual([]);
});

test('interactive self-assessment is correctable, explained and reset',async({page})=>{
 await page.goto(base+safetyLessons[0].slug+'/');
 await page.locator('input[name="q0"][value="1"]').check();
 await page.locator('#grade-lesson').click();
 await expect(page.locator('#lesson-score')).toContainText('corrette: 1/3');
 await expect(page.locator('.q-feedback').first()).toContainText('Corretto');
 await page.getByRole('button',{name:'Ricomincia'}).click();
 await expect(page.locator('#lesson-score')).toBeEmpty();
 await expect(page.locator('input[name="q0"]:checked')).toHaveCount(0);
});

test('mobile lesson index and pages avoid horizontal overflow',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 for(const path of [base,base+safetyLessons[4].slug+'/']){
  await page.goto(path);
  await expect(page.locator('h1')).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
 }
});
