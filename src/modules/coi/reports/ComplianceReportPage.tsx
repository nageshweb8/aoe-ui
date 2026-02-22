'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import FormControl from '@mui/material/FormControl';
import Grid2 from '@mui/material/Grid2';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';

import { PageShell } from '@shared/components';

/**
 * Compliance Report Page — Filterable compliance report
 * showing vendor/building compliance status.
 *
 * Filters: building, vendor, date range, compliance status.
 * Export to PDF/CSV.
 *
 * TODO: Wire to reportService.getComplianceReport() once API is ready.
 */
export function ComplianceReportPage() {
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <PageShell
          title="Compliance Report"
          description="View and export vendor COI compliance data"
        />
        <Button variant="outlined" size="small" disabled>
          Export Report
        </Button>
      </Box>

      {/* Filters */}
      <Card sx={{ mt: 2, mb: 3 }}>
        <CardContent sx={{ p: 2 }}>
          <Grid2 container spacing={2} alignItems="center">
            <Grid2 size={{ xs: 12, sm: 3 }}>
              <FormControl size="small" fullWidth>
                <InputLabel>Building</InputLabel>
                <Select label="Building" value="" disabled>
                  <MenuItem value="">All Buildings</MenuItem>
                </Select>
              </FormControl>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 3 }}>
              <FormControl size="small" fullWidth>
                <InputLabel>Status</InputLabel>
                <Select label="Status" value="" disabled>
                  <MenuItem value="">All Statuses</MenuItem>
                  <MenuItem value="compliant">Compliant</MenuItem>
                  <MenuItem value="non_compliant">Non-Compliant</MenuItem>
                  <MenuItem value="expiring">Expiring Soon</MenuItem>
                </Select>
              </FormControl>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 3 }}>
              <FormControl size="small" fullWidth>
                <InputLabel>Vendor</InputLabel>
                <Select label="Vendor" value="" disabled>
                  <MenuItem value="">All Vendors</MenuItem>
                </Select>
              </FormControl>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 3 }}>
              <Button variant="contained" size="small" fullWidth disabled>
                Apply Filters
              </Button>
            </Grid2>
          </Grid2>
        </CardContent>
      </Card>

      {/* Report content placeholder */}
      <Card>
        <CardContent>
          <Box
            sx={{
              p: 4,
              borderRadius: 2,
              border: '2px dashed',
              borderColor: 'divider',
              textAlign: 'center',
              color: 'text.secondary',
              minHeight: 300,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="body1" color="text.secondary">
              Compliance report data table — Coming Soon
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
