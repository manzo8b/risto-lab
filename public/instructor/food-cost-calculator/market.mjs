// Territorial scenarios: no automatic substitution of supplier prices.
export const profiles=[
{id:'rome-trattoria',country:'IT',area:'Roma',type:'trattoria'},
{id:'rome-tourism',country:'IT',area:'Roma',type:'tourist restaurant'},
{id:'rome-pizza',country:'IT',area:'Roma',type:'pizzeria'},
{id:'rome-bar',country:'IT',area:'Roma',type:'bar'},
{id:'italy',country:'IT',area:'Italia',type:'general'},
{id:'spain',country:'ES',area:'España',type:'general'}];
export const sources=[
{id:'CAR',area:'Roma',scope:'wholesale produce and fish',status:'benchmark'},
{id:'ISMEA',area:'Italia',scope:'agricultural markets',status:'benchmark'},
{id:'OMI',area:'Italia',scope:'commercial rent ranges',status:'benchmark'},
{id:'ARERA',area:'Italia',scope:'energy market context',status:'benchmark'},
{id:'Mercasa',area:'España',scope:'wholesale markets',status:'benchmark'},
{id:'INE',area:'España',scope:'price indices',status:'benchmark'}];
const valid=x=>typeof x==='number'&&Number.isFinite(x)&&x>=0;
export function scenario({food,labor,overhead,grossPrice,vat,foodChange=0,laborChange=0,overheadChange=0}){
 if(![food,labor,overhead,grossPrice,vat].every(valid)||![foodChange,laborChange,overheadChange].every(x=>Number.isFinite(x)&&x>=-100))throw Error('invalid_scenario');
 const f=food*(1+foodChange/100),l=labor*(1+laborChange/100),o=overhead*(1+overheadChange/100),net=grossPrice/(1+vat/100);
 return {status:'simulated',food:f,labor:l,overhead:o,net,foodCostPct:net>0?f/net*100:null,cm1:net-f,primeCost:f+l,fullCost:f+l+o,residual:net-f-l-o};
}
export function benchmarkRange({min,prevailing,max,unit,source,date,area,stage}){
 if(![min,prevailing,max].every(valid)||min>prevailing||prevailing>max||![unit,source,date,area,stage].every(x=>typeof x==='string'&&x.trim())||!/^\d{4}-\d{2}-\d{2}$/.test(date)||!Number.isFinite(Date.parse(date))||new Date(date).toISOString().slice(0,10)!==date)throw Error('invalid_benchmark');
 return {status:'benchmark',min,prevailing,max,unit,source,date,area,stage};
}
