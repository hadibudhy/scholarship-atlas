import Link from 'next/link';
import type { Opportunity } from '@/lib/library';
import { displayDate, displayStipend, sentence } from '@/lib/display';
import { latestDeadline } from '@/lib/library';

export function LandingRecords({ items }: { items: Opportunity[] }) {
  return <ul className="landing-records">{items.map((item) => <li key={item.opportunity_id}><Link href={`/opportunities/${item.opportunity_id}`}><strong>{item.name}</strong><span>{item.provider_name} · {item.provider_country}</span><span>Deadline: {displayDate(latestDeadline(item))} · Stipend: {displayStipend(item)} · {sentence(item.funding_classification)}</span></Link></li>)}</ul>;
}
