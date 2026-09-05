const Link = 'a';
import type { Metadata } from 'next';
import { SiteFooter, SiteHeader } from '@/components/site-header';

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'The requested Scholarship Atlas page could not be found.',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return <main><SiteHeader /><article className="legal-page site-shell"><p className="kicker">404</p><h1>That page is not in the atlas.</h1><p>It may have moved, or the link may be incomplete. Browse the directory to find a current scholarship record.</p><Link className="back-link" href="/directory">Browse the scholarship directory</Link></article><SiteFooter /></main>;
}
