import type { MetadataRoute } from 'next';
import { opportunities } from '@/lib/library';

const baseUrl = 'https://hadibudhy.github.io/scholarship-atlas';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${baseUrl}/`, lastModified: new Date('2026-09-04') },
    { url: `${baseUrl}/directory/`, lastModified: new Date('2026-09-04') },
    { url: `${baseUrl}/about/`, lastModified: new Date('2026-09-04') },
    ...opportunities.map((record) => ({
      url: `${baseUrl}/opportunities/${record.opportunity_id}/`,
      lastModified: new Date(record.last_verified ?? '2026-01-01'),
    })),
  ];
}
