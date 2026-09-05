import Link from 'next/link';
import type { Opportunity } from '@/lib/library';

export function CrawlableScholarshipIndex({ items, heading = 'All scholarship records' }: { items: Opportunity[]; heading?: string }) {
  return <section className="crawlable-index" aria-labelledby="crawlable-index-title">
    <p className="kicker">Browse every record</p>
    <h2 id="crawlable-index-title">{heading}</h2>
    <p>Every link below leads to a permanent record page with funding, requirements, dates and official source links.</p>
    <ul>{items.map((item) => <li key={item.opportunity_id}><Link href={`/opportunities/${item.opportunity_id}`}>View {item.name}</Link></li>)}</ul>
  </section>;
}
