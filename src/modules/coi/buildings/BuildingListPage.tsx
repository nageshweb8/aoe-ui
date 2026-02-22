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

import { EmptyState } from '../shared/components';

import { useBuildings, useTemplates } from './useBuildingStore';

// ── Helpers ─────────────────────────────────────────────────────────

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
 * Building List Page — Manage buildings/properties and their
 * certificate holder information and assigned requirement templates.
 */
export function BuildingListPage() {
  const buildings = useBuildings();
  const templates = useTemplates();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) {
      return buildings;
    }
    const q = search.toLowerCase();
    return buildings.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.address.city.toLowerCase().includes(q) ||
        b.certificateHolder.name.toLowerCase().includes(q),
    );
  }, [buildings, search]);

  // Template name lookup
  const templateMap = useMemo(() => {
    const map = new Map<string, string>();
    templates.forEach((t) => map.set(t.id, t.name));
    return map;
  }, [templates]);

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
          title="Buildings & Properties"
          description="Manage your buildings, certificate holders, and COI requirements"
        />
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            component={Link}
            href="/certificate-of-insurance/buildings/templates"
          >
            Requirement Templates
          </Button>
          <Button
            variant="contained"
            startIcon={<Plus size={18} />}
            component={Link}
            href="/certificate-of-insurance/buildings/add"
            size="small"
          >
            Add Building
          </Button>
        </Box>
      </Box>

      {/* Search */}
      <Box sx={{ mb: 2 }}>
        <TextField
          size="small"
          placeholder="Search buildings…"
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
              title="No Buildings"
              description="Add a building or property to start managing COI requirements."
              action={
                <Button
                  variant="outlined"
                  startIcon={<Plus size={16} />}
                  component={Link}
                  href="/certificate-of-insurance/buildings/add"
                  size="small"
                >
                  Add Building
                </Button>
              }
            />
          ) : null}
          {filtered.length === 0 && search ? (
            <EmptyState title="No results" description={`No buildings match "${search}".`} />
          ) : null}
          {filtered.length > 0 ? (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Building Name</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Address</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Certificate Holder</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Template</TableCell>
                    <TableCell sx={{ fontWeight: 700, textAlign: 'center' }}>Vendors</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Compliance</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Last Updated</TableCell>
                    <TableCell sx={{ fontWeight: 700, textAlign: 'center' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.map((building) => (
                    <TableRow
                      key={building.id}
                      hover
                      sx={{ '&:last-child td': { borderBottom: 0 } }}
                    >
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {building.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" color="text.secondary">
                          {building.address.street}
                          <br />
                          {building.address.city}, {building.address.state} {building.address.zip}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" color="text.secondary">
                          {building.certificateHolder.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {building.templateId ? (
                          <Chip
                            label={templateMap.get(building.templateId) ?? building.templateId}
                            size="small"
                            variant="outlined"
                          />
                        ) : (
                          <Typography variant="caption" color="text.secondary">
                            None
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Chip label={building.vendorCount} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 120 }}>
                          <LinearProgress
                            variant="determinate"
                            value={building.compliancePercentage}
                            color={complianceColor(building.compliancePercentage)}
                            sx={{
                              flex: 1,
                              height: 6,
                              borderRadius: 3,
                              bgcolor: (t) => alpha(t.palette.text.primary, 0.08),
                            }}
                          />
                          <Typography variant="caption" sx={{ fontWeight: 600, minWidth: 32 }}>
                            {building.compliancePercentage}%
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(building.updatedAt)}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Tooltip title="View Details">
                          <IconButton
                            component={Link}
                            href={`/certificate-of-insurance/buildings/${building.id}`}
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
