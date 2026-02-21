'use client';

import Link from 'next/link';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { ArrowLeft } from 'lucide-react';

import { PageShell } from '@shared/components';

import { EmptyState } from '../shared/components';

/**
 * Pending Review Page — Queue of COI documents awaiting review/approval.
 *
 * Approve & Reject actions with optional notes.
 * Override toggle for authorized users.
 *
 * TODO: Wire to documentService.getCOIDocuments({ status: 'pending_review' })
 */
export function PendingReviewPage() {
  const pendingItems: unknown[] = [];

  return (
    <Box>
      <Button
        component={Link}
        href="/certificate-of-insurance/tracking"
        startIcon={<ArrowLeft size={16} />}
        size="small"
        sx={{ mb: 1 }}
      >
        Back to COI Tracking
      </Button>
      <PageShell
        title="Pending Review"
        description="Review and approve or reject submitted COI documents"
      />

      <Card sx={{ mt: 3 }}>
        <CardContent sx={{ p: 0 }}>
          {pendingItems.length === 0 ? (
            <EmptyState
              title="No Pending Reviews"
              description="All COI documents have been reviewed. Check back later."
            />
          ) : (
            <>
              <Box sx={{ px: 3, pt: 2, pb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  0 documents awaiting review
                </Typography>
              </Box>
              <Divider />
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Vendor</TableCell>
                      <TableCell>Building</TableCell>
                      <TableCell>Uploaded</TableCell>
                      <TableCell>Compliance Score</TableCell>
                      <TableCell>Issues</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={6}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ textAlign: 'center', py: 2 }}
                        >
                          Review rows — Coming Soon
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
