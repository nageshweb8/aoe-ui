import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

interface ChartPlaceholderProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly height?: number;
}

export function ChartPlaceholder({ title, subtitle, height = 300 }: ChartPlaceholderProps) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 3, height: '100%' }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            height,
            borderRadius: 2,
            bgcolor: 'action.hover',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px dashed',
            borderColor: 'divider',
          }}
        >
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Chart Component
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
