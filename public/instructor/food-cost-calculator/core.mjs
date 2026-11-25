// Food Cost Core — EUR, net of recoverable VAT. No implicit zero.
const units={g:['mass',1],kg:['mass',1000],ml:['volume',1],l:['volume',1000],ud:['count',1]};
const valid=x=>typeof x==='number'&&Number.isFinite(x)&&x>=0;
export function convert(q,from,to){if(!valid(q)||!units[from]||!units[to]||units[from][0]!==units[to][0])return null;return q*units[from][1]/units[to][1]}
export function ingredientCost(line,product){
 if(!product||!valid(product.price)||!valid(product.pack)||product.pack===0)return {cost:null,reason:'missing_price_or_pack'};
 let gross=line.gross,derived=false;
 if(!valid(gross)){if(!valid(line.net)||!valid(line.waste)||line.waste>=100)return {cost:null,reason:'missing_quantity_or_yield'};gross=line.net/(1-line.waste/100);derived=true}
 const qty=convert(gross,line.unit,product.unit);
 if(qty===null)return {cost:null,reason:'incompatible_units'};
 const cost=qty/product.pack*product.price;
 return Number.isFinite(cost)?{cost,gross,derived}:{cost:null,reason:'overflow'};
}
export function metrics({cost,portions,grossPrice,vat,target,labor,overhead}){
 const per=valid(cost)&&valid(portions)&&portions>0?cost/portions:null;
 const net=valid(grossPrice)&&valid(vat)?grossPrice/(1+vat/100):null;
 return {perPortion:per,netRevenue:net,foodCostPct:per!==null&&net>0?per/net*100:null,cm1:per!==null&&net!==null?net-per:null,targetGross:per!==null&&valid(target)&&target>0&&target<=100&&valid(vat)?per/(target/100)*(1+vat/100):null,primeCost:per!==null&&valid(labor)?per+labor:null,fullCost:per!==null&&valid(labor)&&valid(overhead)?per+labor+overhead:null};
}
export function recipeCost(id,recipes,resolveProduct,stack=[]){
 if(stack.includes(id))return {cost:null,knownSubtotal:0,issues:['cycle:'+id]};
 const r=recipes.find(x=>x.id===id);if(!r)return {cost:null,knownSubtotal:0,issues:['missing_recipe:'+id]};
 let subtotal=0;const issues=[];let count=0,covered=0;
 for(const [i,line] of (r.ingredients??[]).entries()){count++;const x=ingredientCost(line,resolveProduct(r,i,line));if(x.cost===null)issues.push(i+':'+x.reason);else{subtotal+=x.cost;covered++}}
 for(const sub of r.subrecipes??[]){count++;const child=recipes.find(x=>x.id===sub.id);const x=recipeCost(sub.id,recipes,resolveProduct,[...stack,id]);if(x.cost===null||!valid(child?.servings)||child.servings===0||!valid(sub.portions))issues.push('subrecipe:'+sub.id+':'+x.issues.join(','));else{subtotal+=x.cost/child.servings*sub.portions;covered++}}
 if(!count)issues.push('empty_recipe');if(!Number.isFinite(subtotal))issues.push('overflow');
 return {cost:issues.length?null:subtotal,knownSubtotal:Number.isFinite(subtotal)?subtotal:null,issues,count,covered};
}
