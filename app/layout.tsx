import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Scholarship Atlas | Data & AI Master\'s Funding',
  description: 'An official-source library of Master\'s scholarships and funding opportunities in Data, AI and related fields.',
  metadataBase: new URL('https://hadibudhy.github.io/scholarship-atlas'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
