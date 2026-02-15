import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import type { SxProps, Theme } from '@mui/material/styles';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  readonly title: string;
  readonly value: string;
  readonly subtitle?: string;
  readonly icon: LucideIcon;
  readonly trend?: {
    readonly value: string;
    readonly positive: boolean;
  };
  readonly sx?: SxProps<Theme>;
}

export function StatCard({ title, value, subtitle, icon: Icon, trend, sx }: StatCardProps) {
  return (
    <Card sx={{ height: '100%', ...sx }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography
              variant="body2"
              sx={{ color: 'text.secondary', fontWeight: 500, mb: 0.5 }}
            >
              {title}
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 0.5 }}>
              {value}
            </Typography>
            {trend && (
              <Typography
                variant="body2"
                sx={{
                  color: trend.positive ? 'success.main' : 'error.main',
                  fontWeight: 500,
                  fontSize: '0.75rem',
                }}
              >
                {trend.positive ? '↑' : '↓'} {trend.value}
              </Typography>
            )}
            {subtitle && (
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              p: 1.25,
              borderRadius: 2,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon size={22} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
