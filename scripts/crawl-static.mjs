import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync, writeFileSync } from 'node:fs';
import { resolve, sep, extname } from 'node:path';

// Serve precisely the Pages artifact, including directory redirects and real 404s.
const root = resolve('dist/client');
const prefix = '/scholarship-atlas/';
const canonicalBase = 'https://hadibudhy.github.io';
const server = createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (!url.pathname.startsWith(prefix)) { res.writeHead(404).end(); return; }
  let file = resolve(root, decodeURIComponent(url.pathname.slice(prefix.length)));
  if (file !== root && !file.startsWith(root + sep)) { res.writeHead(403).end(); return; }
  if (existsSync(file) && statSync(file).isDirectory()) {
    if (!url.pathname.endsWith('/')) { res.writeHead(301, { Location: url.pathname + '/' + url.search }).end(); return; }
    file = resolve(file, 'index.html');
  }
  if (!existsSync(file)) { res.writeHead(404, { 'Content-Type': 'text/html' }).end(readFileSync(resolve(root, '404.html'))); return; }
  const mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.xml': 'application/xml', '.txt': 'text/plain' };
  res.writeHead(200, { 'Content-Type': mime[extname(file)] || 'application/octet-stream' }).end(readFileSync(file));
});
await new Promise((done) => server.listen(0, '127.0.0.1', done));
const local = `http://127.0.0.1:${server.address().port}`;
const errors = [];
const visited = new Set();
const queue = [prefix];
const normalizePath = (path) => path === prefix || path.endsWith('/') || /\.[a-z0-9]+$/i.test(path) ? path : `${path}/`;
const titles = new Map();
const descriptions = new Map();
const canonicalUrls = new Set();
const canonicals = new Map();
const attributes = (tag) => Object.fromEntries([...tag.matchAll(/([\w-]+)\s*=\s*"([^"]*)"/g)].map((m) => [m[1].toLowerCase(), m[2]]));
const unique = (map, value, path, label) => {
  if (!value) errors.push(`${path}: missing ${label}`);
  else if (map.has(value)) errors.push(`${path}: duplicate ${label} with ${map.get(value)}`);
  else map.set(value, path);
};
try {
  while (queue.length) {
    const path = queue.shift();
    if (visited.has(path)) continue;
    visited.add(path);
    const response = await fetch(local + path);
    if (response.status !== 200) { errors.push(`${path}: HTTP ${response.status}`); continue; }
    const html = await response.text();
    // Ignore scripts, including serialized React trees: only actual HTML is crawlable.
    const markup = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<!--[\s\S]*?-->/g, '');
    unique(titles, markup.match(/<title>([^<]+)<\/title>/i)?.[1], path, 'title');
    const metas = [...markup.matchAll(/<meta\b[^>]*>/gi)].map((m) => attributes(m[0]));
    unique(descriptions, metas.find((m) => m.name === 'description')?.content, path, 'description');
    const links = [...markup.matchAll(/<link\b[^>]*>/gi)].map((m) => attributes(m[0]));
    const canonical = links.find((l) => l.rel === 'canonical')?.href;
    const expected = canonicalBase + new URL(response.url).pathname;
    if (canonical !== expected) errors.push(`${path}: canonical ${canonical}, expected ${expected}`);
    if (canonical) canonicalUrls.add(canonical);
    unique(canonicals, canonical, path, 'canonical URL');
    const h1s = [...markup.matchAll(/<h1\b/gi)].length;
    if (h1s !== 1) errors.push(`${path}: ${h1s} H1 elements`);
    const headings = [...markup.matchAll(/<h([1-6])\b/gi)].map((match) => Number(match[1]));
    for (let index = 1; index < headings.length; index += 1) if (headings[index] > headings[index - 1] + 1) errors.push(`${path}: heading level jumps from H${headings[index - 1]} to H${headings[index]}`);
    if (!/<html[^>]+lang="en"/i.test(markup)) errors.push(`${path}: missing language`);
    if (!metas.some((m) => m.name === 'viewport' && m.content?.includes('width=device-width'))) errors.push(`${path}: missing responsive viewport`);
    for (const m of markup.matchAll(/<img\b[^>]*>/gi)) if (!('alt' in attributes(m[0]))) errors.push(`${path}: image without alt`);
    const schema = [...html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
    if (!schema.length) errors.push(`${path}: missing JSON-LD`);
    if (path.includes('/opportunities/') && !['Provider', 'Country', 'Deadline', 'Degree', 'Funding level', 'Recommendation letters', 'Last verified', 'Official sources'].every((label) => markup.includes(label))) errors.push(`${path}: missing a required scholarship fact label`);
    for (const block of schema) {
      try {
        const data = JSON.parse(block[1]);
        for (const node of (Array.isArray(data) ? data : [data])) {
          if (node['@context'] !== 'https://schema.org' || (!node['@type'] && !node['@graph'])) errors.push(`${path}: missing schema context/type`);
        }
      } catch { errors.push(`${path}: invalid JSON-LD JSON`); }
    }
    for (const match of markup.matchAll(/<a\b[^>]*>/gi)) {
      const href = attributes(match[0]).href;
      if (!href) continue;
      const target = new URL(href.replaceAll('&amp;', '&'), canonicalBase + path);
      if (target.origin !== canonicalBase || !target.pathname.startsWith(prefix)) continue;
      if (target.hash && target.pathname === path) {
        if (!markup.includes(`id="${decodeURIComponent(target.hash.slice(1))}"`)) errors.push(`${path}: missing fragment ${target.hash}`);
      }
      const crawlPath = normalizePath(target.pathname);
      if (!target.search && !visited.has(crawlPath)) queue.push(crawlPath);
    }
  }
  const sitemap = await (await fetch(local + prefix + 'sitemap.xml')).text();
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  for (const url of urls) {
    if (!canonicalUrls.has(url)) errors.push(`Unreachable sitemap page: ${url}`);
    if ((await fetch(local + new URL(url).pathname)).status !== 200) errors.push(`Unresolved sitemap URL: ${url}`);
  }
  for (const url of canonicalUrls) if (!urls.includes(url)) errors.push(`Missing from sitemap: ${url}`);
  const report = { pagesCrawled: canonicalUrls.size, scholarshipPages: [...canonicalUrls].filter((u) => u.includes('/opportunities/')).length, sitemapUrls: urls.length, errors };
  writeFileSync('dist/crawl-report.json', JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  if (errors.length) process.exitCode = 1;
} finally { server.closeAllConnections(); server.close(); }
