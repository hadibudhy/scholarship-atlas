import Link from 'next/link';

export function SiteHeader() {
  return <header className="site-header"><div className="site-shell header-inner"><Link className="wordmark" href="/"><span className="wordmark-mark" aria-hidden="true">SA</span><span>Scholarship Atlas</span></Link><nav aria-label="Primary navigation"><Link href="/#directory">Directory</Link><Link href="/#method">How it works</Link></nav></div></header>;
}

export function SiteFooter() {
  return <footer className="site-footer"><div className="site-shell footer-inner"><span>Scholarship Atlas</span><span>Funding details change. Confirm every claim with the linked official source.</span><nav aria-label="Legal"><Link href="/terms">Terms of Service</Link><Link href="/privacy">Privacy Policy</Link></nav></div></footer>;
}
