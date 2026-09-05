const Link = 'a';
import type { Metadata } from 'next';
import { LandingRecords } from '@/components/landing-records';
import { SiteFooter, SiteHeader } from '@/components/site-header';
import { opportunities, siteUrl } from '@/lib/library';
import { JsonLd } from '@/lib/structured-data';

export const metadata: Metadata = { title: 'Fully Funded Graduate Opportunities', description: 'Official-source graduate funding records classified as fully funded for Data, AI and related fields.', alternates: { canonical: `${siteUrl}/fully-funded/` } };
export default function FullyFundedPage() { const items = opportunities.filter((item) => item.funding_classification === 'FULLY_FUNDED'); return <main><JsonLd data={{ '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Fully funded graduate opportunities', url: `${siteUrl}/fully-funded/` }} /><SiteHeader /><article className="landing-page site-shell"><p className="kicker">Funding guide</p><h1>Fully funded graduate opportunities.</h1><p>These records are classified as fully funded based on the official sources reviewed for Scholarship Atlas. Coverage can change, so verify every detail directly with the provider.</p><LandingRecords items={items} /><Link className="directory-link" href="/directory">Browse every funding opportunity</Link></article><SiteFooter /></main>; }
