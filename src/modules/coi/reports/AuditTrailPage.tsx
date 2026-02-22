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
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { PageShell } from '@shared/components';

/**
 * Audit Trail Page — Shows a chronological log of all COI-related
 * actions: uploads, approvals, rejections, overrides, edits, etc.
 *
 * Filterable by user, action type, date range.
 *
 * TODO: Wire to reportService.getAuditTrail() once API is ready.
 */
export function AuditTrailPage() {
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <PageShell title="Audit Trail" description="Review all COI-related actions and changes" />
        <Button variant="outlined" size="small" disabled>
          Export Log
        </Button>
      </Box>

      {/* Filters */}
      <Card sx={{ mt: 2, mb: 3 }}>
        <CardContent sx={{ p: 2 }}>
          <Grid2 container spacing={2} alignItems="center">
            <Grid2 size={{ xs: 12, sm: 4 }}>
              <FormControl size="small" fullWidth>
                <InputLabel>Action Type</InputLabel>
                <Select label="Action Type" value="" disabled>
                  <MenuItem value="">All Actions</MenuItem>
                  <MenuItem value="upload">Upload</MenuItem>
                  <MenuItem value="approve">Approval</MenuItem>
                  <MenuItem value="reject">Rejection</MenuItem>
                  <MenuItem value="override">Override</MenuItem>
                </Select>
              </FormControl>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 4 }}>
              <FormControl size="small" fullWidth>
                <InputLabel>User</InputLabel>
                <Select label="User" value="" disabled>
                  <MenuItem value="">All Users</MenuItem>
                </Select>
              </FormControl>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 4 }}>
              <Button variant="contained" size="small" fullWidth disabled>
                Apply Filters
              </Button>
            </Grid2>
          </Grid2>
        </CardContent>
      </Card>

      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Action</TableCell>
                  <TableCell>Entity</TableCell>
                  <TableCell>Details</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={5}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ textAlign: 'center', py: 4 }}
                    >
                      Audit trail entries — Coming Soon
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
