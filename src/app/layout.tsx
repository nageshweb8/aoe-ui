import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

import { Providers, AdminLayout, AOE_BRAND } from '@shell';
import './globals.css';

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
    <html lang="en" suppressHydrationWarning>
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
