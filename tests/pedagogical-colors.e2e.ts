import {test,expect} from '@playwright/test';

const root=process.env.LIVE_URL||'http://127.0.0.1:4330/risto-lab';
const paths={
 home:root+'/',
 formazione:root+'/formazione/',
 instructor:root+'/instructor/',
 lab:root+'/instructor/laboratorio-sicurezza/',
 lessons:root+'/instructor/laboratorio-sicurezza/lezioni/',
 lesson:root+'/instructor/laboratorio-sicurezza/lezioni/accordo-stato-regioni-2025/',
 teacher:root+'/instructor/laboratorio-sicurezza/scheda-docente/',
 cases:root+'/instructor/laboratorio-sicurezza/microcasi/'
};

test('public pages show purposeful, differentiated learning colors',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(paths.home);
 await expect(page.locator('.editorial-hero')).toBeVisible();
 const hero=await page.locator('.editorial-hero').evaluate(el=>getComputedStyle(el).backgroundImage);
 expect(hero).toContain('linear-gradient');
 const action=await page.locator('.editorial-hero .button:not(.secondary)').evaluate(el=>getComputedStyle(el).backgroundColor);
 expect(action).toBe('rgb(12, 97, 93)');
 await expect(page.locator('.story-bridge')).toBeVisible();
 await page.goto(paths.formazione);
 const bands=await page.locator('.cycle>div').evaluateAll(items=>items.map(el=>getComputedStyle(el).backgroundColor));
 expect(new Set(bands).size).toBeGreaterThanOrEqual(4);
 expect(errors).toEqual([]);
});

test('instructor home and legal teaching paths have visible semantic hierarchy',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(paths.instructor);
 await expect(page.locator('.sidebar')).toBeVisible();
 const sidebar=await page.locator('.sidebar').evaluate(el=>getComputedStyle(el).backgroundImage);
 expect(sidebar).toContain('linear-gradient');
 await page.goto(paths.lessons);
 const cardColors=await page.locator('.lesson-card').evaluateAll(items=>items.map(el=>getComputedStyle(el).backgroundColor));
 expect(new Set(cardColors).size).toBe(5);
 await page.goto(paths.lesson);
 await expect(page.locator('.norm-reference')).toHaveCount(3);
 expect(await page.locator('.lesson-head').getAttribute('data-course-lesson')).toBe('5');
 await page.goto(paths.lab);
 const labHero=await page.locator('.lab-hero').evaluate(el=>getComputedStyle(el).backgroundImage);
 expect(labHero).toContain('linear-gradient');
 await expect(page.locator('#cross-grid')).toBeVisible();
 await page.goto(paths.teacher);
 await expect(page.locator('table tbody tr')).toHaveCount(5);
 await page.goto(paths.cases);
 await expect(page.locator('.sector-case')).toHaveCount(3);
 expect(errors).toEqual([]);
});

test('mobile stays readable with no horizontal overflow after adding colored sections',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 for(const url of Object.values(paths)){
  await page.goto(url);
  await expect(page.locator('h1')).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),url).toBeTruthy();
 }
});
