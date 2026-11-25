import test from 'node:test';import assert from 'node:assert/strict';import {scenario,benchmarkRange} from './market.mjs';
test('Rome simulated shock',()=>{const x=scenario({food:3,labor:2,overhead:1,grossPrice:11,vat:10,foodChange:20});assert.ok(Math.abs(x.food-3.6)<1e-10);assert.ok(Math.abs(x.residual-3.4)<1e-10);assert.equal(x.status,'simulated')});
test('missing costs rejected',()=>assert.throws(()=>scenario({food:3,grossPrice:11,vat:10})));
test('benchmark provenance',()=>{const x=benchmarkRange({min:1,prevailing:2,max:3,unit:'EUR/kg',source:'test fixture',date:'2026-11-25',area:'Roma',stage:'wholesale'});assert.equal(x.status,'benchmark')});
test('invalid range rejected',()=>assert.throws(()=>benchmarkRange({min:3,prevailing:2,max:1})));
