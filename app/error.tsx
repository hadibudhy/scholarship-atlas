'use client';

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) { return <main className="error-page site-shell"><p className="kicker">Directory unavailable</p><h1>We could not load this page.</h1><p>Please try again. If the issue continues, return to the directory later.</p><button type="button" onClick={reset}>Try again</button></main>; }
