import {test,expect} from '@playwright/test';
const root=process.env.LIVE_URL||'http://127.0.0.1:4330/risto-lab';

test('homepage main visual is compact and white-first without losing the blue identity',async({page})=>{
 await page.setViewportSize({width:1440,height:900});
 await page.goto(root+'/');
 const hero=page.locator('.rl-home .rl-visual');
 await expect(hero).toBeVisible();
 const metrics=await hero.evaluate(el=>({height:Math.round(el.getBoundingClientRect().height),background:getComputedStyle(el).backgroundImage,borderTop:getComputedStyle(el).borderTopWidth}));
 expect(metrics.height).toBeLessThanOrEqual(365);
 expect(metrics.background).toContain('linear-gradient');
 expect(metrics.background).toContain('rgb(255, 255, 255)');
 expect(parseFloat(metrics.borderTop)).toBeGreaterThanOrEqual(4);
 await expect(page.locator('.rl-home #in-evidenza .rl-course-card')).toHaveCount(3);
 const card=page.locator('.rl-home .rl-course-card').first();
 expect(await card.evaluate(el=>getComputedStyle(el).boxShadow)).not.toBe('none');
 const imageHeight=await card.locator('.rl-card-image').evaluate(el=>el.getBoundingClientRect().height);
 expect(imageHeight).toBeLessThanOrEqual(190);
});
test('separate homepage bands are lighter than saturated blue slabs while remaining identifiable',async({page})=>{
 await page.setViewportSize({width:1440,height:900});
 await page.goto(root+'/');
 for(const id of ['in-evidenza','metodo','formati','docenti']){
  const band=page.locator('#'+id);
  await expect(band).toBeVisible();
  const data=await band.evaluate(el=>({image:getComputedStyle(el).backgroundImage,rail:getComputedStyle(el).borderTopWidth}));
  expect(data.image,id).toContain('linear-gradient');
  expect(data.image,id).toContain('rgb(255, 255, 255)');
  expect(parseFloat(data.rail),id).toBeGreaterThanOrEqual(4);
 }
 const heading=page.locator('#metodo h2');
 await expect(heading).toBeVisible();
 const color=await heading.evaluate(el=>getComputedStyle(el).color);
 expect(color).not.toBe('rgb(255, 255, 255)');
});
test('homepage and resources cards fit phone width and leave the official brand unchanged',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 for(const path of ['/','/risorse/','/formazione/']){
  await page.goto(root+path);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),path).toBeTruthy();
  await expect(page.locator('header .risto-brand-symbol')).toBeVisible();
 }
 await page.goto(root+'/');
 const hero=page.locator('.rl-home .rl-visual');
 expect(await hero.evaluate(el=>el.getBoundingClientRect().height)).toBeLessThanOrEqual(260);
 await expect(page.getByRole('link',{name:'Scopri le risorse libere'})).toBeVisible();
});

test('home keeps a compact editorial rhythm between Hero and Professional Suite',async({page},info)=>{
 for(const width of [390,768,1440]){
  await page.setViewportSize({width,height:900});await page.goto(root+'/');
  const m=await page.evaluate(()=>{const r=(s:string)=>document.querySelector(s)!.getBoundingClientRect();return {heroBottom:r('.rl-public-hero').bottom,sectionTop:r('#strumenti').top,headingTop:r('#strumenti .rl-suite-copy').top,headingBottom:r('#strumenti .rl-suite-intro').bottom,tilesTop:r('#strumenti .rl-white-panel').top,heroContentBottom:Math.max(r('.rl-hero-copy').bottom,r('.rl-visual').bottom),width:innerWidth,scroll:document.documentElement.scrollWidth}});
  expect(m.headingTop-m.heroContentBottom).toBeLessThanOrEqual(70);
  expect(m.tilesTop-m.headingBottom).toBeLessThanOrEqual(24);
  expect(m.scroll).toBeLessThanOrEqual(m.width);
  await expect(page.locator('#strumenti .rl-product-tile')).toHaveCount(7);
  await info.attach('home-rhythm-'+width,{body:await page.screenshot({animations:'disabled',fullPage:true}),contentType:'image/png'});
 }
});

test('Professional Suite fills every row without an orphan right-hand column',async({page},info)=>{
 for(const width of [390,768,1024,1440]){
  await page.setViewportSize({width,height:900});await page.goto(root+'/');
  const data=await page.evaluate(()=>{
   const rect=(s:string)=>document.querySelector(s)!.getBoundingClientRect();
   const grid=rect('#strumenti .rl-product-grid'),intro=rect('#strumenti .rl-suite-intro'),layout=rect('#strumenti .rl-suite-layout'),copy=rect('#strumenti .rl-suite-copy'),cta=rect('#strumenti .rl-suite-intro>a.button');
   const rows: {top:number,left:number,right:number,count:number}[]=[];
   for(const tile of document.querySelectorAll('#strumenti .rl-product-tile')){const r=tile.getBoundingClientRect();let row=rows.find(x=>Math.abs(x.top-r.top)<2);if(!row){row={top:r.top,left:r.left,right:r.right,count:0};rows.push(row)}row.left=Math.min(row.left,r.left);row.right=Math.max(row.right,r.right);row.count++}
   return {rows,gridLeft:grid.left,gridRight:grid.right,introWidth:intro.width,layoutWidth:layout.width,copyLeft:copy.left,copyBottom:copy.bottom,ctaLeft:cta.left,ctaTop:cta.top,scroll:document.documentElement.scrollWidth};
  });
  expect(Math.abs(data.introWidth-data.layoutWidth)).toBeLessThanOrEqual(2);
  expect(Math.abs(data.copyLeft-data.ctaLeft)).toBeLessThanOrEqual(2);
  expect(data.ctaTop).toBeGreaterThanOrEqual(data.copyBottom-2);
  expect(data.rows.map(r=>r.count)).toEqual(width>920?[4,3]:width>550?[2,2,2,1]:[1,1,1,1,1,1,1]);
  for(const row of data.rows){expect(Math.abs(row.left-data.gridLeft)).toBeLessThanOrEqual(2);expect(Math.abs(row.right-data.gridRight)).toBeLessThanOrEqual(2)}
  expect(data.scroll).toBeLessThanOrEqual(width);
  await info.attach('suite-balanced-'+width,{body:await page.locator('#strumenti').screenshot({animations:'disabled'}),contentType:'image/png'});
 }
});
