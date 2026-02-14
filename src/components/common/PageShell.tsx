import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface PageShellProps {
  readonly title: string;
  readonly description?: string;
}

export function PageShell({ title, description }: PageShellProps) {
  return (
    <Box>
      <Typography variant="h2" sx={{ fontWeight: 700 }}>
        {title}
      </Typography>
      {description && (
        <Typography variant="body1" sx={{ color: 'text.secondary', mt: 0.5 }}>
          {description}
        </Typography>
      )}
    </Box>
  );
}
