import test from 'node:test';
import assert from 'node:assert/strict';
import '../public/instructor/professional-suite/report-export.js';
const R=globalThis.RLReport;
const report={title:'RISTO-LAB',notice:'Internal draft',sections:R.sections({Results:{missing:null,zero:0,negative:-2,unsafe:'=1+1',html:'<script>alert(1)</script>'}})};
async function files(blob){const b=Buffer.from(await blob.arrayBuffer()),out={};let p=0;while(b.readUInt32LE(p)===0x04034b50){const n=b.readUInt16LE(p+26),e=b.readUInt16LE(p+28),len=b.readUInt32LE(p+18),start=p+30+n+e;out[b.subarray(p+30,p+30+n).toString()]=b.subarray(start,start+len).toString();p=start+len}return out}
test('Markdown preserves missing vs zero and escapes HTML',()=>{const s=R.markdown(report);assert.match(s,/N\/D \(null\)/);assert.match(s,/\| zero \| 0 \|/);assert.match(s,/&lt;script&gt;/);assert.doesNotMatch(s,/<script>/)});
test('Excel has real OOXML package and numeric cells, no formulas from user text',async()=>{const f=await files(R.xlsx(report));assert.ok(f['[Content_Types].xml']);assert.ok(f['xl/workbook.xml']);const s=f['xl/worksheets/sheet2.xml'];assert.match(s,/<v>0<\/v>/);assert.match(s,/<v>-2<\/v>/);assert.match(s,/N\/D \(null\)/);assert.match(s,/=1\+1/);assert.doesNotMatch(s,/<f[ >]/)});
test('Word has real document package and warning',async()=>{const f=await files(R.docx(report));assert.ok(f['[Content_Types].xml']);assert.match(f['word/document.xml'],/Internal draft/);assert.match(f['word/document.xml'],/&lt;script&gt;/)});
test('Oversized report refuses rather than silently truncating',()=>assert.throws(()=>R.markdown({...report,sections:R.sections({x:'x'.repeat(30001)})})));
