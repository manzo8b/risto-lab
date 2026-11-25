import test from 'node:test';
import assert from 'node:assert/strict';
import {configureLanguages,translationIssues,languages} from './languages.mjs';
import {publicMenu} from './core.mjs';

const item={id:'x',approved:true,name:{it:'Pasta',en:'Pasta'},category:{it:'Primi',en:'First courses'},description:{it:'Pomodoro',en:'Tomato'},grossPrice:10,internalCost:4,allergenReview:{status:'validated',reference:'fixture',codes:[3,1,3]},translationReview:{it:{status:'validated',reference:'fixture-it'},en:{status:'validated',reference:'fixture-en'}}};

test('twelve languages and RTL support',()=>{assert.equal(languages.length,12);assert.deepEqual(configureLanguages('it',['ar','en'],'combined').directions,{it:'ltr',ar:'rtl',en:'ltr'})});
test('duplicate or excessive languages rejected',()=>{assert.throws(()=>configureLanguages('it',['it']));assert.throws(()=>configureLanguages('it',['en','es','fr']));assert.throws(()=>configureLanguages('it',[],'unknown'))});
test('validated translations pass all selected languages',()=>assert.deepEqual(translationIssues([item],configureLanguages('it',['en'])),[]));
test('unreviewed translations and missing fields block gate',()=>{const x=translationIssues([item],configureLanguages('it',['es']));assert.equal(x.length,4);assert.ok(x.some(i=>i.code==='review_required'))});
test('public projection excludes internal data and deduplicates codes',()=>{const x=publicMenu({items:[item]},'en');assert.deepEqual(x.items[0].allergens,[1,3]);assert.equal(x.items[0].internalCost,undefined);assert.equal(x.readyForReview,true)});
test('invalid or pending allergen evidence prevents readiness',()=>{for(const review of [{status:'validated',reference:'',codes:[1]},{status:'validated',reference:'fixture',codes:[15]},{status:'pending',codes:[1]}])assert.equal(publicMenu({items:[{...item,allergenReview:review}]}).readyForReview,false)});
test('empty approved projection cannot pass',()=>assert.equal(publicMenu({items:[{...item,approved:false}]}).readyForReview,false));
test('price and duplicate ID validation',()=>{assert.throws(()=>publicMenu({items:[{...item,grossPrice:-1}]}));assert.throws(()=>publicMenu({items:[item,item]}))});
