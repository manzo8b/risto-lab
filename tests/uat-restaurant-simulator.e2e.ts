import {test,expect} from '@playwright/test';
import {readFile} from 'node:fs/promises';
const root=process.env.LIVE_URL;
if(!root) throw new Error('LIVE_URL required for production UAT');
const route=root+'/instructor/restaurant-simulator/';
const base={seats:40,turns:2,days:25,occupancy:60,grossTicket:33,vat:10,foodCostPct:30,otherVariablePerGuest:2,fixedLabor:12000,rent:3000,otherFixed:2000};
async function download(page:import('@playwright/test').Page,id:string,name:string){const wait=page.waitForEvent('download');await page.locator(id).click();const d=await wait;expect(d.suggestedFilename()).toBe(name);const p=await d.path();if(!p)throw Error('Missing download');return readFile(p);}
test('UAT-07: independent monthly model, price versus occupancy, sensitivity, break-even and JSON roundtrip',async({page})=>{
 await page.goto(route);await page.locator('.rl-suite-guide summary').click();await expect(page.locator('.rl-suite-guide ol li')).toHaveCount(4);
 for(const [k,v] of Object.entries(base))await page.locator('#base-'+k).fill(String(v));
 await page.locator('#copy').click();
 const read=async()=>JSON.parse((await download(page,'#save','restaurant-scenario.json')).toString());
 let out=await read();expect(out.source).toBe('user_assumptions');
 const expected={capacity:2000,guests:1200,netTicket:30,netRevenue:36000,grossRevenue:39600,foodCost:10800,otherVariable:2400,fixed:17000,contributionPerGuest:19,contribution:22800,operatingResult:5800,marginPct:5800/36000*100,breakEvenGuests:895,breakEvenOccupancy:44.75};
 for(const [k,v] of Object.entries(expected))expect(out.results.base[k],k).toBeCloseTo(v,8);
 expect(out.results.scenario).toEqual(out.results.base);expect(out.results.scenario.breakEvenFeasible).toBe(true);
 expect(out.sensitivity.map((r:any)=>r.result)).toEqual([2000,3900,5800,7700,9600]);
 await page.locator('#scenario-grossTicket').fill('36.3');out=await read();
 expect(out.results.scenario.guests).toBe(1200);expect(out.results.scenario.netRevenue).toBeCloseTo(39600,8);expect(out.results.scenario.operatingResult).toBeCloseTo(8320,8);
 await page.locator('#scenario-occupancy').fill('50');out=await read();
 expect(out.results.scenario.guests).toBe(1000);expect(out.results.scenario.netRevenue).toBeCloseTo(33000,8);expect(out.results.scenario.operatingResult).toBeCloseTo(4100,8);expect(out.results.delta.operatingResult).toBeCloseTo(-1700,8);
 const csv=(await download(page,'#csv','restaurant-risultati.csv')).toString();expect(csv).toContain('Risultato operativo');
 const raw=await download(page,'#save','restaurant-scenario.json');await page.reload();await page.locator('#import').setInputFiles({name:'scenario.json',mimeType:'application/json',buffer:raw});await expect(page.locator('#scenario-occupancy')).toHaveValue('50');expect((await read()).results).toEqual(out.results);
 await page.locator('#scenario-occupancy').fill('');await expect(page.locator('#save')).toBeDisabled();await expect(page.locator('#csv')).toBeDisabled();await expect(page.locator('#metrics .metric')).toHaveCount(0);
});
test('UAT-07: unreachable break-even, zero revenue, bounded sensitivity and responsive layout',async({page})=>{
 await page.goto(route);for(const [k,v] of Object.entries(base))await page.locator('#base-'+k).fill(String(v));await page.locator('#copy').click();
 const read=async()=>JSON.parse((await download(page,'#save','restaurant-scenario.json')).toString()).results.scenario;
 await page.locator('#scenario-occupancy').fill('0');let out=await read();expect(out.netRevenue).toBe(0);expect(out.operatingResult).toBe(-17000);expect(out.marginPct).toBeNull();await expect(page.locator('#sensitivity')).toContainText('Fuori limite');
 await page.locator('#scenario-foodCostPct').fill('100');out=await read();expect(out.breakEvenGuests).toBeNull();expect(out.breakEvenFeasible).toBe(false);await expect(page.locator('#be')).toContainText('contribuzione unitaria non positiva');
 await page.locator('#scenario-foodCostPct').fill('30');await page.locator('#scenario-fixedLabor').fill('100000');out=await read();expect(out.breakEvenGuests).toBeGreaterThan(out.capacity);expect(out.breakEvenFeasible).toBe(false);await expect(page.locator('#be')).toContainText('entro la capacità');
 for(const width of [360,390,768,1440]){await page.setViewportSize({width,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);}
});
