/** All application links share Astro's configured repository subpath. */
export function withBase(path:string){const base=(import.meta.env?.BASE_URL||'/risto-lab/').replace(/\/$/,'');return path.startsWith(base+'/')?path:base+(path.startsWith('/')?path:'/'+path);}
