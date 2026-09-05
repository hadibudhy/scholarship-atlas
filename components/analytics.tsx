'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { normalizedRoutePath, trackEvent, trackPageView } from '@/lib/analytics';

export function AnalyticsPageTracker() {
  const pathname = usePathname();
  const previousPath = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (!pathname || pathname === previousPath.current) return;
    previousPath.current = pathname;
    const routePath = normalizedRoutePath(pathname);
    if (window.__scholarshipAtlasInitialPagePath !== routePath) trackPageView(routePath);
    if (routePath.startsWith('/opportunities/')) {
      const fact = (label: string) => [...document.querySelectorAll('.quick-fact')].find((item) => item.querySelector('dt')?.textContent === label)?.querySelector('dd')?.textContent?.trim();
      const scholarshipSlug = routePath.split('/').filter(Boolean).at(-1) ?? '';
      trackEvent('scholarship_view', { scholarship_id: scholarshipSlug, scholarship_slug: scholarshipSlug, provider: document.querySelector('.record-provider')?.textContent?.trim(), country: fact('Country'), degree: fact('Degree'), funding_type: fact('Funding level') });
    }
    const guideSlug = routePath.match(/^\/(?:fields|countries)\/([^/]+)|^\/(fully-funded|about)\/?$/)?.slice(1).find(Boolean);
    if (guideSlug) trackEvent('guide_view', { guide_slug: guideSlug });
  }, [pathname]);
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest('a[data-analytics-link]') as HTMLAnchorElement | null;
      const routePath = normalizedRoutePath(pathname ?? '/');
      if (!anchor || !routePath.startsWith('/opportunities/')) return;
      const scholarshipId = routePath.split('/').filter(Boolean).at(-1) ?? '';
      const provider = document.querySelector('.record-provider')?.textContent?.trim();
      if (anchor.dataset.analyticsLink === 'related') {
        trackEvent('related_scholarship_click', { source_scholarship_id: scholarshipId, target_scholarship_id: anchor.dataset.targetScholarshipId });
      } else {
        trackEvent(anchor.dataset.analyticsLink === 'application' ? 'application_link_click' : 'official_source_click', { scholarship_id: scholarshipId, provider });
      }
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [pathname]);
  return null;
}
