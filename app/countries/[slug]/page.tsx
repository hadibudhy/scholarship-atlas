const Link = 'a';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LandingRecords } from '@/components/landing-records';
import { SiteFooter, SiteHeader } from '@/components/site-header';
import { countryLandingPages, opportunitiesForCountry, siteUrl } from '@/lib/library';
import { JsonLd } from '@/lib/structured-data';

export function generateStaticParams() { return countryLandingPages.map(({ slug }) => ({ slug })); }
export const dynamicParams = false;
export function generateMetadata({ params }: { params: { slug: string } }): Metadata { const page = countryLandingPages.find((item) => item.slug === params.slug); return page ? { title: `${page.label} Data and AI Funding`, description: page.description, alternates: { canonical: `${siteUrl}/countries/${page.slug}/` } } : {}; }

export default function CountryPage({ params }: { params: { slug: string } }) { const page = countryLandingPages.find((item) => item.slug === params.slug); if (!page) notFound(); const items = opportunitiesForCountry(page.country); const url = `${siteUrl}/countries/${page.slug}/`; return <main><JsonLd data={{ '@context': 'https://schema.org', '@type': 'CollectionPage', name: `${page.label} Data and AI funding`, description: page.description, url }} /><SiteHeader /><article className="landing-page site-shell"><p className="kicker">Country guide</p><h1>{page.label} Data and AI funding.</h1><p>{page.description} Check the linked official source on each record before applying.</p><LandingRecords items={items} /><Link className="directory-link" href="/directory">Browse the full scholarship directory</Link></article><SiteFooter /></main>; }
