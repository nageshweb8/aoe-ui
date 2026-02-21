'use client';

import Link from 'next/link';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Grid2 from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import { ArrowLeft } from 'lucide-react';

import { PageShell } from '@shared/components';

/**
 * Vendor Detail Page — Shows vendor info, assigned buildings,
 * COI history per building, compliance status, and action buttons.
 *
 * Receives vendor ID from the route params and fetches data.
 *
 * TODO: Wire to vendorService.getVendor(id) once API is ready.
 */
export function VendorDetailPage() {
  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Button
          component={Link}
          href="/certificate-of-insurance/vendors"
          startIcon={<ArrowLeft size={16} />}
          size="small"
          sx={{ mb: 1 }}
        >
          Back to Vendors
        </Button>
        <PageShell title="Vendor Details" description="View and manage vendor COI compliance" />
      </Box>

      <Grid2 container spacing={3}>
        {/* Vendor Info Card */}
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Vendor Information
              </Typography>
              <Box
                sx={{
                  p: 3,
                  borderRadius: 2,
                  border: '2px dashed',
                  borderColor: 'divider',
                  textAlign: 'center',
                  color: 'text.secondary',
                  minHeight: 200,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                Vendor info, contact, agent details — Coming Soon
              </Box>
            </CardContent>
          </Card>
        </Grid2>

        {/* Compliance & Buildings */}
        <Grid2 size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Building Assignments & Compliance
              </Typography>
              <Box
                sx={{
                  p: 3,
                  borderRadius: 2,
                  border: '2px dashed',
                  borderColor: 'divider',
                  textAlign: 'center',
                  color: 'text.secondary',
                  minHeight: 200,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                Per-building COI compliance status table — Coming Soon
              </Box>
            </CardContent>
          </Card>
        </Grid2>

        {/* COI History */}
        <Grid2 size={{ xs: 12 }}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 2,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  COI History
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button variant="outlined" size="small" disabled>
                    Request COI
                  </Button>
                  <Button variant="contained" size="small" disabled>
                    Upload COI
                  </Button>
                </Box>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Box
                sx={{
                  p: 3,
                  borderRadius: 2,
                  border: '2px dashed',
                  borderColor: 'divider',
                  textAlign: 'center',
                  color: 'text.secondary',
                  minHeight: 150,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                COI document history table — Coming Soon
              </Box>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>
    </Box>
  );
}
