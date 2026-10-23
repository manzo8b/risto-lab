import {spawn,spawnSync} from 'node:child_process';import {existsSync,lstatSync,unlinkSync,mkdirSync,symlinkSync} from 'node:fs';
const cwd=new URL('../.local/phase4b-authoring/',import.meta.url),modules=new URL('node_modules',cwd);if(!existsSync(cwd)){console.error('Ambiente locale di authoring non presente in questo checkout. Vedi docs/AUTHORING_VS_HOSTED.md.');process.exit(1);}
// The original authoring runtime has its own historical lockfile and dependencies.
if(existsSync(modules)&&lstatSync(modules).isSymbolicLink())unlinkSync(modules);
if(!existsSync(new URL('node_modules/@astrojs/node',cwd))){const install=spawnSync('npm',['ci'],{cwd,stdio:'inherit'});if(install.status!==0)process.exit(install.status??1);}
mkdirSync(new URL('.local/',cwd),{recursive:true});for(const name of ['teaching','intake','review']){const source=new URL('../'+name+'/',cwd),target=new URL('.local/'+name,cwd);if(existsSync(source)&&!existsSync(target))symlinkSync(source,target,'dir');}
const p=spawn('npm',['run','dev:instructor','--','--port','4325'],{cwd,stdio:'inherit'});p.on('exit',c=>process.exit(c??1));
