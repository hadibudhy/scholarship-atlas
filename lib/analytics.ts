export type AnalyticsEvent = 'scholarship_search' | 'filter_applied' | 'filter_cleared' | 'directory_page_view' | 'scholarship_view' | 'official_source_click' | 'application_link_click' | 'related_scholarship_click' | 'guide_view' | 'no_results';
export type AnalyticsProperties = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    __scholarshipAtlasInitialPagePath?: string;
  }
}

const viteEnv = (import.meta as ImportMeta & { env?: ImportMetaEnv }).env;
const measurementId = __SCHOLARSHIP_ATLAS_GA_MEASUREMENT_ID__;
const consentRequired = (typeof process !== 'undefined' ? process.env.VITE_ANALYTICS_REQUIRE_CONSENT : viteEnv?.VITE_ANALYTICS_REQUIRE_CONSENT) === 'true';
let consentGranted = !consentRequired;
let initialized = false;

export function normalizedRoutePath(path: string) {
  return path.replace(/^\/scholarship-atlas(?=\/|$)/, '') || '/';
}

export function serverAnalyticsBootstrap() {
  const id = __SCHOLARSHIP_ATLAS_GA_MEASUREMENT_ID__;
  const requiresConsent = (process.env.VITE_ANALYTICS_REQUIRE_CONSENT ?? viteEnv?.VITE_ANALYTICS_REQUIRE_CONSENT) === 'true';
  if (!id || requiresConsent) return null;
  return { id, script: `window.dataLayer=window.dataLayer||[];window.gtag=function(){window.dataLayer.push(arguments)};window.gtag('js',new Date());window.gtag('config','${id}',{send_page_view:false});window.__scholarshipAtlasInitialPagePath=(window.location.pathname.replace(/^\\/scholarship-atlas(?=\\/|$)/,'')||'/');window.gtag('event','page_view',{page_location:window.location.origin+window.location.pathname,page_path:window.location.pathname,page_title:document.title,transport_type:'beacon'});` };
}

function canTrack() {
  return typeof window !== 'undefined'
    && (typeof process === 'undefined' ? viteEnv?.PROD : process.env.NODE_ENV === 'production')
    && Boolean(measurementId)
    && consentGranted
    && !['localhost', '127.0.0.1', '::1'].includes(window.location.hostname);
}

function gtag(...args: unknown[]) {
  window.dataLayer ??= [];
  if (window.gtag) window.gtag(...args);
  else window.dataLayer.push(args);
}

export function setAnalyticsConsent(granted: boolean) {
  consentGranted = granted;
  if (typeof window === 'undefined') return;
  gtag('consent', 'update', { analytics_storage: granted ? 'granted' : 'denied' });
  if (granted) loadAnalytics();
}

export function loadAnalytics() {
  if (!canTrack() || initialized) return;
  initialized = true;
  if (window.gtag) return;
  window.dataLayer ??= [];
  window.gtag = (...args: unknown[]) => window.dataLayer?.push(args);
  gtag('js', new Date());
  gtag('config', measurementId, { send_page_view: false });
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.append(script);
}

export function trackEvent(name: AnalyticsEvent, properties: AnalyticsProperties = {}) {
  if (!canTrack()) return;
  loadAnalytics();
  gtag('event', name, { ...properties, transport_type: 'beacon' });
}

export function trackPageView(_path: string) {
  if (!canTrack()) return;
  loadAnalytics();
  gtag('event', 'page_view', { page_location: `${window.location.origin}${window.location.pathname}`, page_path: window.location.pathname, transport_type: 'beacon' });
}
