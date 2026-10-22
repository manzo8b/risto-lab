import type {Resource} from '../types/content';
import {resources} from '../instructor/data/catalog';
import {withBase} from './urls';
import {classroomApproved} from './governance';
export const typeLabels:Record<string,string>={TEXT:'Testo',EXERCISE:'Esercizio',QUIZ:'Quiz',CHECKLIST:'Checklist',IMAGE:'Immagine',PDF:'PDF',REFERENCE:'Riferimento',VIDEO:'Video',SLIDES:'Slide',DOCUMENT:'Documento Word',WORKBOOK:'Foglio Excel',HANDOUT:'Dispensa',REGULATORY_COPY:'Testo normativo'};
export const isAvailable=(r:Resource)=>r.publication_status==='PUBLIC_APPROVED'&&r.privacy_status==='CLEAR';
export const isClassroomApproved=classroomApproved;
export const assetUrl=(id:string)=>{const r=resources.find(r=>r.id===id);return r?.asset_filename?withBase('/materiali/'+encodeURIComponent(r.asset_filename)):'';};
