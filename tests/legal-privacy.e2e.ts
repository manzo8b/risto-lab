import {test,expect} from '@playwright/test';
const root=process.env.LIVE_URL||'http://127.0.0.1:4330/risto-lab';
const sections=['legal','privacy','cookie','ai-act'];

test('all legal pages load, stay readable, and cross-link each other on mobile',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 for(const path of sections){
  await page.goto(root+'/'+path+'/');
  await expect(page.locator('main h1')).toBeVisible();
  await expect(page.locator('.legal-document section').first()).toBeVisible();
  await expect(page.locator('.legal-nav a')).toHaveCount(4);
  await expect(page.locator('.legal-nav a[aria-current="page"]')).toHaveCount(1);
  const reflow=await page.evaluate(()=>({viewport:innerWidth,width:document.documentElement.scrollWidth}));
  expect(reflow.width<=reflow.viewport,JSON.stringify({path,reflow})).toBeTruthy();
 }
});
test('permanent links from both Public and Instructor are discoverable',async({page})=>{
 await page.goto(root+'/');
 await expect(page.locator('.rl-legal-footer .rl-legal-links a')).toHaveCount(4);
 await page.locator('.rl-legal-footer .rl-legal-links').getByRole('link',{name:'Privacy'}).click();
 await expect(page).toHaveURL(/\/privacy\/$/);
 await page.goto(root+'/instructor/');
 for(const label of ['Note legali','Privacy','Cookie','Trasparenza AI']){
  await expect(page.locator('.instructor-footer').getByRole('link',{name:label})).toBeVisible();
 }
 await page.goto(root+'/instructor/ai/');
 await expect(page.getByRole('link',{name:/Come utilizziamo l'AI/})).toBeVisible();
});
test('legal page is white, navy, and usable by keyboard',async({page})=>{
 await page.goto(root+'/legal/');
 const bg=await page.evaluate(()=>getComputedStyle(document.body).backgroundColor);
 expect(bg).toBe('rgb(255, 255, 255)');
 const links=page.locator('.legal-nav a');
 await links.first().focus();
 expect(await links.first().evaluate(el=>el===document.activeElement)).toBeTruthy();
});
