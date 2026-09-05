import { LibraryDirectory } from '@/components/library-directory';
import { CrawlableScholarshipIndex } from '@/components/crawlable-scholarship-index';
import { SiteFooter, SiteHeader } from '@/components/site-header';
import type { Metadata } from 'next';
import { countries, currentStatuses, fields, fundingClasses, opportunities, siteUrl } from '@/lib/library';
import { JsonLd } from '@/lib/structured-data';

export const metadata: Metadata = { title: 'Scholarship Directory', description: 'Browse official-source graduate funding records for Data, AI, machine learning and related fields.', alternates: { canonical: `${siteUrl}/directory/` } };

export default function DirectoryPage() { return <main><JsonLd data={{ '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Scholarship Atlas directory', url: `${siteUrl}/directory/`, mainEntity: { '@type': 'ItemList', numberOfItems: opportunities.length, itemListElement: opportunities.map((item, index) => ({ '@type': 'ListItem', position: index + 1, url: `${siteUrl}/opportunities/${item.opportunity_id}/`, name: item.name })) } }} /><SiteHeader /><section className="directory-page site-shell"><p className="kicker">Scholarship directory</p><h1>Search {opportunities.length} graduate funding opportunities.</h1><p>Compare official-source records by funding, deadline, field, country and application requirements. Filters help people compare records, but every scholarship page remains available through ordinary links below.</p><LibraryDirectory items={opportunities} countries={countries} fields={fields} fundingClasses={fundingClasses} currentStatuses={currentStatuses} /><CrawlableScholarshipIndex items={opportunities} /></section><SiteFooter /></main>; }
