import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {aiTasks,buildAIContext} from '../src/lib/ai-context';
import {aiProvider} from '../src/lib/ai-provider';
test('5.1 every request names RISTO-LAB first and retains source verification guidance',()=>{for(const task of Object.keys(aiTasks) as (keyof typeof aiTasks)[]){const value=buildAIContext({task,request:'Una prova'});assert.ok(value.startsWith('Usa RISTO-LAB per rispondere a questa richiesta.\n\nRISTO-LAB CONTEXT'));assert.ok(value.includes('Per contenuti normativi verifica sempre le fonti ufficiali collegate'));assert.equal(value.match(/Usa RISTO-LAB per rispondere a questa richiesta\./g)?.length,1);}assert.equal(aiProvider.fallbackUrl,'https://chatgpt.com/');assert.equal(aiProvider.launchUrl,null);assert.ok(aiProvider.instructions.includes('plugin ufficiale'));});
test('5.1 bridge stays static, without network calls, credentials or required app protocol',()=>{const sources=['src/lib/ai-client.ts','src/lib/ai-context.ts','src/lib/ai-provider.ts','src/instructor/pages/instructor/ai/index.astro'].map(p=>readFileSync(p,'utf8')).join('\n');assert.doesNotMatch(sources,/fetch\s*\(|XMLHttpRequest|api\.openai\.com|sk-proj-|window\.location\s*=\s*['"]app:/);});
