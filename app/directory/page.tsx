import { LibraryDirectory } from '@/components/library-directory';
import { SiteFooter, SiteHeader } from '@/components/site-header';
import { countries, currentStatuses, fields, fundingClasses, opportunities } from '@/lib/library';

export default function DirectoryPage() { return <main><SiteHeader /><section className="directory-page site-shell"><p className="kicker">Scholarship directory</p><h1>Search {opportunities.length} funding opportunities.</h1><p>Compare official-source records by funding, deadline, field, country and application requirements.</p><LibraryDirectory items={opportunities} countries={countries} fields={fields} fundingClasses={fundingClasses} currentStatuses={currentStatuses} /></section><SiteFooter /></main>; }
