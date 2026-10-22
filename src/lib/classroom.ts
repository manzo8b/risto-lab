export function remainingSeconds(deadline:number, now:number):number { return Math.max(0,Math.ceil((deadline-now)/1000)); }
export function nextIndex(index:number, delta:number, length:number):number { return Math.min(Math.max(0,length-1),Math.max(0,index+delta)); }
export {searchResources} from './search';
export function projectorPayload(resource:{title:string;body?:string;quiz?:{question:string;options:string[];answer:number;explanation:string|null}}) { return { title:resource.title,body:resource.body,question:resource.quiz?.question,options:resource.quiz?.options }; }
