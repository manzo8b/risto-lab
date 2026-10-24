import {resources,units,program} from '../instructor/data/catalog';
import {currentInstructor} from './instructor-profile';
import type {TeachingSession} from './teaching';
import {readPlans,normalizePlan,DRAFT_KEY} from './session-storage';
import {buildAIContext,aiTasks,type AITask} from './ai-context';
import {withBase} from './urls';
const el=<T extends HTMLElement=HTMLElement>(id:string)=>document.getElementById(id) as T;
const unit=el<HTMLSelectElement>('ai-unit'),resource=el<HTMLSelectElement>('ai-resource'),task=el<HTMLSelectElement>('ai-task'),request=el<HTMLTextAreaElement>('ai-request'),preview=el<HTMLTextAreaElement>('ai-preview'),params=new URLSearchParams(location.search);
let session:TeachingSession|undefined;
try{session=params.get('draft')==='1'?normalizePlan(JSON.parse(localStorage.getItem(DRAFT_KEY)||'null')):readPlans().find(p=>p.id===params.get('session'));}catch{el('ai-copy-status').textContent='La lezione non è disponibile in questo browser. Puoi continuare con unità e materiale.';}
unit.value=params.get('unit')||session?.unit_ids[0]||'';
task.value=Object.hasOwn(aiTasks,params.get('task')||'')?params.get('task')!:'lesson';
request.value=params.get('request')?.slice(0,6000)||'';
let lastPreset='';
function chooseResources(selected=''){resource.replaceChildren(new Option('Nessun materiale selezionato',''));for(const r of resources.filter(r=>!unit.value||r.unit_ids.includes(unit.value)||r.id===selected))resource.add(new Option(r.title,r.id));resource.value=selected;}
function update(){
 const u=units.find(u=>u.id===unit.value),r=resources.find(r=>r.id===resource.value);
 preview.value=buildAIContext({instructor:currentInstructor,program,unit:u,resource:r,session,searchQuery:params.get('q')||undefined,task:task.value as AITask,request:request.value});
 const minutes=session?.blocks.reduce((sum,b)=>sum+b.planned_minutes,0);
 const context=[session?'Lezione · '+session.title+' — '+minutes+' minuti':null,u?String(u.order).padStart(2,'0')+' · '+u.title:'Tutto il programma',r?.title,params.get('q')?'Ricerca: '+params.get('q'):null].filter(Boolean);
 el('ai-orientation').textContent=context.join(' / ');
 el('ai-detach-session').hidden=!session;
 const back=el<HTMLAnchorElement>('ai-return');
 back.href=session?withBase(params.get('draft')==='1'?'/instructor/sessioni/nuova/?restore=ai':'/instructor/sessioni/modifica/?id='+encodeURIComponent(session.id)):r?withBase('/instructor/risorse/'+r.id+'/'+(params.get('q')?'?q='+encodeURIComponent(params.get('q')!):'')):params.get('q')?withBase('/instructor/cerca/?q='+encodeURIComponent(params.get('q')!)):u?withBase('/instructor/unita/'+u.slug+'/'):withBase('/instructor/');
 back.textContent=session?'Torna alla lezione':r?'Torna al materiale':params.get('q')?'Torna alla ricerca':u?'Torna all’unità':'Torna alla Home';
 const regulatory=params.get('regulatory')==='1'||u?.order===17||u?.order===18||u?.order===16||r?.entity_type==='REGULATORY_COPY'||(r?.regulatory_status&&r.regulatory_status!=='NOT_APPLICABLE');el('ai-regulatory').hidden=!regulatory;
 el('ai-example').textContent=u?.order===17?'Per esempio: «Prepara un’attività pratica di 15 minuti sulla contaminazione crociata per una classe A2–B1».':'Per esempio: «Dammi un caso pratico da discutere con la classe su questo argomento».';
 document.querySelectorAll<HTMLButtonElement>('[data-ai-task]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.aiTask===task.value)));
 el('ai-launch').hidden=true;el('ai-manual-copy').hidden=true;el('ai-copy-status').textContent='';
 const url=new URL(location.href);if(u)url.searchParams.set('unit',u.id);else url.searchParams.delete('unit');if(r)url.searchParams.set('resource',r.id);else url.searchParams.delete('resource');if(!session){url.searchParams.delete('session');url.searchParams.delete('draft');}url.searchParams.set('task',task.value);history.replaceState(null,'',url);
}
const requestedResource=resources.find(r=>r.id===params.get('resource'));if(requestedResource&&!unit.value)unit.value=requestedResource.unit_ids[0]||'';chooseResources(requestedResource?.id);
function detachSession(){session=undefined;params.delete('session');params.delete('draft');}
unit.addEventListener('change',()=>{detachSession();chooseResources();update();});resource.addEventListener('change',update);el('ai-detach-session').addEventListener('click',()=>{detachSession();update();});task.addEventListener('change',update);request.addEventListener('input',update);
const presets:Record<AITask,string>={activity:'Prepara un’attività pratica di 15 minuti su questo argomento per una classe A2–B1.',quiz:'Crea 5 domande su questo materiale, con risposte e spiegazioni da rivedere.',explain:'Spiegami questo argomento con parole chiare ed esempi di sala e bar.',example:'Dammi un esempio pratico di questo argomento nel lavoro in sala o al bar.',lesson:'Aiutami a preparare una lezione usando il contesto e i materiali disponibili.',research:'Approfondisci questo argomento distinguendo contenuti forniti e fonti da verificare.',adapt:'Adatta questo contenuto per una classe A2–B1, spiegando i termini professionali.',free:''};
document.querySelectorAll<HTMLButtonElement>('[data-ai-task]').forEach(button=>button.addEventListener('click',()=>{const next=button.dataset.aiTask as AITask;task.value=next;if(!request.value.trim()||request.value===lastPreset){request.value=presets[next];lastPreset=request.value;}update();}));
el('ai-form').addEventListener('submit',e=>e.preventDefault());
el('ai-copy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(preview.value);el('ai-copy-status').textContent='Richiesta copiata ✓ Apri ChatGPT, seleziona RISTO-LAB e incolla il testo.';el('ai-launch').hidden=false;el('ai-manual-copy').hidden=true;}catch{el('ai-copy-status').textContent='Non posso copiare automaticamente. Usa Copia manualmente e il comando Copia del browser.';el('ai-manual-copy').hidden=false;}});
el('ai-manual-copy').addEventListener('click',()=>{el<HTMLDetailsElement>('ai-full-request').open=true;preview.focus();preview.select();el('ai-copy-status').textContent='Testo selezionato. Copia con Ctrl/Cmd+C o il comando del browser, poi apri ChatGPT e seleziona RISTO-LAB.';el('ai-launch').hidden=false;});
update();
