// Classic menu engineering, category-level, same reporting period.
export function classify(rows,{period,category}={}){
 if(!period||!category||!Array.isArray(rows)||!rows.length)throw Error('invalid_scope');
 const ids=new Set;for(const r of rows){if(!r.id||ids.has(r.id)||r.category!==category||r.period!==period||!Number.isInteger(r.sold)||r.sold<0||typeof r.margin!=='number'||!Number.isFinite(r.margin))throw Error('incomplete_or_invalid_data');ids.add(r.id)}
 const total=rows.reduce((s,r)=>s+r.sold,0);if(!total)throw Error('no_sales');
 const popularityThreshold=.7/rows.length,marginThreshold=rows.reduce((s,r)=>s+r.margin*r.sold,0)/total;
 return {period,category,total,popularityThreshold,marginThreshold,items:rows.map(r=>{const share=r.sold/total,highPopularity=share>=popularityThreshold,highMargin=r.margin>=marginThreshold;return {...r,share,totalContribution:r.margin*r.sold,classification:highPopularity?(highMargin?'star':'plowhorse'):(highMargin?'puzzle':'dog')}})};
}
