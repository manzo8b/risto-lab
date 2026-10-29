import {test,expect} from '@playwright/test';

const root=process.env.LIVE_URL||'http://127.0.0.1:4330/risto-lab';
const mystery=root+'/atelier/scheda-pc4m8q2/';

test('unlisted Consilia portfolio loads without site navigation or indexability',async({page,request})=>{
 const errors:string[]=[];
 page.on('pageerror',error=>errors.push(error.message));
 const resp=await request.get(mystery);
 expect(resp.status()).toBe(200);
 await page.goto(mystery);
 await expect(page.locator('h1')).toContainText('CONSILIA');
 await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content','noindex,nofollow,noarchive,nosnippet');
 await expect(page.locator('meta[name="googlebot"]')).toHaveAttribute('content',/noindex/);
 await expect(page.locator('nav.nav')).toHaveCount(0);
 await expect(page.locator('.storyboard article')).toHaveCount(5);
 await expect(page.locator('.quiz-question')).toHaveCount(4);
 await expect(page.locator('.agenda-row')).toHaveCount(8);
 expect(errors).toEqual([]);
});

test('scenario and four-question self-check provide contextual feedback',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(mystery);
 await page.locator('input[name="scenario"][value="b"]').check();
 await page.locator('#check-scenario').click();
 await expect(page.locator('#scenario-feedback')).toContainText('Scelta appropriata');
 for(const [i,v] of ['1','2','0','1'].entries())await page.locator('input[name="q'+i+'"][value="'+v+'"]').check();
 await page.locator('#check-quiz').click();
 await expect(page.locator('#quiz-total')).toContainText('risposte corrette 4/4');
 await expect(page.locator('.item-feedback')).toHaveCount(4);
 await page.getByRole('button',{name:'Ricomincia'}).click();
 await expect(page.locator('#quiz-total')).toBeEmpty();
 expect(errors).toEqual([]);
});

test('project has no mobile horizontal overflow and print interaction is wired',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto(mystery);
 await expect(page.locator('h1')).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
 const called=await page.evaluate(()=>{
  let done=false;
  const previous=window.print;
  window.print=()=>{done=true;};
  document.querySelector<HTMLButtonElement>('#print-project')?.click();
  window.print=previous;
  return done;
 });
 expect(called).toBe(true);
});
