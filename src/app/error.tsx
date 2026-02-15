'use client';

import { useEffect } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

interface ErrorPageProps {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log to error reporting service in production
    console.error('[ErrorBoundary]', error);
  }, [error]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center',
        gap: 2,
      }}
    >
      <Typography variant="h1" sx={{ fontWeight: 800, fontSize: '4rem', color: 'error.main' }}>
        Error
      </Typography>
      <Typography variant="h5" sx={{ fontWeight: 600 }}>
        Something went wrong
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 480 }}>
        An unexpected error occurred. Please try again or contact support if the problem persists.
      </Typography>
      <Button variant="contained" onClick={reset} sx={{ mt: 2 }}>
        Try Again
      </Button>
    </Box>
  );
}
