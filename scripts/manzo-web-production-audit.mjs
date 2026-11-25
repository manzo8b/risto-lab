import {readdirSync,readFileSync,writeFileSync,mkdirSync,statSync} from 'node:fs';
import {join,relative} from 'node:path';
const root='dist',walk=p=>readdirSync(p,{withFileTypes:true}).flatMap(d=>d.isDirectory()?walk(join(p,d.name)):[join(p,d.name)]);
const files=walk(root),html=files.filter(p=>p.endsWith('.html')),rows=[];
const strip=s=>s.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
const attr=(tag,k)=>tag.match(new RegExp('\\b'+k+'=["\\\']([^"\\\']*)["\\\']','i'))?.[1]||'';
for(const p of html){const raw=readFileSync(p,'utf8'),markup=raw.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,''),head=markup.match(/<head\b[^>]*>[\s\S]*?<\/head>/i)?.[0]||'',meta=[...head.matchAll(/<meta\b[^>]*>/gi)].map(x=>x[0]),title=strip(head.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1]||''),desc=attr(meta.find(t=>attr(t,'name')==='description')||'','content'),robots=attr(meta.find(t=>attr(t,'name')==='robots')||'','content'),lang=attr(markup.match(/<html\b[^>]*>/i)?.[0]||'','lang'),canonical=attr([...head.matchAll(/<link\b[^>]*>/gi)].map(x=>x[0]).find(t=>attr(t,'rel')==='canonical')||'','href');
 const headings=[...markup.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi)].map(x=>({level:Number(x[1]),text:strip(x[2])}));const images=[...markup.matchAll(/<img\b[^>]*>/gi)].map(x=>x[0]);const issues=[];
 if(!lang)issues.push('missing-lang');if(!title)issues.push('missing-title');if(!meta.some(x=>attr(x,'name')==='viewport'))issues.push('missing-viewport');
 if(!desc&&!/noindex/i.test(robots))issues.push('missing-description');if(!canonical&&!/noindex/i.test(robots))issues.push('missing-canonical');
 if(headings.filter(h=>h.level===1).length!==1)issues.push('h1-count');if(headings.some(h=>h.text.endsWith('.')))issues.push('terminal-period-heading');
 if(images.some(x=>!(/\balt\s*=/.test(x))))issues.push('missing-alt');
 rows.push({path:relative(root,p),bytes:statSync(p).size,title,description:desc,robots,lang,canonical,headingCount:headings.length,issues});
}
const duplicates=key=>Object.entries(rows.reduce((m,r)=>{if(r[key]&&!/noindex/i.test(r.robots))(m[r[key]]??=[]).push(r.path);return m},Object.create(null))).filter(([,v])=>v.length>1).map(([value,paths])=>({value,paths}));
const out={schema:'ristolab.web-production-static-audit/1',scope:'all generated HTML including standalone modules; static checks not compliance certification',pages:rows.length,totalBytes:files.reduce((n,p)=>n+statSync(p).size,0),pagesWithFindings:rows.filter(r=>r.issues.length).length,duplicateTitles:duplicates('title'),duplicateDescriptions:duplicates('description'),rows};
mkdirSync('.local',{recursive:true});writeFileSync('.local/web-production-static.json',JSON.stringify(out,null,2));console.log(JSON.stringify({pages:out.pages,pagesWithFindings:out.pagesWithFindings,duplicateTitles:out.duplicateTitles.length,duplicateDescriptions:out.duplicateDescriptions.length}));
// Inventory findings need contextual review; existing build gate remains mandatory.
