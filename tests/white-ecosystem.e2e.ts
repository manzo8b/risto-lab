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

test('200 percent typography preserves horizontal reflow on instructor workflows',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 for(const path of ['/instructor/','/instructor/sessioni/nuova/?unit=unit-06','/instructor/unita/24-simulazioni-operative/']){
  await page.goto(root+path);
  await page.evaluate(()=>document.documentElement.style.fontSize='200%');
  const geometry=await page.evaluate(()=>{
   const vw=innerWidth;
   const htmlWidth=document.documentElement.scrollWidth;
   const offenders=Array.from(document.querySelectorAll('*')).filter(el=>{
    const x=el.getBoundingClientRect();
    return x.width>0&&(x.right>vw+1||x.left< -1);
   }).slice(0,12).map(el=>({tag:el.tagName,cls:String(el.className).slice(0,80),right:Math.round(el.getBoundingClientRect().right)}));
   const sectors=['.sidebar','.hubbody','.hubcontent','.hubmain','#teaching-form','.workflow-columns','.builder-guide','.teaching-toolbar','.session-timing','#session-resources','.metadata-fields'];
   const regions=sectors.map(sel=>{const el=document.querySelector(sel);if(!el)return null;const b=el.getBoundingClientRect();return {sel,left:Math.round(b.left),right:Math.round(b.right),width:Math.round(b.width),scroll:el.scrollWidth,client:el.clientWidth};}).filter(Boolean);
   const outer=Array.from(document.querySelectorAll('*')).filter(el=>{const b=el.getBoundingClientRect();if(!(b.width>0&&b.right>vw+1))return false;for(let parent=el.parentElement;parent;parent=parent.parentElement){const sx=getComputedStyle(parent).overflowX;if(['auto','scroll'].includes(sx)&&parent.scrollWidth>parent.clientWidth)return false;}return true;}).slice(0,20).map(el=>({tag:el.tagName,cls:typeof el.className==='string'?el.className.slice(0,70):'',right:Math.round(el.getBoundingClientRect().right)}));
   return {viewport:vw,width:htmlWidth,offenders,regions,outer};
  });
  expect(geometry.width<=geometry.viewport,JSON.stringify({path,geometry})).toBeTruthy();
 }
});
