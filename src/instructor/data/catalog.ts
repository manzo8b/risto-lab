import raw from './catalog.public.json' with {type:'json'};
import type {Program,ProgramUnit,Resource,Lesson,Regulation,MediaAsset,ClassroomPlacement} from '../../types/content';
export const program=raw.program as Program;export const units=raw.units as ProgramUnit[];export const resources=raw.resources as Resource[];export const regulations=raw.regulations as Regulation[];export const lessons=raw.lessons as Lesson[];export const media:MediaAsset[]=[];export const classroomSequence=raw.classroom_sequence as ClassroomPlacement[];export const collections=raw.collections;
export const labels={CLASSROOM_READY:'Pronta per Aula',READY:'Pronta',PARTIAL:'Materiale parziale',CONTENT_REVIEW:'Da revisionare',EMPTY:'Contenuti da preparare'};
export function classroomResourceIds(unitId:string){const unit=units.find(u=>u.id===unitId);return unit?.classroom_resource_ids||classroomSequence.filter(p=>resources.some(r=>r.id===p.resource_id&&r.unit_ids.includes(unitId))).map(p=>p.resource_id);}
export const unitSequences=Object.fromEntries(units.filter(u=>u.classroom_resource_ids).map(u=>[u.id,u.classroom_resource_ids!]));
