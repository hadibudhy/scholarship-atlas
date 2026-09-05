import type { MetadataRoute } from 'next';
import { countryLandingPages, fieldLandingPages, opportunities, siteUrl } from '@/lib/library';

const baseUrl = siteUrl;

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${baseUrl}/`, lastModified: new Date('2026-09-04') },
    { url: `${baseUrl}/directory/`, lastModified: new Date('2026-09-04') },
    { url: `${baseUrl}/about/`, lastModified: new Date('2026-09-04') },
    { url: `${baseUrl}/fully-funded/`, lastModified: new Date('2026-09-05') },
    { url: `${baseUrl}/privacy/`, lastModified: new Date('2026-09-04') },
    { url: `${baseUrl}/terms/`, lastModified: new Date('2026-09-04') },
    ...fieldLandingPages.map((page) => ({ url: `${baseUrl}/fields/${page.slug}/`, lastModified: new Date('2026-09-05') })),
    ...countryLandingPages.map((page) => ({ url: `${baseUrl}/countries/${page.slug}/`, lastModified: new Date('2026-09-05') })),
    ...opportunities.map((record) => ({
      url: `${baseUrl}/opportunities/${record.opportunity_id}/`,
      lastModified: new Date(record.last_verified ?? '2026-01-01'),
    })),
  ];
}
