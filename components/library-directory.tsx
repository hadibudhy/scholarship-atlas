'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { Opportunity } from '@/lib/library';
import { formatLabel, latestDeadline, sortedOpportunities } from '@/lib/library';

type DirectoryProps = { items: Opportunity[]; countries: string[]; fields: string[]; fundingClasses: string[]; currentStatuses: string[] };

export function LibraryDirectory({ items, countries, fields, fundingClasses, currentStatuses }: DirectoryProps) {
  const [country, setCountry] = useState(''); const [field, setField] = useState(''); const [funding, setFunding] = useState(''); const [status, setStatus] = useState(''); const [sort, setSort] = useState('recommended');
  const active = Boolean(country || field || funding || status || sort !== 'recommended');
  const filtered = useMemo(() => {
    const result = items.filter((item) => (!country || item.provider_country === country) && (!field || item.programs?.some((program) => program.field_tags?.includes(field))) && (!funding || item.funding_classification === funding) && (!status || item.current_status === status));
    return sort === 'deadline' ? [...result].sort((a, b) => (latestDeadline(a) ?? '9999').localeCompare(latestDeadline(b) ?? '9999')) : sortedOpportunities(result);
  }, [country, field, funding, status, sort, items]);
  const reset = () => { setCountry(''); setField(''); setFunding(''); setStatus(''); setSort('recommended'); };
  return <><form className="filter-panel" aria-label="Filter scholarship opportunities" onSubmit={(event) => event.preventDefault()}><div className="filter-grid"><Select id="country" label="Country or region" value={country} onChange={setCountry} options={countries} placeholder="All countries" /><Select id="field" label="Study area" value={field} onChange={setField} options={fields} placeholder="All Data and AI fields" /><Select id="funding" label="Funding level" value={funding} onChange={setFunding} options={fundingClasses} placeholder="All funding levels" /><Select id="status" label="Application status" value={status} onChange={setStatus} options={currentStatuses} placeholder="Any application status" /><Select id="sort" label="Order by" value={sort} onChange={setSort} options={['recommended', 'deadline']} placeholder="Recommended" /></div><div className="filter-actions"><output><strong>{filtered.length}</strong> matching opportunities</output><button type="button" onClick={reset} disabled={!active}>Reset filters</button></div></form><div className="results-head"><span>Funding opportunity</span><span>Programme and application state</span></div><div className="results-list">{filtered.map((record) => <DirectoryRow key={record.opportunity_id} record={record} />)}</div>{!filtered.length && <section className="empty-state" aria-live="polite"><p className="kicker">No matches</p><h3>Try a broader combination.</h3><p>Clear one or more filters to return to the full directory.</p><button type="button" onClick={reset}>Reset filters</button></section>}</>;
}

function Select({ id, label, value, onChange, options, placeholder }: { id: string; label: string; value: string; onChange: (value: string) => void; options: string[]; placeholder: string }) { return <label className="filter-field" htmlFor={id}><span>{label}</span><select id={id} value={value} onChange={(event) => onChange(event.target.value)}><option value="">{placeholder}</option>{options.map((option) => <option key={option} value={option}>{formatLabel(option)}</option>)}</select></label>; }

function DirectoryRow({ record }: { record: Opportunity }) {
  const programme = record.programs?.[0]; const deadline = latestDeadline(record);
  return <Link className="result-row" href={`/opportunities/${record.opportunity_id}`}><div className="result-title"><div className="result-labels"><span className={`status ${record.verification_status === 'VERIFIED' ? 'verified' : 'partial'}`}>{record.verification_status === 'VERIFIED' ? 'Verified' : 'Partial'}</span><span>{formatLabel(record.funding_classification)}</span></div><h3>{record.name}</h3><p>{record.provider_name} · {record.provider_country}</p></div><div className="result-meta"><p>{programme?.name ?? 'Programme details unavailable'}</p><dl><div><dt>Status</dt><dd>{formatLabel(record.current_status)}</dd></div><div><dt>Next date</dt><dd>{deadline ?? 'Not published'}</dd></div></dl><span className="view-link">View record</span></div></Link>;
}
