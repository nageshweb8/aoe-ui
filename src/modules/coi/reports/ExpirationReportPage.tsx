'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { PageShell } from '@shared/components';

/**
 * Expiration Report Page — Shows upcoming and past COI expirations.
 *
 * Default view: next 30/60/90 day expirations.
 * Includes quick actions to send renewal reminders.
 *
 * TODO: Wire to reportService.getExpirationReport() once API is ready.
 */
export function ExpirationReportPage() {
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <PageShell
          title="Expiration Report"
          description="Track upcoming and expired COI documents"
        />
        <Button variant="outlined" size="small" disabled>
          Export Report
        </Button>
      </Box>

      {/* Time range chips */}
      <Box sx={{ display: 'flex', gap: 1, mt: 2, mb: 3 }}>
        {['30 Days', '60 Days', '90 Days', 'Expired'].map((range) => {
          const colorMap: Record<string, 'error' | 'primary' | 'default'> = {
            Expired: 'error',
            '30 Days': 'primary',
          };
          const chipColor = colorMap[range] ?? 'default';
          return (
            <Chip
              key={range}
              label={range}
              variant={range === '30 Days' ? 'filled' : 'outlined'}
              color={chipColor}
              size="small"
              clickable
            />
          );
        })}
      </Box>

      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Vendor</TableCell>
                  <TableCell>Building</TableCell>
                  <TableCell>Policy Type</TableCell>
                  <TableCell>Expiration Date</TableCell>
                  <TableCell>Days Remaining</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={7}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ textAlign: 'center', py: 4 }}
                    >
                      Expiration data — Coming Soon
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}
