import { mkdirSync, readFileSync, renameSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const output = join(process.cwd(), 'dist', 'client');
const library = JSON.parse(readFileSync(join(process.cwd(), 'data', 'scholarship_library.json'), 'utf8'));
const records = library.opportunities.filter((record) => !['REJECTED_INVALID', 'STALE'].includes(record.verification_status));
const baseUrl = 'https://hadibudhy.github.io/scholarship-atlas';

function movePage(relative) {
  const source = join(output, `${relative}.html`);
  const targetDirectory = join(output, relative);
  mkdirSync(targetDirectory, { recursive: true });
  renameSync(source, join(targetDirectory, 'index.html'));
}

for (const page of ['about', 'directory', 'privacy', 'terms', 'fully-funded']) movePage(page);
for (const page of ['artificial-intelligence', 'data-science']) movePage(join('fields', page));
for (const page of ['germany', 'united-kingdom']) movePage(join('countries', page));
for (const record of records) movePage(join('opportunities', record.opportunity_id));

function rewriteHtml(directory) {
  for (const entry of readdirSync(directory)) {
    const path = join(directory, entry);
    if (statSync(path).isDirectory()) rewriteHtml(path);
    if (entry.endsWith('.html')) {
      const html = readFileSync(path, 'utf8').replace(/\b(href|src)="\/(?!\/)/g, '$1="/scholarship-atlas/');
      writeFileSync(path, html);
    }
  }
}

rewriteHtml(output);

const xml = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const sitemapUrls = [
  `${baseUrl}/`,
  `${baseUrl}/directory/`,
  `${baseUrl}/about/`,
  `${baseUrl}/fully-funded/`,
  `${baseUrl}/privacy/`,
  `${baseUrl}/terms/`,
  `${baseUrl}/fields/artificial-intelligence/`,
  `${baseUrl}/fields/data-science/`,
  `${baseUrl}/countries/germany/`,
  `${baseUrl}/countries/united-kingdom/`,
  ...records.map((record) => `${baseUrl}/opportunities/${record.opportunity_id}/`),
];
writeFileSync(join(output, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${sitemapUrls.map((url) => `<url><loc>${xml(url)}</loc><lastmod>2026-09-05</lastmod></url>`).join('')}</urlset>`);
writeFileSync(join(output, 'robots.txt'), `User-agent: *\nAllow: /\n\nUser-agent: OAI-SearchBot\nAllow: /\n\nUser-agent: ChatGPT-User\nAllow: /\n\nUser-agent: GPTBot\nDisallow: /\n\nSitemap: ${baseUrl}/sitemap.xml\n`);
writeFileSync(join(output, 'llms.txt'), `# Scholarship Atlas\n\nScholarship Atlas is an official-source directory of graduate funding for Data, AI, machine learning and related fields.\n\n- Home: ${baseUrl}/\n- Directory: ${baseUrl}/directory/\n- Fully funded records: ${baseUrl}/fully-funded/\n- Methodology: ${baseUrl}/about/\n- Sitemap: ${baseUrl}/sitemap.xml\n\nEach public scholarship record has a permanent URL at ${baseUrl}/opportunities/{id}/ and includes provider, programme, funding, eligibility, documents, deadlines, verification date and official source links. Unverified details are labelled rather than inferred.\n`);
writeFileSync(join(output, '.nojekyll'), '');
console.log(`Prepared ${records.length} scholarship pages for GitHub Pages.`);
