import type { Opportunity } from '@/lib/library';

const tuitionLabels: Record<string, string> = {
  FULL_EXEMPTION: 'Full tuition exemption',
  FULL_TUITION: 'Full tuition coverage',
  FULL_TUITION_FEE_WAIVER: 'Full tuition fee waiver',
  FULL_TUITION_AND_BENCH_FEES: 'Full tuition and bench fees',
  ANNUAL_TUITION_FEE_COVERED: 'Annual tuition covered',
  FULL_EXEMPTION_FOR_ERASMUS_MUNDUS_AWARD: 'Full tuition exemption',
  FULL_EXEMPTION_FOR_EMJM_AWARD: 'Full tuition exemption',
  NO_DIRECT_TUITION_PAYMENT: 'No direct tuition payment',
  NOT_STATED: 'Not stated',
};

function asText(value?: unknown) { return typeof value === 'string' ? value : typeof value === 'number' ? String(value) : ''; }

export function sentence(value?: unknown) {
  const raw = asText(value);
  if (!raw) return 'Unknown';
  const normalized = raw.replaceAll('_', ' ').replace(/\s+/g, ' ').trim();
  if (!normalized) return 'Unknown';
  const lower = normalized.toLocaleLowerCase();
  const rendered = lower.charAt(0).toLocaleUpperCase() + lower.slice(1);
  return rendered.replace(/\b(ai|eu|eea|uk|us|ielts|toefl|phd|msc)\b/gi, (word: string) => word.toLocaleUpperCase()).replace(/\b(GBP|USD|EUR|AUD|CAD|NZD|CHF|DKK|SEK|HUF|KRW|JPY|CNY|RMB|SGD|NTD)(?=\d|\s|$)/gi, (word: string) => word.toLocaleUpperCase());
}

export function displayStatus(value?: unknown) { return sentence(value); }
export function displayTuition(value?: unknown) { const raw = asText(value); return raw && tuitionLabels[raw] ? tuitionLabels[raw] : sentence(raw); }

export function displayAmount(value?: unknown, currency?: unknown, frequency?: unknown) {
  const raw = asText(value); const currencyCode = asText(currency); const frequencyValue = asText(frequency);
  if (!raw || raw.toLocaleLowerCase().includes('unknown') || raw.toLocaleLowerCase().startsWith('none')) return 'Not stated';
  const amount = Number(raw.replaceAll(',', ''));
  const unit = frequencyValue === 'MONTHLY' ? ' / month' : frequencyValue === 'ANNUAL' || frequencyValue === 'YEARLY' ? ' / year' : '';
  if (Number.isFinite(amount) && /^[A-Z]{3}$/.test(currencyCode)) {
    return `${new Intl.NumberFormat('en', { style: 'currency', currency: currencyCode, maximumFractionDigits: 0 }).format(amount)}${unit}`;
  }
  if (Number.isFinite(amount)) return `${new Intl.NumberFormat('en', { maximumFractionDigits: 0 }).format(amount)}${unit || ' (currency not specified)'}`;
  return sentence(raw);
}

export function displayStipend(record: Opportunity) {
  const funding = record.funding ?? {};
  return displayAmount(funding.stipend_amount, funding.stipend_currency, funding.stipend_frequency);
}

export function displayReferences(value?: string | number | null) {
  if (typeof value === 'number' || (typeof value === 'string' && /^\d+$/.test(value))) return `${value} required`;
  return sentence(typeof value === 'string' ? value : null);
}

export function displayDate(value?: string | null) {
  if (!value || !/^\d{4}-\d{2}-\d{2}/.test(value)) return value ? sentence(value) : 'Not published';
  const parsed = new Date(`${value.slice(0, 10)}T00:00:00Z`);
  return Number.isNaN(parsed.getTime()) ? value : new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(parsed);
}
