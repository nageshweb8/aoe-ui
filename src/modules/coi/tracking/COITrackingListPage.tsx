'use client';

import Link from 'next/link';

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

import { EmptyState } from '../shared/components';

/**
 * COI Tracking List — Main worklist for all COI documents.
 * Filterable by status, vendor, building, date range.
 *
 * TODO: Wire to documentService.getCOIDocuments() once API is ready.
 */
export function COITrackingListPage() {
  // Placeholder data — replace with React Query hook
  const documents: unknown[] = [];

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <PageShell
          title="COI Tracking"
          description="Track and manage all certificates of insurance"
        />
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            component={Link}
            href="/certificate-of-insurance/tracking/pending"
            variant="outlined"
            size="small"
          >
            Pending Review
          </Button>
          <Button
            component={Link}
            href="/certificate-of-insurance/tracking/upload"
            variant="contained"
            size="small"
          >
            Upload COI
          </Button>
        </Box>
      </Box>

      {/* Status filter chips */}
      <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
        {['All', 'Pending', 'Approved', 'Non-Compliant', 'Expiring Soon', 'Expired'].map(
          (filter) => (
            <Chip
              key={filter}
              label={filter}
              variant={filter === 'All' ? 'filled' : 'outlined'}
              color={filter === 'All' ? 'primary' : 'default'}
              size="small"
              clickable
            />
          ),
        )}
      </Box>

      <Card>
        <CardContent sx={{ p: 0 }}>
          {documents.length === 0 ? (
            <EmptyState
              title="No COI Documents"
              description="Upload or request COI documents from vendors to start tracking."
              action={
                <Button
                  component={Link}
                  href="/certificate-of-insurance/tracking/upload"
                  variant="contained"
                  size="small"
                >
                  Upload COI
                </Button>
              }
            />
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Vendor</TableCell>
                    <TableCell>Building</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Effective Date</TableCell>
                    <TableCell>Expiration Date</TableCell>
                    <TableCell>Compliance</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={7}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ textAlign: 'center', py: 2 }}
                      >
                        Data rows — Coming Soon
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
