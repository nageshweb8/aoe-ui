'use client';

import Box from '@mui/material/Box';
import Grid2 from '@mui/material/Grid2';
import { AlertTriangle, CheckCircle, Clock, FileCheck, ShieldAlert, Users } from 'lucide-react';

import { PageShell } from '@shared/components';

import { SummaryCard } from '../shared/components';

/**
 * COI Dashboard — Summary stats, compliance trend, vendor grid,
 * upcoming expirations, and recent activity feed.
 *
 * TODO: Wire to dashboardService once API is ready.
 */
export function COIDashboardPage() {
  return (
    <Box>
      <PageShell
        title="COI Dashboard"
        description="Certificate of Insurance compliance overview and tracking"
      />

      {/* Summary Cards */}
      <Grid2 container spacing={3} sx={{ mt: 3 }}>
        <Grid2 size={{ xs: 12, sm: 6, lg: 2 }}>
          <SummaryCard title="Total Vendors" value="—" icon={Users} color="#6366f1" />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, lg: 2 }}>
          <SummaryCard title="Total COIs" value="—" icon={FileCheck} color="#3b82f6" />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, lg: 2 }}>
          <SummaryCard title="Compliant" value="—" icon={CheckCircle} color="#22c55e" />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, lg: 2 }}>
          <SummaryCard title="Non-Compliant" value="—" icon={ShieldAlert} color="#ef4444" />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, lg: 2 }}>
          <SummaryCard title="Expiring Soon" value="—" icon={Clock} color="#f59e0b" />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, lg: 2 }}>
          <SummaryCard title="Expired" value="—" icon={AlertTriangle} color="#ef4444" />
        </Grid2>
      </Grid2>

      {/* Compliance Trend Chart placeholder */}
      <Box
        sx={{
          mt: 3,
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
        Compliance Trend Chart — Coming Soon
      </Box>

      {/* Bottom row: Vendor COI Status Grid + Upcoming Expirations + Activity Feed */}
      <Grid2 container spacing={3} sx={{ mt: 1 }}>
        <Grid2 size={{ xs: 12, lg: 6 }}>
          <Box
            sx={{
              p: 4,
              borderRadius: 2,
              border: '2px dashed',
              borderColor: 'divider',
              textAlign: 'center',
              color: 'text.secondary',
              minHeight: 250,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            Vendor COI Status Grid — Coming Soon
          </Box>
        </Grid2>
        <Grid2 size={{ xs: 12, lg: 3 }}>
          <Box
            sx={{
              p: 4,
              borderRadius: 2,
              border: '2px dashed',
              borderColor: 'divider',
              textAlign: 'center',
              color: 'text.secondary',
              minHeight: 250,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            Upcoming Expirations — Coming Soon
          </Box>
        </Grid2>
        <Grid2 size={{ xs: 12, lg: 3 }}>
          <Box
            sx={{
              p: 4,
              borderRadius: 2,
              border: '2px dashed',
              borderColor: 'divider',
              textAlign: 'center',
              color: 'text.secondary',
              minHeight: 250,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            Recent Activity — Coming Soon
          </Box>
        </Grid2>
      </Grid2>
    </Box>
  );
}
