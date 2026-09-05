import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const expected = [
  'dist/client/index.html',
  'dist/client/404.html',
  'dist/client/robots.txt',
  'dist/client/sitemap.xml',
  'dist/client/llms.txt',
  'dist/client/fully-funded/index.html',
  'dist/client/fields/artificial-intelligence/index.html',
  'dist/client/countries/germany/index.html',
  'dist/client/opportunities/aalto-codas-erasmus-data-science-2027/index.html',
];

const missing = expected.filter((path) => !existsSync(path));
if (missing.length) {
  throw new Error(`Static export is incomplete: ${missing.join(', ')}`);
}

const output = 'dist/client';
const base = 'https://hadibudhy.github.io/scholarship-atlas';
const library = JSON.parse(readFileSync('data/scholarship_library.json', 'utf8'));
const publicRecords = library.opportunities.filter((record) => !['REJECTED_INVALID', 'STALE'].includes(record.verification_status));
const pages = [];
function collect(dir) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) collect(path);
    else if (entry.endsWith('.html')) pages.push(path);
  }
}
collect(output);

const errors = [];
const titles = new Map();
const descriptions = new Map();
for (const path of pages) {
  const html = readFileSync(path, 'utf8');
  const page = relative(output, path);
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1]?.trim();
  const description = html.match(/<meta[^>]+name="description"[^>]+content="([^"]+)"/i)?.[1];
  const canonical = html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i)?.[1];
  if (!title || !description || !canonical || !/<h1[\s>]/i.test(html)) errors.push(`${page} is missing title, description, canonical, or H1`);
  if (canonical && !canonical.startsWith(base)) errors.push(`${page} has non-canonical base URL: ${canonical}`);
  if (title) (titles.get(title) ?? titles.set(title, []).get(title)).push(page);
  if (description) (descriptions.get(description) ?? descriptions.set(description, []).get(description)).push(page);
  for (const block of html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(block[1]); } catch { errors.push(`${page} has invalid JSON-LD`); }
  }
}
for (const [title, paths] of titles) if (paths.length > 1 && paths.some((path) => path.startsWith('opportunities/'))) errors.push(`duplicate scholarship title: ${title}`);
for (const [description, paths] of descriptions) if (paths.length > 1 && paths.some((path) => path.startsWith('opportunities/'))) errors.push(`duplicate scholarship description: ${description}`);

const directory = readFileSync(join(output, 'directory', 'index.html'), 'utf8');
const detailLinks = new Set([...directory.matchAll(/href="\/scholarship-atlas\/opportunities\/([^"#?]+)/g)].map((match) => match[1].replace(/\/$/, '')));
if (detailLinks.size !== publicRecords.length) errors.push(`directory exposes ${detailLinks.size} unique scholarship links; expected ${publicRecords.length}`);
for (const record of publicRecords) if (!detailLinks.has(record.opportunity_id)) errors.push(`directory is missing crawlable link for ${record.opportunity_id}`);
const home = readFileSync(join(output, 'index.html'), 'utf8');
if (!/href="\/scholarship-atlas\/directory\/?"/.test(home)) errors.push('homepage has no crawlable directory link');
if (!/User-agent: OAI-SearchBot\nAllow: \//.test(readFileSync(join(output, 'robots.txt'), 'utf8'))) errors.push('robots.txt does not explicitly allow OAI-SearchBot');
if (!existsSync(join(output, 'llms.txt'))) errors.push('llms.txt is missing');

const sitemap = readFileSync(join(output, 'sitemap.xml'), 'utf8');
const sitemapUrls = sitemap.match(/<loc>([^<]+)<\/loc>/g)?.map((match) => match.slice(5, -6)) ?? [];
if (sitemapUrls.length !== publicRecords.length + 10) errors.push(`sitemap contains ${sitemapUrls.length} URLs; expected ${publicRecords.length + 10}`);
for (const url of sitemapUrls) {
  const suffix = url.slice(base.length).replace(/^\//, '').replace(/\/$/, '');
  const target = join(output, suffix || '.', 'index.html');
  if (!existsSync(target)) errors.push(`sitemap URL has no static page: ${url}`);
}

if (errors.length) throw new Error(`Static SEO validation failed:\n${errors.join('\n')}`);
console.log(`Static export passed SEO checks across ${pages.length} HTML pages with ${detailLinks.size} crawlable scholarship links.`);
