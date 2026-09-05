export type AnalyticsEvent = 'scholarship_search' | 'filter_applied' | 'filter_cleared' | 'directory_page_view' | 'scholarship_view' | 'official_source_click' | 'application_link_click' | 'related_scholarship_click' | 'guide_view' | 'no_results';
export type AnalyticsProperties = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const measurementId = typeof process === 'undefined' ? '' : process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? '';
const consentRequired = typeof process !== 'undefined' && process.env.NEXT_PUBLIC_ANALYTICS_REQUIRE_CONSENT === 'true';
let consentGranted = !consentRequired;
let initialized = false;

function canTrack() {
  return typeof window !== 'undefined'
    && process.env.NODE_ENV === 'production'
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

export function trackPageView(path: string) {
  if (!canTrack()) return;
  loadAnalytics();
  gtag('event', 'page_view', { page_location: `${window.location.origin}${path}`, page_path: path, transport_type: 'beacon' });
}
