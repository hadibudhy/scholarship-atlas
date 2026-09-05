import rawLibrary from '@/data/scholarship_library.json';

export type Source = { title?: string; url: string; official?: boolean; source_role?: string };
export type Program = { program_id: string; name: string; degree_title?: string; field_tags?: string[]; relevance?: string; duration_text?: string; language?: string; admission_summary?: string; admission_fee?: string; application_url?: string; official_program_url?: string; recommendation_status?: string; recommendation_count?: string; notes?: string };
export type Opportunity = { opportunity_id: string; canonical_key: string; name: string; opportunity_type?: string; provider_name?: string; provider_country?: string; degree_level?: string; data_ai_relevance?: string; funding_classification?: string; international_eligibility?: string; verification_status?: string; last_verified?: string; current_status?: string; summary?: string; unresolved_fields?: string[]; obligations?: string[]; recommendations?: Record<string, string>; funding?: Record<string, string | null>; programs?: Program[]; cycles?: Array<Record<string, string | null>>; sources?: Source[] };

const library = rawLibrary as unknown as { metadata?: { last_research_run?: string }; opportunities: Opportunity[] };
export const opportunities = library.opportunities.filter((record) => record.verification_status !== 'REJECTED_INVALID' && record.verification_status !== 'STALE');
const excluded = library.opportunities.filter((record) => record.verification_status === 'REJECTED_INVALID' || record.verification_status === 'STALE');

if (opportunities.some((record) => !record.opportunity_id || !record.name || !record.sources?.length)) throw new Error('Public library validation failed: missing identity or official source.');
if (opportunities.some((record) => ['REJECTED_INVALID', 'STALE'].includes(record.verification_status ?? ''))) throw new Error('Public library validation failed: excluded status leaked.');
if (new Set(opportunities.map((record) => record.canonical_key)).size !== opportunities.length) throw new Error('Public library validation failed: duplicate canonical keys.');

export const researchDate = library.metadata?.last_research_run ?? 'Unknown';
export const excludedCount = excluded.length;
const alpha = (a: string, b: string) => a.localeCompare(b);
const isString = (value: string | undefined): value is string => Boolean(value);
export const countries = [...new Set(opportunities.map((record) => record.provider_country).filter(isString))].sort(alpha);
export const fields = [...new Set(opportunities.flatMap((record) => record.programs?.flatMap((program) => program.field_tags ?? []) ?? []))].sort(alpha);
export const fundingClasses = [...new Set(opportunities.map((record) => record.funding_classification).filter(isString))].sort(alpha);
export const currentStatuses = [...new Set(opportunities.map((record) => record.current_status).filter(isString))].sort(alpha);

export const siteUrl = 'https://hadibudhy.github.io/scholarship-atlas';

export function slugFor(value: string) {
  return value.toLocaleLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export const fieldLandingPages = [
  { slug: 'artificial-intelligence', label: 'Artificial Intelligence', field: 'AI', description: 'Official-source funding routes for Master’s and PhD study in artificial intelligence, machine learning and related research.' },
  { slug: 'data-science', label: 'Data Science', field: 'DATA_SCIENCE', description: 'Official-source funding routes for Master’s and PhD study in data science, analytics and data-driven research.' },
];

export const countryLandingPages = [
  { slug: 'germany', label: 'Germany', country: 'Germany', description: 'Official-source Data and AI graduate funding routes based in Germany.' },
  { slug: 'united-kingdom', label: 'United Kingdom', country: 'United Kingdom', description: 'Official-source Data and AI graduate funding routes based in the United Kingdom.' },
];

export function opportunitiesForField(field: string) {
  return opportunities.filter((record) => record.programs?.some((program) => program.field_tags?.includes(field)));
}

export function opportunitiesForCountry(country: string) {
  return opportunities.filter((record) => record.provider_country === country);
}

export function formatLabel(value?: string | null) {
  if (!value) return 'Unknown';
  if (!value.includes('_') && value !== value.toLocaleUpperCase()) return value;
  const normalized = value.replaceAll('_', ' ').replace(/\s+/g, ' ').trim().toLocaleLowerCase();
  return normalized.replace(/\b\w/g, (letter) => letter.toLocaleUpperCase()).replace(/\b(ai|eu|eea|uk|us|ielts|toefl|phd|msc)\b/gi, (word) => word.toLocaleUpperCase());
}
export function latestDeadline(record: Opportunity) { const dates = (record.cycles ?? []).map((cycle) => cycle.deadline).filter((value): value is string => Boolean(value && /^\d{4}-\d{2}-\d{2}/.test(value))); return dates.sort()[0] ?? null; }
export function sortedOpportunities(items: Opportunity[]) { return [...items].sort((a, b) => { const score = (record: Opportunity) => (record.verification_status === 'VERIFIED' ? 0 : 1) + (record.funding_classification === 'FULLY_FUNDED' ? 0 : record.funding_classification === 'NEAR_FULLY_FUNDED' ? 1 : 2); return score(a) - score(b) || a.name.localeCompare(b.name); }); }
export function textForSearch(record: Opportunity) { return [record.name, record.provider_name, record.provider_country, record.opportunity_type, record.summary, ...(record.programs?.flatMap((program) => [program.name, ...(program.field_tags ?? [])]) ?? [])].filter(Boolean).join(' ').toLocaleLowerCase(); }
export function hasNoRecommendationRequirement(record: Opportunity) { const entries = Object.values(record.recommendations ?? {}).join(' ').toLocaleLowerCase(); return entries.includes('none') || entries.includes('not listed') || entries.includes('no reference'); }
export function hasNoEnglishTestListed(record: Opportunity) { const text = record.programs?.map((program) => `${program.language ?? ''} ${program.admission_summary ?? ''}`).join(' ').toLocaleLowerCase() ?? ''; return text.includes('english-medium') || text.includes('exempt') || text.includes('no english') || text.includes('not required'); }
export function hasNoApplicationFee(record: Opportunity) { return record.programs?.some((program) => (program.admission_fee ?? '').toLocaleLowerCase().includes('no fee') || (program.admission_fee ?? '').toLocaleLowerCase().includes('exempt')) ?? false; }
export function hasCoverage(record: Opportunity, key: 'stipend' | 'accommodation' | 'travel' | 'insurance') { const funding = record.funding ?? {}; const value = key === 'stipend' ? funding.stipend_amount : key === 'accommodation' ? funding.accommodation_type : key === 'insurance' ? funding.health_insurance : funding.travel; const normal = (value ?? '').toLocaleLowerCase(); return Boolean(normal && !normal.includes('unknown') && !normal.includes('not provided') && !normal.includes('none stated') && !normal.includes('not covered')); }
