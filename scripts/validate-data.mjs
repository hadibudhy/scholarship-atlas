import { readFileSync } from 'node:fs';

const library = JSON.parse(readFileSync(new URL('../data/scholarship_library.json', import.meta.url), 'utf8'));
const records = library.opportunities.filter((record) => !['REJECTED_INVALID', 'STALE'].includes(record.verification_status));
const ids = new Set();
const keys = new Set();
const errors = [];

for (const record of records) {
  if (!record.opportunity_id || !record.name || !record.provider_name || !record.sources?.length) errors.push(`${record.opportunity_id || 'unknown'} is missing public identity data`);
  if (ids.has(record.opportunity_id)) errors.push(`duplicate opportunity_id: ${record.opportunity_id}`);
  if (keys.has(record.canonical_key)) errors.push(`duplicate canonical_key: ${record.canonical_key}`);
  ids.add(record.opportunity_id); keys.add(record.canonical_key);
  for (const source of record.sources ?? []) {
    if (!(source.url ?? '').startsWith('https://')) errors.push(`${record.opportunity_id} has invalid source URL`);
  }
}

if (errors.length) throw new Error(`Data validation failed:\n${errors.join('\n')}`);
console.log(`Validated ${records.length} public scholarship records.`);
