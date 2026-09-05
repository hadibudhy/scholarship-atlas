const Link = 'a';

export function SiteHeader() {
  return <header className="site-header"><div className="site-shell header-inner"><Link className="wordmark" href="/"><span className="wordmark-mark" aria-hidden="true">SA</span><span>Scholarship Atlas</span></Link><nav aria-label="Primary navigation"><Link href="/directory">Scholarship directory</Link><Link href="/fully-funded">Fully funded routes</Link><Link href="/about">Methodology and about</Link></nav></div></header>;
}

export function SiteFooter() {
  return <footer className="site-footer"><div className="site-shell footer-inner"><span>© 2026 Scholarship Atlas</span><span>Funding details change. Confirm every claim with the linked official source.</span><nav aria-label="Explore Scholarship Atlas"><Link href="/fields/artificial-intelligence">Artificial Intelligence funding</Link><Link href="/fields/data-science">Data Science funding</Link><Link href="/countries/germany">Germany funding</Link><Link href="/countries/united-kingdom">United Kingdom funding</Link><Link href="/about">About</Link><Link href="/terms">Terms of Service</Link><Link href="/privacy">Privacy Policy</Link></nav></div></footer>;
}
