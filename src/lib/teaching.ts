import {shortText,validDate,validTime} from './local-fields';
export const blockLabels={RESOURCE:'Materiale',INTRODUCTION:'Introduzione',BREAK:'Pausa',DISCUSSION:'Discussione',PRACTICE:'Pratica',QUIZ:'Quiz',SUMMARY:'Riepilogo',CUSTOM:'Altro'};
export type BlockType=keyof typeof blockLabels;
export const sessionLabels={DRAFT:'Bozza',READY:'Pronta',IN_PROGRESS:'In corso',COMPLETED:'Conclusa',ARCHIVED:'Archiviata'};
export interface TeachingBlock{id:string;session_id:string;order:number;resource_id?:string;block_type:BlockType;title:string;planned_minutes:number;teacher_note:string;projector_enabled:boolean;status:'PLANNED'|'DONE';}
export interface TeachingSession{id:string;title:string;date:string;program_id:string|null;unit_ids:string[];start_time:string;planned_end_time:string;actual_end_time:string|null;status:keyof typeof sessionLabels;blocks:TeachingBlock[];created_at:string;updated_at:string;revision:number;}
export function sessionTiming(s:Pick<TeachingSession,'blocks'|'start_time'|'planned_end_time'>){const minutes=(t:string)=>Number(t.slice(0,2))*60+Number(t.slice(3));const total=s.blocks.reduce((n,b)=>n+b.planned_minutes,0),available=minutes(s.planned_end_time)-minutes(s.start_time),end=minutes(s.start_time)+total;return {total,available,overrun:Math.max(0,total-available),expected_end:`${String(Math.floor(end/60)%24).padStart(2,'0')}:${String(end%60).padStart(2,'0')}`,next_day:end>=1440};}
export function validateTeaching(input:Record<string,unknown>,unitIds:string[],eligibleIds:string[]):Omit<TeachingSession,'id'|'created_at'|'updated_at'|'revision'|'actual_end_time'>{
 const title=shortText(input.title,160,'Titolo della lezione',true);if(!validDate(input.date)||!validTime(input.start_time)||!validTime(input.planned_end_time)||String(input.planned_end_time)<=String(input.start_time))throw new Error('Controlla data e orario: la fine deve seguire l’inizio nello stesso giorno.');
 if(!Array.isArray(input.unit_ids)||input.unit_ids.some(id=>typeof id!=='string'||!unitIds.includes(id)))throw new Error('Unità non valida.');
 if(input.program_id!==null&&input.program_id!=='il-servizio-in-sala')throw new Error('Programma non valido.');if(input.unit_ids.length&&input.program_id!=='il-servizio-in-sala')throw new Error('Seleziona il programma delle unità.');
 if(typeof input.status!=='string'||!Object.hasOwn(sessionLabels,input.status))throw new Error('Stato della lezione non valido.');
 if(!Array.isArray(input.blocks)||input.blocks.length>100)throw new Error('Sono consentiti al massimo 100 blocchi.');const seen=new Set<string>();
 const blocks=input.blocks.map((b,i)=>{if(!b||typeof b!=='object'||!Object.hasOwn(blockLabels,b.block_type))throw new Error('Tipo di blocco non valido.');if(typeof b.id!=='string'||!/^block-[a-f0-9-]{36}$/.test(b.id)||seen.has(b.id))throw new Error('Blocco non valido o ripetuto.');seen.add(b.id);if(!Number.isInteger(b.planned_minutes)||b.planned_minutes<1||b.planned_minutes>240)throw new Error('Assegna da 1 a 240 minuti a ciascun blocco.');const resource_id=typeof b.resource_id==='string'?b.resource_id:undefined;if(resource_id&&!eligibleIds.includes(resource_id))throw new Error('Questa risorsa non è ancora approvata per Aula.');if(b.block_type==='RESOURCE'&&!resource_id)throw new Error('Scegli un materiale per il blocco.');return {id:b.id,session_id:'',order:i+1,resource_id,block_type:b.block_type as BlockType,title:shortText(b.title,160,'Titolo del blocco',true),planned_minutes:b.planned_minutes,teacher_note:shortText(b.teacher_note,2000,'Nota docente'),projector_enabled:b.projector_enabled===true,status:b.status==='DONE'?'DONE' as const:'PLANNED' as const};});
 if(input.status!=='DRAFT'&&input.status!=='ARCHIVED'&&!blocks.length)throw new Error('Aggiungi almeno un blocco prima di preparare o avviare la lezione.');
 return {title,date:String(input.date),program_id:input.program_id as string|null,unit_ids:[...new Set(input.unit_ids as string[])],start_time:String(input.start_time),planned_end_time:String(input.planned_end_time),status:input.status as TeachingSession['status'],blocks};
}

/** Mechanical time allocation over the existing approved order; never creates teaching content. */
export function proposeBlocks(unitIds:string[],eligible:{id:string;title:string;unit_ids:string[];recommended_minutes?:number}[],sequence:string[],minutes:number,uuid:()=>string,unitSequences:Record<string,string[]>={}):TeachingBlock[]{
 const explicit=unitIds.some(id=>unitSequences[id]);const ids=[...new Set(explicit?unitIds.flatMap(id=>unitSequences[id]||sequence.filter(rid=>eligible.some(r=>r.id===rid&&r.unit_ids.includes(id)))):sequence)];const items=ids.map(id=>eligible.find(r=>r.id===id&&(r.unit_ids.some(u=>unitIds.includes(u))||unitIds.some(u=>unitSequences[u]?.includes(id))))).filter((r):r is NonNullable<typeof r>=>!!r);
 const target=Math.max(items.length,Math.floor(Number.isFinite(minutes)?minutes:60)),base=Math.floor(target/Math.max(1,items.length)),extra=target%Math.max(1,items.length);
 const allocation=items.map((_,i)=>base+(i<extra?1:0));
 // Existing sequences retain equal allocation. New curated sequences may reserve time for practice.
 if(items.length&&items.every(r=>Number.isFinite(r.recommended_minutes)&&r.recommended_minutes!>0)){
  const weights=items.map(r=>r.recommended_minutes!),sum=weights.reduce((a,b)=>a+b,0),remaining=target-items.length;
  const shares=weights.map(w=>remaining*w/sum);shares.forEach((v,i)=>allocation[i]=1+Math.floor(v));
  let left=target-allocation.reduce((a,b)=>a+b,0);
  const order=shares.map((v,i)=>({i,f:v-Math.floor(v)})).sort((a,b)=>b.f-a.f||a.i-b.i);
  for(const {i} of order){if(!left)break;allocation[i]++;left--;}
  // Use the exact authored split at its intended duration.
  if(target===sum)weights.forEach((v,i)=>allocation[i]=v);
 }
 return items.map((r,i)=>({id:'block-'+uuid(),session_id:'',order:i+1,resource_id:r.id,block_type:'RESOURCE',title:r.title,planned_minutes:Math.min(240,allocation[i]),teacher_note:'',projector_enabled:true,status:'PLANNED'}));
}
