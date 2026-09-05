import Link from 'next/link';
import { SiteFooter, SiteHeader } from '@/components/site-header';

export default function NotFound() {
  return <main><SiteHeader /><section className="error-page site-shell"><p className="kicker">Page not found</p><h1>This scholarship page is not available.</h1><p>The link may be outdated, or the record may no longer be part of the public library.</p><Link className="text-link" href="/directory">Browse the scholarship directory</Link></section><SiteFooter /></main>;
}
