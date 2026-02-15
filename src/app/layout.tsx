import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

import { AdminLayout, AOE_BRAND, Providers } from '@shell';

import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: AOE_BRAND.name,
    template: `%s | ${AOE_BRAND.shortName}`,
  },
  description: 'ALPHA Office Escalations — Enterprise Escalation Management System',
  icons: { icon: AOE_BRAND.logo },
};

interface RootLayoutProps {
  readonly children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body>
        <AppRouterCacheProvider options={{ key: 'mui' }}>
          <Providers>
            <AdminLayout>{children}</AdminLayout>
          </Providers>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
