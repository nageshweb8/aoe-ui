'use client';

import { createTheme, type ThemeOptions } from '@mui/material/styles';

const AOE_PRIMARY = '#be3527';

const sharedTypography: ThemeOptions['typography'] = {
  fontFamily: '"Inter", "Roboto", "Helvetica Neue", Arial, sans-serif',
  h1: { fontWeight: 700, fontSize: '2rem', lineHeight: 1.25 },
  h2: { fontWeight: 700, fontSize: '1.5rem', lineHeight: 1.3 },
  h3: { fontWeight: 600, fontSize: '1.25rem', lineHeight: 1.35 },
  h4: { fontWeight: 600, fontSize: '1.125rem', lineHeight: 1.4 },
  h5: { fontWeight: 600, fontSize: '1rem', lineHeight: 1.45 },
  h6: { fontWeight: 600, fontSize: '0.875rem', lineHeight: 1.5 },
  subtitle1: { fontWeight: 500, fontSize: '0.9375rem' },
  subtitle2: { fontWeight: 500, fontSize: '0.8125rem' },
  body1: { fontSize: '0.9375rem', lineHeight: 1.6 },
  body2: { fontSize: '0.8125rem', lineHeight: 1.6 },
  button: { fontWeight: 600, textTransform: 'none' },
};

const sharedComponents: ThemeOptions['components'] = {
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        padding: '8px 20px',
        boxShadow: 'none',
        '&:hover': { boxShadow: 'none' },
      },
    },
    defaultProps: {
      disableElevation: true,
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        boxShadow: '0 2px 12px 0 rgba(0, 0, 0, 0.04)',
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundImage: 'none',
      },
    },
  },
  MuiDrawer: {
    styleOverrides: {
      paper: {
        borderRight: 'none',
      },
    },
  },
  MuiListItemButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        marginBottom: 2,
        '&.Mui-selected': {
          backgroundColor: AOE_PRIMARY,
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#a82e22',
          },
          '& .MuiListItemIcon-root': {
            color: '#ffffff',
          },
        },
      },
    },
  },
  MuiListItemIcon: {
    styleOverrides: {
      root: {
        minWidth: 40,
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 6,
        fontWeight: 500,
      },
    },
  },
};

const lightPalette: ThemeOptions['palette'] = {
  mode: 'light',
  primary: {
    main: AOE_PRIMARY,
    light: '#d4564a',
    dark: '#961f14',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#6366f1',
    light: '#818cf8',
    dark: '#4f46e5',
    contrastText: '#ffffff',
  },
  background: {
    default: '#f8f9fa',
    paper: '#ffffff',
  },
  text: {
    primary: '#1e293b',
    secondary: '#64748b',
  },
  divider: '#e2e8f0',
  success: { main: '#22c55e' },
  warning: { main: '#f59e0b' },
  error: { main: '#ef4444' },
  info: { main: '#3b82f6' },
};

const darkPalette: ThemeOptions['palette'] = {
  mode: 'dark',
  primary: {
    main: AOE_PRIMARY,
    light: '#d4564a',
    dark: '#961f14',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#818cf8',
    light: '#a5b4fc',
    dark: '#6366f1',
    contrastText: '#ffffff',
  },
  background: {
    default: '#0f172a',
    paper: '#1e293b',
  },
  text: {
    primary: '#f1f5f9',
    secondary: '#94a3b8',
  },
  divider: '#334155',
  success: { main: '#4ade80' },
  warning: { main: '#fbbf24' },
  error: { main: '#f87171' },
  info: { main: '#60a5fa' },
};

export const lightTheme = createTheme({
  palette: lightPalette,
  typography: sharedTypography,
  shape: { borderRadius: 8 },
  components: {
    ...sharedComponents,
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
          scrollbarColor: '#c1c1c1 transparent',
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: darkPalette,
  typography: sharedTypography,
  shape: { borderRadius: 8 },
  components: {
    ...sharedComponents,
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
          scrollbarColor: '#4a4a4a transparent',
        },
      },
    },
  },
});
