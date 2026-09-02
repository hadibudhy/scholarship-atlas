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

export function formatLabel(value?: string | null) { return value ? value.replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase()) : 'Unknown'; }
export function latestDeadline(record: Opportunity) { const dates = (record.cycles ?? []).map((cycle) => cycle.deadline).filter((value): value is string => Boolean(value && /^\d{4}-\d{2}-\d{2}/.test(value))); return dates.sort()[0] ?? null; }
export function sortedOpportunities(items: Opportunity[]) { return [...items].sort((a, b) => { const score = (record: Opportunity) => (record.verification_status === 'VERIFIED' ? 0 : 1) + (record.funding_classification === 'FULLY_FUNDED' ? 0 : record.funding_classification === 'NEAR_FULLY_FUNDED' ? 1 : 2); return score(a) - score(b) || a.name.localeCompare(b.name); }); }
