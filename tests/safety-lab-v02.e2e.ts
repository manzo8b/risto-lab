import {test,expect} from '@playwright/test';

const url=(process.env.LIVE_URL||'http://127.0.0.1:4330/risto-lab')+'/instructor/laboratorio-sicurezza/';

test('Safety lab slide deck, roles, glossary, crossword and quiz function in browser',async({page})=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url);
  await expect(page.locator('h1')).toContainText('La sicurezza non è una firma');
  await expect(page.locator('#slide-count')).toHaveText('Slide 1 / 6');
  await page.locator('#slide-next').click();
  await expect(page.locator('#slide-count')).toHaveText('Slide 2 / 6');
  await page.locator('#slide-prev').click();
  await expect(page.locator('#slide-count')).toHaveText('Slide 1 / 6');

  await page.locator('#roles-activity select').first().selectOption('preposto');
  await page.locator('#roles-check').click();
  await expect(page.locator('#roles-result')).toContainText('corretti 1/4');

  await page.locator('input[name="gossip"][value="1"]').check();
  await page.locator('#gossip-check').click();
  await expect(page.locator('#gossip-feedback')).toContainText('Corretto');

  await page.locator('#term-search').fill('RSPP');
  await expect(page.locator('#term-count')).toContainText('1 termini');
  await page.locator('#term-search').clear();

  await expect(page.locator('.cross-input')).not.toHaveCount(0);
  await page.locator('.cross-input').first().fill('A');
  await page.locator('#cross-check').click();
  await expect(page.locator('#cross-result')).toContainText('Caselle corrette');
  await page.locator('#cross-reveal').click();
  await expect(page.locator('#cross-result')).toContainText('Soluzione visualizzata');
  await page.locator('#cross-reset').click();
  await expect(page.locator('.cross-input').first()).toHaveValue('');

  await page.locator('input[name="q0"][value="1"]').check();
  await page.locator('#quiz-grade').click();
  await expect(page.locator('#quiz-score')).toContainText('corrette 1/6');
  expect(errors).toEqual([]);
});

test('Safety lab remains usable on narrow mobile viewport without page overflow',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto(url);
  await expect(page.locator('#cross-grid')).toBeVisible();
  await expect(page.locator('h1')).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
});
