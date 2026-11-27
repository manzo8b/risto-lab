import {test,expect} from '@playwright/test';
import {readFileSync} from 'node:fs';
const root=process.env.LIVE_URL||'http://127.0.0.1:4330/risto-lab';
const paths=['/','/formazione/','/programmi/','/risorse/','/gratuita/','/premium/','/aziende/','/esperienza/','/contatti/','/area-docente/','/legal/','/privacy/','/cookie/','/ai-act/','/instructor/','/instructor/biblioteca/','/instructor/aula/','/instructor/professional-suite/','/instructor/recipe-manager/','/instructor/supplier-manager/','/instructor/menu-engineering/matrice-allergeni/','/instructor/food-cost-calculator/','/instructor/menu-engineering-dashboard/','/instructor/menu-design-studio/','/instructor/restaurant-simulator/'];
test('MANZO full-site representative browser evidence',async({page},info)=>{
 test.setTimeout(180000);
 const findings=[];const axe=readFileSync('node_modules/axe-core/axe.min.js','utf8');
 for(const route of paths){
  await page.setViewportSize({width:390,height:844});
  const response=await page.goto(root+route);expect(response?.ok(),route).toBe(true);
  await page.addScriptTag({content:axe});
  const result=await page.evaluate(async()=>{const a=await (window as any).axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa']}});const nav=performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;return {lang:document.documentElement.lang,title:document.title,width:innerWidth,scrollWidth:document.documentElement.scrollWidth,domContentLoadedMs:nav?.domContentLoadedEventEnd,violations:a.violations.map((v:any)=>({id:v.id,impact:v.impact,count:v.nodes.length,targets:v.nodes.slice(0,3).map((n:any)=>n.target)}))}});
  findings.push({route,...result});
 }
 await info.attach('manzo-browser-audit',{body:JSON.stringify({scope:'25 representative routes; Chromium 390px; axe subset; not Lighthouse or WCAG certification',findings},null,2),contentType:'application/json'});
 console.log('MANZO browser evidence '+JSON.stringify({routes:findings.length,overflow:findings.filter(x=>x.scrollWidth>x.width).map(x=>x.route),axeViolations:findings.map(x=>({route:x.route,count:x.violations.length})).filter(x=>x.count)}));
 expect(findings.flatMap(x=>x.violations.map((v:{id:string;impact:string|null;count:number;targets:unknown[]})=>({route:x.route,...v}))),'All 25 representative routes must pass the selected axe WCAG rules').toEqual([]);
});
test('home seven tools and legal disclosures remain consistent',async({page})=>{
 await page.goto(root+'/');await expect(page.locator('#strumenti .rl-feature')).toHaveCount(7);
 await expect(page.locator('#strumenti')).toContainText('Sette strumenti');
 await page.goto(root+'/legal/');await expect(page.getByRole('heading',{name:'Strumenti professionali e sicurezza alimentare'})).toBeVisible();
 await page.goto(root+'/privacy/');await expect(page.getByRole('heading',{name:'Professional Suite e importazioni'})).toBeVisible();
});

test('Apple Design shared stylesheet is loaded across public, instructor and operational entrypoints',async({page},info)=>{
 test.setTimeout(180000);
 const routes=[...paths,'/instructor/menu-engineering/','/instructor/programmi/il-servizio-in-sala/','/instructor/unita/06-la-mise-en-place/','/instructor/laboratorio-sicurezza/','/instructor/laboratorio-sicurezza/lezioni/','/instructor/cerca/','/instructor/sessioni/'];
 for(const width of [390,1440]){
  await page.setViewportSize({width,height:900});
  for(const route of routes){
   const res=await page.goto(root+route);expect(res?.ok(),route).toBe(true);
   const revision=await page.evaluate(()=>getComputedStyle(document.documentElement).getPropertyValue('--rl-design-revision').trim());
   expect(revision,route).toBe(route.includes('/instructor/')&&await page.locator('.rl-suite-nav').count()?'apple-excellence-1-1':'apple-excellence-1-2');
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),route+' '+width).toBeTruthy();
   if(['/', '/risorse/', '/instructor/', '/instructor/aula/', '/instructor/menu-engineering/', '/instructor/menu-engineering-dashboard/', '/instructor/menu-design-studio/'].includes(route)){
    const name=(route==='/'?'home':route.replace(/^\//,'').replaceAll('/','-').replace(/-$/,''))+'-'+width;
    await info.attach(name,{body:await page.screenshot({animations:'disabled',fullPage:false}),contentType:'image/png'});
   }
  }
 }
});

test('public typography uses one hierarchy, and the Home visual uses the landscape teaching asset',async({page},info)=>{
 for(const width of [390,1440]){
  await page.setViewportSize({width,height:900});
  await page.goto(root+'/');
  const styles=await page.evaluate(()=>{const read=(selector:string)=>{const el=document.querySelector(selector)!;const c=getComputedStyle(el);return {font:c.fontFamily,weight:c.fontWeight,size:parseFloat(c.fontSize),tracking:parseFloat(c.letterSpacing)}};return {hero:read('#rl-home-title'),suite:read('#home-suite-title'),method:read('#metodo h2'),resources:read('#in-evidenza h2'),card:read('#in-evidenza h3')}});
  expect(styles.hero.font).toBe(styles.suite.font);expect(styles.hero.weight).toBe(styles.suite.weight);
  expect(styles.suite.size).toBe(styles.method.size);expect(styles.method.size).toBe(styles.resources.size);
  expect(styles.hero.size).toBeGreaterThan(styles.suite.size);expect(styles.suite.size).toBeGreaterThan(styles.card.size);
  const img=page.locator('.rl-home .rl-visual img');await expect(img).toHaveAttribute('src',/res-mep-table\.webp$/);
  expect(await img.evaluate((el:HTMLImageElement)=>el.complete&&el.naturalWidth>el.naturalHeight)).toBeTruthy();
  await info.attach('home-type-'+width,{body:await page.screenshot({animations:'disabled',fullPage:true}),contentType:'image/png'});
  await page.goto(root+'/materiali/mise-en-place-masterclass.html');
  expect(await page.evaluate(()=>getComputedStyle(document.documentElement).getPropertyValue('--rl-design-revision').trim())).toBe('apple-excellence-1-2');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
 }
});

test('keyboard can reach and scroll both named operational tables',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 for(const [route,selector] of [['/instructor/supplier-manager/','.tablewrap'],['/instructor/restaurant-simulator/','.scroll']]){
  await page.goto(root+route);const region=page.locator(selector);await expect(region).toHaveAttribute('tabindex','0');await expect(region).toHaveAttribute('role','region');
  const heading=await region.getAttribute('aria-labelledby');expect(heading).toBeTruthy();await expect(page.locator('#'+heading)).not.toBeEmpty();
  await region.focus();await expect(region).toBeFocused();
  const size=await region.evaluate(e=>({client:e.clientWidth,scroll:e.scrollWidth}));expect(size.scroll).toBeGreaterThan(size.client);
  await page.keyboard.press('ArrowRight');await expect.poll(()=>region.evaluate(e=>e.scrollLeft)).toBeGreaterThan(0);
  await page.keyboard.press('Tab');await expect(region).not.toBeFocused();
 }
});
