'use client';

import Link from 'next/link';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Grid2 from '@mui/material/Grid2';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { ArrowLeft } from 'lucide-react';

import { PageShell } from '@shared/components';

/**
 * Add Vendor Page — Single-screen wizard to create a vendor
 * with company info, contact details, and insurance agent info.
 *
 * Design principle: "Fewer steps than the competitor — consolidate
 * into a single-screen wizard" (COI-UI-Enhancement-Plan §6).
 *
 * TODO: Wire form submission to vendorService.createVendor().
 */
export function AddVendorPage() {
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
        <PageShell
          title="Add Vendor"
          description="Register a new vendor and capture their company, contact, and insurance agent details"
        />
      </Box>

      <Card>
        <CardContent sx={{ p: 3 }}>
          {/* Company Information */}
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Company Information
          </Typography>
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12 }}>
              <TextField fullWidth label="Company Name" required size="small" />
            </Grid2>
            <Grid2 size={{ xs: 12 }}>
              <TextField fullWidth label="Street Address" required size="small" />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 4 }}>
              <TextField fullWidth label="City" required size="small" />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 4 }}>
              <TextField fullWidth label="State" required size="small" />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 4 }}>
              <TextField fullWidth label="ZIP Code" required size="small" />
            </Grid2>
          </Grid2>

          <Divider sx={{ my: 3 }} />

          {/* Primary Contact */}
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Primary Contact
          </Typography>
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Contact Name" required size="small" />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Job Title" size="small" />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Email" type="email" required size="small" />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Phone" type="tel" size="small" />
            </Grid2>
          </Grid2>

          <Divider sx={{ my: 3 }} />

          {/* Insurance Agent */}
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Insurance Agent / Broker
          </Typography>
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Agent Name" size="small" />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Agent Company" size="small" />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Agent Email" type="email" size="small" />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Agent Phone" type="tel" size="small" />
            </Grid2>
          </Grid2>

          <Divider sx={{ my: 3 }} />

          {/* Building Assignment */}
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Building Assignment
          </Typography>
          <Box
            sx={{
              p: 3,
              borderRadius: 2,
              border: '2px dashed',
              borderColor: 'divider',
              textAlign: 'center',
              color: 'text.secondary',
            }}
          >
            Multi-select building assignment — Coming Soon
          </Box>

          {/* Actions */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
            <Button variant="outlined" component={Link} href="/certificate-of-insurance/vendors">
              Cancel
            </Button>
            <Button variant="contained" disabled>
              Save Vendor
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
