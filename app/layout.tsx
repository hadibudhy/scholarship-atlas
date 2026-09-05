import type { Metadata } from 'next';
import './globals.css';
import { AnalyticsPageTracker } from '@/components/analytics';
import { JsonLd } from '@/lib/structured-data';
import { siteUrl } from '@/lib/library';
import { serverAnalyticsBootstrap } from '@/lib/analytics';

export const metadata: Metadata = {
  title: { default: 'Scholarship Atlas | Data & AI Graduate Funding', template: '%s | Scholarship Atlas' },
  description: 'An official-source directory of graduate funding for Data, AI, machine learning and related fields.',
  metadataBase: new URL('https://hadibudhy.github.io'),
  alternates: { canonical: `${siteUrl}/` },
  robots: { index: true, follow: true },
  openGraph: { type: 'website', siteName: 'Scholarship Atlas', title: 'Scholarship Atlas | Data & AI Graduate Funding', description: 'Official-source graduate funding records for Data, AI and related fields.', url: `${siteUrl}/` },
  twitter: { card: 'summary', title: 'Scholarship Atlas | Data & AI Graduate Funding', description: 'Official-source graduate funding records for Data, AI and related fields.' },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const analyticsBootstrap = serverAnalyticsBootstrap();
  return (
    <html lang="en">
      <body>{analyticsBootstrap ? <><script async src={`https://www.googletagmanager.com/gtag/js?id=${analyticsBootstrap.id}`} /><script dangerouslySetInnerHTML={{ __html: analyticsBootstrap.script }} /></> : null}<AnalyticsPageTracker /><JsonLd data={{ '@context': 'https://schema.org', '@graph': [
        { '@type': 'Organization', name: 'Scholarship Atlas', url: `${siteUrl}/`, sameAs: ['https://hadibudhy.github.io/', 'https://www.linkedin.com/in/hadibudhy'] },
        { '@type': 'WebSite', name: 'Scholarship Atlas', url: `${siteUrl}/`, description: 'Official-source graduate funding directory for Data, AI and related fields.' },
      ] }} />{children}</body>
    </html>
  );
}
