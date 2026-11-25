import test from 'node:test';import assert from 'node:assert/strict';import {publicMenu} from './core.mjs';
const item={id:'r1',approved:true,name:{it:'Pasta',es:'Pasta',en:'Pasta'},category:{it:'Primi',es:'Primeros',en:'First courses'},grossPrice:12,cost:3,margin:9,allergenReview:{status:'validated',reference:'fixture',codes:[1,3]}};
test('allowlist',()=>{const x=publicMenu({items:[item]}).items[0];assert.equal(x.cost,undefined);assert.equal(x.margin,undefined);assert.deepEqual(x.allergens,[1,3])});
test('pending allergens',()=>assert.equal(publicMenu({items:[{...item,allergenReview:{status:'pending',codes:[1]}}]}).readyForReview,false));
test('unapproved excluded',()=>assert.equal(publicMenu({items:[{...item,approved:false}]}).items.length,0));
test('missing translation rejected',()=>assert.throws(()=>publicMenu({items:[{...item,name:{it:'Pasta'}}]},'en')));
