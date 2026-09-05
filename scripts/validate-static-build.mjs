import { existsSync } from 'node:fs';

const expected = [
  'dist/client/index.html',
  'dist/client/404.html',
  'dist/client/robots.txt',
  'dist/client/sitemap.xml',
  'dist/client/opportunities/aalto-codas-erasmus-data-science-2027/index.html',
];

const missing = expected.filter((path) => !existsSync(path));
if (missing.length) {
  throw new Error(`Static export is incomplete: ${missing.join(', ')}`);
}

console.log('Static export includes the homepage, 404, metadata, and a scholarship detail page.');
