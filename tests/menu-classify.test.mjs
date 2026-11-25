import test from 'node:test';import assert from 'node:assert/strict';import {classify} from '../public/instructor/menu-engineering-dashboard/core.mjs';
const rows=[['a',40,10],['b',40,2],['c',10,10],['d',10,2]].map(([id,sold,margin])=>({id,sold,margin,category:'pasta',period:'2026-11'}));
const opts={category:'pasta',period:'2026-11'};
test('four quadrants',()=>assert.deepEqual(classify(rows,opts).items.map(x=>x.classification),['star','plowhorse','puzzle','dog']));
test('weighted margin',()=>assert.equal(classify(rows,opts).marginThreshold,6));
test('missing margin',()=>assert.throws(()=>classify([{...rows[0],margin:null}],opts)));
test('mixed category',()=>assert.throws(()=>classify([...rows,{...rows[0],id:'e',category:'pizza'}],opts)));
test('zero sales',()=>assert.throws(()=>classify(rows.map(x=>({...x,sold:0})),opts)));
