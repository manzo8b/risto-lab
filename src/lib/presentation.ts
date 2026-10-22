import type {Resource} from '../types/content';
import {classroomApproved} from './governance';
export const teachingKinds=[['TEXT','Lezione / Testo'],['SLIDES','Slide'],['PRACTICE','Esercizio / Laboratorio'],['QUIZ','Quiz / Verifica'],['CHECKLIST','Checklist'],['HANDOUT','Dispensa'],['IMAGE','Immagine'],['VIDEO','Video'],['REFERENCE','Normativa / Riferimento']] as const;
export function teachingKind(r:Pick<Resource,'type'|'material_kind'>):string{
 if(r.material_kind==='Quiz'||r.type==='QUIZ')return 'QUIZ';
 if(r.material_kind==='Laboratorio'||r.type==='EXERCISE')return 'PRACTICE';
 if(r.material_kind==='Checklist'||r.type==='CHECKLIST')return 'CHECKLIST';
 if(r.type==='HANDOUT'||r.material_kind==='Dispensa')return 'HANDOUT';
 if(['REGULATORY_COPY','REFERENCE'].includes(r.type)||r.material_kind==='Linee guida')return 'REFERENCE';
 if(['SLIDES','IMAGE','VIDEO'].includes(r.type))return r.type;
 return 'TEXT';
}
export function teacherResourceLabel(r:Pick<Resource,'type'|'material_kind'>):string{const k=teachingKind(r);return k==='TEXT'?'Testo':k==='PRACTICE'?(r.material_kind==='Laboratorio'?'Laboratorio':'Esercizio'):k==='REFERENCE'?(r.type==='REGULATORY_COPY'?'Testo normativo':r.material_kind==='Linee guida'?'Linee guida':'Riferimento'):({SLIDES:'Slide',QUIZ:'Quiz',CHECKLIST:'Checklist',HANDOUT:'Dispensa',IMAGE:'Immagine',VIDEO:'Video'} as Record<string,string>)[k];}
export const editorialLabels:Record<string,string>={DRAFT:'Bozza',REVIEW:'Revisione',APPROVED:'Approvato',SUPERSEDED:'Sostituito',ARCHIVED:'Archiviato',REJECTED:'Rifiutato'};
export const publicationLabels:Record<string,string>={PRIVATE:'Privato',PUBLIC_CANDIDATE:'Candidato pubblico',PUBLIC_APPROVED:'Pubblico approvato'};
export const privacyLabels:Record<string,string>={CLEAR:'Verificata',PRIVATE_ONLY:'Privato — solo area docente',REVIEW_REQUIRED:'Revisione richiesta'};
export const rightsLabels:Record<string,string>={OWNED:'Di proprietà',LICENSED:'Licenza registrata',OFFICIAL_PUBLICATION:'Pubblicazione ufficiale',PUBLIC_DOMAIN:'Pubblico dominio',THIRD_PARTY:'Fonte terza',UNKNOWN:'Titolarità non accertata',REVIEW_REQUIRED:'Revisione richiesta'};
export function classroomUseLabel(r:Resource){return classroomApproved(r)?'Pronto':r.private_use_authorized&&r.privacy_status!=='REVIEW_REQUIRED'&&!['DRAFT','SUPERSEDED','ARCHIVED','REJECTED'].includes(r.canonical_status)?'Da preparare':'Non disponibile';}
