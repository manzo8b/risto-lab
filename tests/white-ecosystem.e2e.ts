import {test,expect} from '@playwright/test';
const root=process.env.LIVE_URL||'http://127.0.0.1:4330/risto-lab';
const paths=['/','/formazione/','/programmi/','/gratuita/','/premium/','/aziende/','/contatti/','/instructor/','/instructor/biblioteca/','/instructor/programmi/il-servizio-in-sala/','/instructor/unita/06-la-mise-en-place/','/instructor/aula/'];
test('all public and instructor entrypoints render on a white page',async({page})=>{
 for(const path of paths){await page.goto(root+path);const color=await page.evaluate(()=>getComputedStyle(document.body).backgroundColor);expect(color,path).toBe('rgb(255, 255, 255)');}
});
test('public mobile menu exposes actual route links',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto(root+'/');
 const menu=page.locator('.rl-mobile-menu');
 await expect(menu).toBeVisible();
 await menu.locator('summary').click();
 await expect(menu.getByRole('link',{name:'Programmi'})).toBeVisible();
 await menu.getByRole('link',{name:'Programmi'}).click();
 await expect(page).toHaveURL(/\/programmi\/$/);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
});
test('program listing distinguishes partial units from classroom ready',async({page})=>{
 await page.goto(root+'/programmi/');
 await expect(page.locator('.rl-unit-link')).toHaveCount(26);
 await expect(page.locator('.rl-unit-link').filter({hasText:'La mise en place'})).toContainText('Parziale');
});
