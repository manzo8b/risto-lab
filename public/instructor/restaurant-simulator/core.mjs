// RISTO-LAB Restaurant Simulator: deterministic monthly model; monetary amounts exclude VAT unless explicitly gross.
export const schema='ristolab.restaurant-scenario/1';
export const fields={seats:[1,100000],turns:[0,20],days:[0,31],occupancy:[0,100],grossTicket:[0,100000],vat:[0,100],foodCostPct:[0,100],otherVariablePerGuest:[0,100000],fixedLabor:[0,1e9],rent:[0,1e9],otherFixed:[0,1e9]};
export function simulate(input){
 if(!input||typeof input!=='object')throw Error('invalid_input');
 for(const [key,[min,max]] of Object.entries(fields)){const n=input[key];if(typeof n!=='number'||!Number.isFinite(n)||n<min||n>max)throw Error('invalid_'+key)}
 if(!Number.isInteger(input.seats)||!Number.isInteger(input.days))throw Error('invalid_integer');
 const capacity=input.seats*input.turns*input.days;
 const guests=capacity*input.occupancy/100;
 const netTicket=input.grossTicket/(1+input.vat/100);
 const netRevenue=guests*netTicket;
 const grossRevenue=guests*input.grossTicket;
 const foodCost=netRevenue*input.foodCostPct/100;
 const otherVariable=guests*input.otherVariablePerGuest;
 const fixed=input.fixedLabor+input.rent+input.otherFixed;
 const contributionPerGuest=netTicket*(1-input.foodCostPct/100)-input.otherVariablePerGuest;
 const contribution=netRevenue-foodCost-otherVariable;
 const operatingResult=contribution-fixed;
 const breakEvenGuests=fixed===0?0:contributionPerGuest>0?Math.ceil(fixed/contributionPerGuest):null;
 const breakEvenOccupancy=breakEvenGuests===null||capacity===0?null:breakEvenGuests/capacity*100;
 return {capacity,guests,netTicket,netRevenue,grossRevenue,foodCost,otherVariable,fixed,contributionPerGuest,contribution,operatingResult,marginPct:netRevenue>0?operatingResult/netRevenue*100:null,breakEvenGuests,breakEvenOccupancy,breakEvenFeasible:breakEvenGuests!==null&&breakEvenGuests<=capacity&&contributionPerGuest>=0};
}
export function compare(base,scenario){const a=simulate(base),b=simulate(scenario);return {base:a,scenario:b,delta:{guests:b.guests-a.guests,netRevenue:b.netRevenue-a.netRevenue,operatingResult:b.operatingResult-a.operatingResult,marginPct:a.marginPct===null||b.marginPct===null?null:b.marginPct-a.marginPct}}}
export function sensitivity(input,steps=[-10,-5,0,5,10]){
 simulate(input);
 return steps.map(points=>{if(!Number.isFinite(points))throw Error('invalid_step');const occupancy=input.occupancy+points;if(occupancy<0||occupancy>100)return {points,occupancy,result:null};return {points,occupancy,result:simulate({...input,occupancy}).operatingResult}})
}
