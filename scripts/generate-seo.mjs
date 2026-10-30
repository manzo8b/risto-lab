import {readdirSync, readFileSync, writeFileSync} from 'node:fs';
import {join, relative, sep} from 'node:path';

const root = 'dist';
const origin = 'https://manzo8b.github.io';
const base = '/risto-lab/';
const files = [];
function visit(dir) {
  for (const entry of readdirSync(dir, {withFileTypes:true})) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) visit(full);
    else if (entry.isFile() && entry.name.endsWith('.html')) files.push(full);
  }
}
function escapeXml(value) {
  return value.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
}
visit(root);
const discovered = [];
for (const file of files) {
  const part = relative(root, file).split(sep).join('/');
  if (part === '404.html' || part.endsWith('/404.html')) continue;
  // The unlisted Consilia/P.R.I.S.M.A. dossier is intentionally never discovered.
  if (part.startsWith('atelier/')) continue;
  const markup = readFileSync(file,'utf8');
  if (/<meta\b[^>]*name=["'](?:robots|googlebot)["'][^>]*content=["'][^"']*\bnoindex\b/i.test(markup)) continue;
  let route = part.endsWith('/index.html') ? part.slice(0,-'index.html'.length) : part === 'index.html' ? '' : part;
  if (route.endsWith('.html')) route = route.slice(0,-5) + '/';
  const absolute = origin + base + route;
  if (!absolute.startsWith(origin + base)) throw new Error('Invalid sitemap route');
  discovered.push(absolute);
}
const urls = [...new Set(discovered)].sort();
if (urls.length < 5) throw new Error('Unexpectedly small public sitemap');
if (urls.some(url=>url.includes('/atelier/')||url.includes('/404'))) throw new Error('Unlisted route exposed');
const xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
  + '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
  + urls.map(url=>'  <url><loc>'+escapeXml(url)+'</loc></url>').join('\n')
  + '\n</urlset>\n';
writeFileSync(join(root,'sitemap.xml'), xml);
console.log('Public SEO sitemap: '+urls.length+' URLs; unlisted and noindex excluded.');
