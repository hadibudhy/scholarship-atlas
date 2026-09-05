import assert from 'node:assert/strict';

process.env.NODE_ENV = 'production';

const queued = [];
Object.assign(globalThis, {
  __SCHOLARSHIP_ATLAS_GA_MEASUREMENT_ID__: 'G-TEST123456',
  window: { location: { hostname: 'example.test', origin: 'https://example.test', pathname: '/scholarship-atlas/directory/' }, dataLayer: queued },
  document: { head: { append: () => undefined }, createElement: () => ({}) },
});

const { loadAnalytics, normalizedRoutePath, serverAnalyticsBootstrap, trackEvent, trackPageView } = await import('../lib/analytics.ts');
assert.equal(normalizedRoutePath('/scholarship-atlas/directory/'), '/directory/');
assert.equal(normalizedRoutePath('/directory/'), '/directory/');
const bootstrap = serverAnalyticsBootstrap();
assert.equal(bootstrap?.id, 'G-TEST123456');
assert.match(bootstrap?.script ?? '', /__scholarshipAtlasInitialPagePath/);
assert.match(bootstrap?.script ?? '', /gtag\('event','page_view'/);
loadAnalytics();
assert.equal(queued.length, 2, 'initialization must queue exactly js and config commands');
trackPageView('/directory');
assert.equal(queued.length, 3, 'one route change must queue one page view');
trackEvent('scholarship_search', { query_length: 4, results_count: 2 });
assert.equal(queued.length, 4, 'one product action must queue one event');
console.log('Analytics queue emits one entry per call.');
