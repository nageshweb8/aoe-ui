'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import LinearProgress from '@mui/material/LinearProgress';
import { alpha } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { Eye, Plus, Search } from 'lucide-react';

import { PageShell } from '@shared/components';

import { EmptyState, StatusBadge } from '../shared/components';

import { useVendors } from './useVendorStore';
import type { VendorStatus } from './vendor.types';

// ── Helpers ─────────────────────────────────────────────────────────

const STATUS_VARIANT: Record<VendorStatus, 'success' | 'error' | 'warning' | 'info'> = {
  active: 'success',
  expired: 'error',
  pending: 'warning',
  rejected: 'error',
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function complianceColor(pct: number): 'success' | 'warning' | 'error' {
  if (pct >= 80) {
    return 'success';
  }
  if (pct >= 50) {
    return 'warning';
  }
  return 'error';
}

/**
 * Vendor List Page — Data grid showing all vendors with status,
 * buildings assigned, COI count, compliance %, and last updated.
 */
export function VendorListPage() {
  const vendors = useVendors();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) {
      return vendors;
    }
    const q = search.toLowerCase();
    return vendors.filter(
      (v) =>
        v.companyName.toLowerCase().includes(q) ||
        v.contact.name.toLowerCase().includes(q) ||
        v.status.includes(q),
    );
  }, [vendors, search]);

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <PageShell
          title="Vendors"
          description="Manage vendors and their certificate of insurance compliance"
        />
        <Button
          variant="contained"
          startIcon={<Plus size={18} />}
          component={Link}
          href="/certificate-of-insurance/vendors/add"
          size="small"
        >
          Add Vendor
        </Button>
      </Box>

      {/* Search */}
      <Box sx={{ mb: 2 }}>
        <TextField
          size="small"
          placeholder="Search vendors…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={16} />
                </InputAdornment>
              ),
            },
          }}
          sx={{ width: { xs: '100%', sm: 320 } }}
        />
      </Box>

      <Card>
        <CardContent sx={{ p: 0 }}>
          {filtered.length === 0 && !search ? (
            <EmptyState
              title="No vendors yet"
              description="Add your first vendor to start tracking their COI compliance."
              action={
                <Button
                  variant="outlined"
                  startIcon={<Plus size={16} />}
                  component={Link}
                  href="/certificate-of-insurance/vendors/add"
                  size="small"
                >
                  Add Vendor
                </Button>
              }
            />
          ) : null}
          {filtered.length === 0 && search ? (
            <EmptyState title="No results" description={`No vendors match "${search}".`} />
          ) : null}
          {filtered.length > 0 ? (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Vendor Name</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 700, textAlign: 'center' }}>Buildings</TableCell>
                    <TableCell sx={{ fontWeight: 700, textAlign: 'center' }}>COIs</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Compliance</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Last Updated</TableCell>
                    <TableCell sx={{ fontWeight: 700, textAlign: 'center' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.map((vendor) => (
                    <TableRow key={vendor.id} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {vendor.companyName}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {vendor.contact.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <StatusBadge
                          label={vendor.status}
                          variant={STATUS_VARIANT[vendor.status]}
                        />
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Chip label={vendor.buildingIds.length} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>{vendor.coiCount}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 120 }}>
                          <LinearProgress
                            variant="determinate"
                            value={vendor.compliancePercentage}
                            color={complianceColor(vendor.compliancePercentage)}
                            sx={{
                              flex: 1,
                              height: 6,
                              borderRadius: 3,
                              bgcolor: (t) => alpha(t.palette.text.primary, 0.08),
                            }}
                          />
                          <Typography variant="caption" sx={{ fontWeight: 600, minWidth: 32 }}>
                            {vendor.compliancePercentage}%
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {formatDate(vendor.updatedAt)}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Tooltip title="View Details">
                          <IconButton
                            component={Link}
                            href={`/certificate-of-insurance/vendors/${vendor.id}`}
                            size="small"
                          >
                            <Eye size={16} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : null}
        </CardContent>
      </Card>
    </Box>
  );
}
