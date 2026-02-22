'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  readonly title: string;
  readonly description?: string;
  readonly action?: React.ReactNode;
}

/**
 * Empty state placeholder for tables/lists with no data.
 */
export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        px: 3,
        textAlign: 'center',
      }}
    >
      <Box sx={{ color: 'text.disabled', mb: 2 }}>
        <Inbox size={48} strokeWidth={1.5} />
      </Box>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
        {title}
      </Typography>
      {description ? (
        <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 400, mb: 2 }}>
          {description}
        </Typography>
      ) : null}
      {action ?? null}
    </Box>
  );
}
