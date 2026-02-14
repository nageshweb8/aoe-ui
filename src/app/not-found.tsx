import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function NotFound() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center',
      }}
    >
      <Typography variant="h1" sx={{ fontWeight: 800, fontSize: '6rem', color: 'primary.main' }}>
        404
      </Typography>
      <Typography variant="h4" sx={{ mt: 2, fontWeight: 600 }}>
        Page Not Found
      </Typography>
      <Typography variant="body1" sx={{ mt: 1, color: 'text.secondary', maxWidth: 400 }}>
        The page you are looking for does not exist or has been moved.
      </Typography>
    </Box>
  );
}
