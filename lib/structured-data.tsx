import type { ReactNode } from 'react';

export function JsonLd({ data }: { data: Record<string, unknown> | Array<Record<string, unknown>> }): ReactNode {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
