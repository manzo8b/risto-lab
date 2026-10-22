import {resources,units} from '../src/instructor/data/catalog';
for(const r of resources){if(r.publication_status!=='PUBLIC_APPROVED'||r.privacy_status!=='CLEAR'||!['OWNED','LICENSED','OFFICIAL_PUBLICATION','PUBLIC_DOMAIN'].includes(r.rights_status))throw new Error('Risorsa non pubblicabile: '+r.id);}
if(units.length!==26)throw new Error('Il curriculum deve contenere 26 unità.');console.log(`Catalogo pubblico: ${resources.length} risorse, 26 unità; nessun file runtime.`);
