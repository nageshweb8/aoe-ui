import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import { AlertTriangle, Building2, DollarSign, TrendingUp } from 'lucide-react';

import { ChartPlaceholder, StatCard } from '../components';

export function DashboardPage() {
  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h2" sx={{ fontWeight: 700 }}>
          Dashboard
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mt: 0.5 }}>
          ALPHA Office Escalations — Overview
        </Typography>
      </Box>

      {/* Stat Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Total Buildings"
            value="24"
            subtitle="Active properties"
            icon={Building2}
            trend={{ value: '2 new this month', positive: true }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Total Expenses"
            value="$1.2M"
            subtitle="Current year"
            icon={DollarSign}
            trend={{ value: '8.2% vs last year', positive: true }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Pending Errors"
            value="7"
            subtitle="Requires attention"
            icon={AlertTriangle}
            trend={{ value: '3 resolved today', positive: true }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Escalation Rate"
            value="94.2%"
            subtitle="Completion rate"
            icon={TrendingUp}
            trend={{ value: '1.5% improvement', positive: true }}
          />
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <ChartPlaceholder
            title="Expense Trends"
            subtitle="Monthly escalation expense overview"
            height={340}
          />
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <ChartPlaceholder title="Expense Distribution" subtitle="By category" height={340} />
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <ChartPlaceholder
            title="Building Comparison"
            subtitle="Top 10 buildings by expense"
            height={280}
          />
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <ChartPlaceholder
            title="Rent Roll Summary"
            subtitle="Occupancy and rent overview"
            height={280}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
