'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid2 from '@mui/material/Grid2';
import Switch from '@mui/material/Switch';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { PageShell } from '@shared/components';

/**
 * Notification Settings Page — Configure email notifications
 * for COI-related events: expirations, new uploads, rejections, etc.
 *
 * Also shows the notification log (sent notifications history).
 *
 * TODO: Wire to reportService.getNotificationSettings() & getNotificationLog()
 */
export function NotificationSettingsPage() {
  return (
    <Box>
      <PageShell
        title="Notifications"
        description="Configure email alerts and view notification history"
      />

      <Grid2 container spacing={3} sx={{ mt: 1 }}>
        {/* Settings Card */}
        <Grid2 size={{ xs: 12, md: 5 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Notification Settings
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Expiry Reminders
                </Typography>
                <TextField
                  label="Days before expiry"
                  placeholder="30, 60, 90"
                  size="small"
                  fullWidth
                  disabled
                  helperText="Comma-separated days before expiry to send reminders"
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Event Notifications
              </Typography>

              {[
                { label: 'COI Uploaded', description: 'When a new COI is uploaded' },
                { label: 'COI Approved', description: 'When a COI is approved' },
                { label: 'COI Rejected', description: 'When a COI is rejected' },
                { label: 'COI Expiring', description: 'When a COI is about to expire' },
                { label: 'Non-Compliance', description: 'When compliance issues are detected' },
                { label: 'Override Applied', description: 'When a manual override is used' },
              ].map((event) => (
                <FormControlLabel
                  key={event.label}
                  control={<Switch size="small" disabled />}
                  label={
                    <Box>
                      <Typography variant="body2">{event.label}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {event.description}
                      </Typography>
                    </Box>
                  }
                  sx={{ display: 'flex', mb: 1 }}
                />
              ))}

              <Box sx={{ mt: 3 }}>
                <Button variant="contained" size="small" disabled>
                  Save Settings
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid2>

        {/* Notification Log */}
        <Grid2 size={{ xs: 12, md: 7 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Notification Log
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Event</TableCell>
                      <TableCell>Recipient</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={4}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ textAlign: 'center', py: 4 }}
                        >
                          No notifications sent yet
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>
    </Box>
  );
}
