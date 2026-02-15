'use client';

import { type ReactNode, useState, useSyncExternalStore } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes';

import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyles from '@mui/material/GlobalStyles';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { store } from '../store';
import { darkTheme, lightTheme } from '../theme';

interface ProvidersProps {
  readonly children: ReactNode;
}

const globalStyles = (
  <GlobalStyles
    styles={{
      '#__next': { display: 'contents' },
      'html, body': { height: '100%' },
    }}
  />
);

const emptySubscribe = () => () => {};

/** Detect client-side mount without triggering react-hooks/set-state-in-effect */
function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

function MuiThemeBridge({ children }: ProvidersProps) {
  const { resolvedTheme } = useTheme();
  const mounted = useIsMounted();

  const muiTheme = resolvedTheme === 'dark' ? darkTheme : lightTheme;

  // Prevent hydration mismatch — render with light theme on server,
  // swap once mounted on client
  if (!mounted) {
    return (
      <MuiThemeProvider theme={lightTheme}>
        <CssBaseline />
        {globalStyles}
        <div style={{ visibility: 'hidden' }}>{children}</div>
      </MuiThemeProvider>
    );
  }

  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      {globalStyles}
      {children}
    </MuiThemeProvider>
  );
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  );

  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <NextThemesProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <MuiThemeBridge>{children}</MuiThemeBridge>
        </NextThemesProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ReduxProvider>
  );
}
