const Link = 'a';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LandingRecords } from '@/components/landing-records';
import { SiteFooter, SiteHeader } from '@/components/site-header';
import { fieldLandingPages, opportunitiesForField, siteUrl } from '@/lib/library';
import { JsonLd } from '@/lib/structured-data';

export function generateStaticParams() { return fieldLandingPages.map(({ slug }) => ({ slug })); }
export const dynamicParams = false;
export function generateMetadata({ params }: { params: { slug: string } }): Metadata { const page = fieldLandingPages.find((item) => item.slug === params.slug); return page ? { title: `${page.label} Funding`, description: page.description, alternates: { canonical: `${siteUrl}/fields/${page.slug}/` } } : {}; }

export default function FieldPage({ params }: { params: { slug: string } }) { const page = fieldLandingPages.find((item) => item.slug === params.slug); if (!page) notFound(); const items = opportunitiesForField(page.field); const url = `${siteUrl}/fields/${page.slug}/`; return <main><JsonLd data={{ '@context': 'https://schema.org', '@type': 'CollectionPage', name: `${page.label} funding`, description: page.description, url }} /><SiteHeader /><article className="landing-page site-shell"><p className="kicker">Field guide</p><h1>{page.label} funding opportunities.</h1><p>{page.description} The records below remain connected to their official provider sources and individual verification dates.</p><LandingRecords items={items} /><Link className="directory-link" href="/directory">Browse the full scholarship directory</Link></article><SiteFooter /></main>; }
