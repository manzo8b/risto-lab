/** Share only library filters, never arbitrary URL parameters or teacher data. */
export const libraryFilterKeys=['q','kind','where','topic','type','format'] as const;
export function libraryState(params:URLSearchParams){const out=new URLSearchParams();for(const key of libraryFilterKeys){const value=params.get(key)?.trim().slice(0,300);if(value)out.set(key,value);}return out;}
