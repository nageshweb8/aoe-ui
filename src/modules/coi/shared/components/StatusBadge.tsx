'use client';

import Chip from '@mui/material/Chip';

type StatusVariant = 'success' | 'error' | 'warning' | 'info' | 'default';

interface StatusBadgeProps {
  readonly label: string;
  readonly variant?: StatusVariant;
  readonly size?: 'small' | 'medium';
}

const colorMap: Record<StatusVariant, 'success' | 'error' | 'warning' | 'info' | 'default'> = {
  success: 'success',
  error: 'error',
  warning: 'warning',
  info: 'info',
  default: 'default',
};

/**
 * Reusable status badge for vendor/COI/building statuses.
 */
export function StatusBadge({ label, variant = 'default', size = 'small' }: StatusBadgeProps) {
  return (
    <Chip
      label={label}
      color={colorMap[variant]}
      size={size}
      variant="filled"
      sx={{ fontWeight: 600, textTransform: 'capitalize' }}
    />
  );
}
