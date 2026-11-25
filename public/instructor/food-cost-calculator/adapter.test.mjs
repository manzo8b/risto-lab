import test from 'node:test';import assert from 'node:assert/strict';import {integrate,runCost} from './adapter.mjs';
const a={schema:'ristolab.recipe-archive/1',recipes:[{id:'r',servings:1,ingredients:[{name:'Pasta',gross:100,unit:'g'}],subrecipes:[]}]};
const s={schema:'ristolab.supplier-links/1',currency:'EUR',priceBasis:'net_excluding_vat',products:[{id:'p',pack:1,unit:'kg',price:2,date:'2026-11-20'}],links:[{recipeId:'r',index:0,ingredientName:'Pasta',productId:'p'}]};
test('legacy import',()=>assert.equal(runCost(a,s,'r',{asOf:'2026-11-25'}).result.cost,.2));
test('stale price',()=>assert.equal(runCost(a,s,'r',{asOf:'2027-01-01'}).result.cost,null));
test('future price',()=>assert.equal(runCost(a,s,'r',{asOf:'2026-11-19'}).result.cost,null));
test('historical snapshot',()=>{const x=runCost(a,s,'r',{asOf:'2026-11-19',history:[{productId:'p',date:'2026-11-10',pack:1,unit:'kg',price:3,status:'simulated'}]});assert.ok(Math.abs(x.result.cost-.3)<1e-10);assert.deepEqual(x.sourceStatus,['simulated'])});
test('wrong link',()=>assert.throws(()=>integrate(a,{...s,links:[{...s.links[0],ingredientName:'Other'}]}),/invalid_link/));
test('snapshot isolation',()=>{const x=runCost(a,s,'r',{asOf:'2026-11-25'});assert.notEqual(x.inputs.archive,a);assert.equal(x.used[0].snapshot.status,'unverified')});
