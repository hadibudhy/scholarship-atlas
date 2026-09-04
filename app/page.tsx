import { LibraryDirectory } from '@/components/library-directory';
import { SiteFooter, SiteHeader } from '@/components/site-header';
import { countries, currentStatuses, fields, fundingClasses, opportunities, researchDate } from '@/lib/library';

export default function Home() {
  const verified = opportunities.filter((item) => item.verification_status === 'VERIFIED').length;
  const open = opportunities.filter((item) => ['OPEN', 'UPCOMING', 'OPEN_OR_UPCOMING', 'OPEN_OR_RECURRING', 'OPEN_OR_ROLLING'].includes(item.current_status ?? '')).length;
  return <main><SiteHeader /><section className="directory-intro site-shell"><div><p className="kicker">Master&apos;s funding intelligence</p><h1>Funding routes for Data and AI graduate study.</h1><p className="intro-copy">Browse official-source scholarship, fellowship, government and university funding records. Professor and lab leads are intentionally kept out of this public directory.</p></div><dl className="research-stats"><div><dt>Records</dt><dd>{opportunities.length}</dd></div><div><dt>Open or upcoming</dt><dd>{open}</dd></div><div><dt>Verified</dt><dd>{verified}</dd></div></dl></section>
    <section className="directory-section site-shell" id="directory"><div className="section-top"><div><p className="kicker">Directory</p><h2>Find a route that fits your situation.</h2></div><p className="research-note">Library refreshed {researchDate}</p></div><LibraryDirectory items={opportunities} countries={countries} fields={fields} fundingClasses={fundingClasses} currentStatuses={currentStatuses} /></section>
    <section className="method-section" id="method"><div className="site-shell method-inner"><div><p className="kicker">How this library is handled</p><h2>Facts stay attached to their evidence.</h2></div><div className="method-copy"><p>Every record links to its official scholarship, programme and admissions sources. Verification labels show how much of the published information has been independently confirmed.</p><p>Unknown fields remain visible instead of being guessed. Past, recurring and currently open cycles are kept so applicants can plan ahead.</p></div></div></section><SiteFooter /></main>;
}
