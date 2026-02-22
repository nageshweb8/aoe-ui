'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid2 from '@mui/material/Grid2';
import LinearProgress from '@mui/material/LinearProgress';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { ArrowLeft, Building2, Mail, MapPin, Phone, ShieldCheck, User } from 'lucide-react';

import { PageShell } from '@shared/components';

import { StatusBadge } from '../shared/components';

import { useVendor } from './useVendorStore';
import type { VendorStatus } from './vendor.types';

// ── Helpers ──────────────────────────────────────────────────────────

const STATUS_VARIANT: Record<VendorStatus, 'success' | 'error' | 'warning'> = {
  active: 'success',
  expired: 'error',
  pending: 'warning',
  rejected: 'error',
};

function complianceColor(pct: number): 'success' | 'warning' | 'error' {
  if (pct >= 80) {
    return 'success';
  }
  if (pct >= 50) {
    return 'warning';
  }
  return 'error';
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// ── Detail field ─────────────────────────────────────────────────────

interface DetailRowProps {
  readonly icon: React.ReactNode;
  readonly label: string;
  readonly value: string | undefined;
}

function DetailRow({ icon, label, value }: DetailRowProps) {
  if (!value) {
    return null;
  }
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 1.5 }}>
      <Box sx={{ color: 'text.secondary', mt: 0.25 }}>{icon}</Box>
      <Box>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="body2">{value}</Typography>
      </Box>
    </Box>
  );
}

// ── Component ────────────────────────────────────────────────────────

/**
 * Vendor Detail Page — Shows vendor info, assigned buildings,
 * COI history per building, compliance status, and action buttons.
 *
 * Uses `useParams()` to extract the vendor ID from the route.
 */
export function VendorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const vendor = useVendor(id);

  if (!vendor) {
    return (
      <Box>
        <Button
          component={Link}
          href="/certificate-of-insurance/vendors"
          startIcon={<ArrowLeft size={16} />}
          size="small"
          sx={{ mb: 2 }}
        >
          Back to Vendors
        </Button>
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h6" color="text.secondary">
              Vendor not found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              The vendor you are looking for does not exist or has been removed.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  const fullAddress = [
    vendor.address.street,
    `${vendor.address.city}, ${vendor.address.state} ${vendor.address.zip}`,
  ].join('\n');

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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <PageShell
            title={vendor.companyName}
            description="View and manage vendor COI compliance"
          />
          <StatusBadge label={vendor.status} variant={STATUS_VARIANT[vendor.status]} />
        </Box>
      </Box>

      <Grid2 container spacing={3}>
        {/* ── Vendor Info Card ───────────────────────────────────── */}
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Vendor Information
              </Typography>

              <DetailRow icon={<MapPin size={16} />} label="Address" value={fullAddress} />
              <DetailRow
                icon={<User size={16} />}
                label="Contact"
                value={
                  vendor.contact.jobTitle
                    ? `${vendor.contact.name} — ${vendor.contact.jobTitle}`
                    : vendor.contact.name
                }
              />
              <DetailRow icon={<Mail size={16} />} label="Email" value={vendor.contact.email} />
              <DetailRow icon={<Phone size={16} />} label="Phone" value={vendor.contact.phone} />

              {vendor.agent ? (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>
                    Insurance Agent / Broker
                  </Typography>
                  <DetailRow
                    icon={<ShieldCheck size={16} />}
                    label="Agent"
                    value={
                      vendor.agent.company
                        ? `${vendor.agent.name} — ${vendor.agent.company}`
                        : vendor.agent.name
                    }
                  />
                  <DetailRow
                    icon={<Mail size={16} />}
                    label="Agent Email"
                    value={vendor.agent.email}
                  />
                  <DetailRow
                    icon={<Phone size={16} />}
                    label="Agent Phone"
                    value={vendor.agent.phone}
                  />
                </>
              ) : null}

              <Divider sx={{ my: 2 }} />
              <Typography variant="caption" color="text.secondary">
                Created {formatDate(vendor.createdAt)} · Updated {formatDate(vendor.updatedAt)}
              </Typography>
            </CardContent>
          </Card>
        </Grid2>

        {/* ── Compliance & Buildings ─────────────────────────────── */}
        <Grid2 size={{ xs: 12, md: 8 }}>
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
                  Building Assignments & Compliance
                </Typography>
                <Chip
                  icon={<Building2 size={14} />}
                  label={`${vendor.buildingIds.length} building${vendor.buildingIds.length === 1 ? '' : 's'}`}
                  size="small"
                  variant="outlined"
                />
              </Box>

              {/* Overall compliance bar */}
              <Box sx={{ mb: 3 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 0.5,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Overall Compliance
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    color={`${complianceColor(vendor.compliancePercentage)}.main`}
                  >
                    {vendor.compliancePercentage}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={vendor.compliancePercentage}
                  color={complianceColor(vendor.compliancePercentage)}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>

              {vendor.buildingIds.length > 0 ? (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Building ID</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {vendor.buildingIds.map((bid) => (
                        <TableRow key={bid}>
                          <TableCell>{bid}</TableCell>
                          <TableCell>
                            <StatusBadge
                              label={
                                vendor.compliancePercentage >= 80 ? 'Compliant' : 'Review Needed'
                              }
                              variant={vendor.compliancePercentage >= 80 ? 'success' : 'warning'}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
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
                  No buildings assigned yet
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid2>

        {/* ── COI History ───────────────────────────────────────── */}
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
                  <Chip
                    label={`${vendor.coiCount} certificate${vendor.coiCount === 1 ? '' : 's'}`}
                    size="small"
                    variant="outlined"
                  />
                  <Button variant="outlined" size="small">
                    Request COI
                  </Button>
                  <Button variant="contained" size="small">
                    Upload COI
                  </Button>
                </Box>
              </Box>
              <Divider sx={{ mb: 2 }} />
              {vendor.coiCount > 0 ? (
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    border: '2px dashed',
                    borderColor: 'divider',
                    textAlign: 'center',
                    color: 'text.secondary',
                    minHeight: 100,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  COI document list will appear here once document tracking is implemented
                </Box>
              ) : (
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    border: '2px dashed',
                    borderColor: 'divider',
                    textAlign: 'center',
                    color: 'text.secondary',
                    minHeight: 100,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  No COI documents on file — request or upload one to get started
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>
    </Box>
  );
}
