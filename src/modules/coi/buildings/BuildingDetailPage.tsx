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
import { ArrowLeft, Building2, FileText, Mail, MapPin, ShieldCheck, Users } from 'lucide-react';

import { PageShell } from '@shared/components';

import { StatusBadge } from '../shared/components';
import { MOCK_VENDORS } from '../vendors/vendor.mock-data';

import { POLICY_TYPE_LABELS } from './template.types';
import { useBuilding, useTemplate } from './useBuildingStore';

// ── Helpers ──────────────────────────────────────────────────────────

function complianceColor(pct: number): 'success' | 'warning' | 'error' {
  if (pct >= 80) {
    return 'success';
  }
  if (pct >= 50) {
    return 'warning';
  }
  return 'error';
}

function vendorStatusVariant(status: string): 'success' | 'warning' | 'error' {
  if (status === 'active') {
    return 'success';
  }
  if (status === 'pending') {
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
 * Building Detail Page — Shows building info, certificate holder,
 * assigned vendors, requirement template, and compliance status.
 */
export function BuildingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const building = useBuilding(id);
  const template = useTemplate(building?.templateId ?? '');

  // Get vendors assigned to this building
  const assignedVendors = MOCK_VENDORS.filter((v) => v.buildingIds.includes(id));

  if (!building) {
    return (
      <Box>
        <Button
          component={Link}
          href="/certificate-of-insurance/buildings"
          startIcon={<ArrowLeft size={16} />}
          size="small"
          sx={{ mb: 2 }}
        >
          Back to Buildings
        </Button>
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h6" color="text.secondary">
              Building not found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              The building you are looking for does not exist or has been removed.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  const fullAddress = [
    building.address.street,
    `${building.address.city}, ${building.address.state} ${building.address.zip}`,
  ].join('\n');

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Button
          component={Link}
          href="/certificate-of-insurance/buildings"
          startIcon={<ArrowLeft size={16} />}
          size="small"
          sx={{ mb: 1 }}
        >
          Back to Buildings
        </Button>
        <PageShell
          title={building.name}
          description="Building details, certificate holder, vendors, and compliance"
        />
      </Box>

      <Grid2 container spacing={3}>
        {/* ── Building Info Card ─────────────────────────────── */}
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Building Information
              </Typography>

              <DetailRow
                icon={<Building2 size={16} />}
                label="Building Name"
                value={building.name}
              />
              <DetailRow icon={<MapPin size={16} />} label="Address" value={fullAddress} />

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>
                Certificate Holder
              </Typography>
              <DetailRow
                icon={<ShieldCheck size={16} />}
                label="Holder Name"
                value={building.certificateHolder.name}
              />
              <DetailRow
                icon={<Mail size={16} />}
                label="Holder Address"
                value={building.certificateHolder.address}
              />

              <Divider sx={{ my: 2 }} />
              <Typography variant="caption" color="text.secondary">
                Created {formatDate(building.createdAt)} · Updated {formatDate(building.updatedAt)}
              </Typography>
            </CardContent>
          </Card>
        </Grid2>

        {/* ── Compliance & Vendors ───────────────────────────── */}
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
                  Assigned Vendors
                </Typography>
                <Chip
                  icon={<Users size={14} />}
                  label={`${assignedVendors.length} vendor${assignedVendors.length === 1 ? '' : 's'}`}
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
                    color={`${complianceColor(building.compliancePercentage)}.main`}
                  >
                    {building.compliancePercentage}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={building.compliancePercentage}
                  color={complianceColor(building.compliancePercentage)}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>

              {assignedVendors.length > 0 ? (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Vendor</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Contact</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Compliance</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {assignedVendors.map((vendor) => (
                        <TableRow key={vendor.id}>
                          <TableCell>
                            <Typography
                              variant="body2"
                              component={Link}
                              href={`/certificate-of-insurance/vendors/${vendor.id}`}
                              sx={{
                                fontWeight: 600,
                                color: 'primary.main',
                                textDecoration: 'none',
                                '&:hover': { textDecoration: 'underline' },
                              }}
                            >
                              {vendor.companyName}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="caption" color="text.secondary">
                              {vendor.contact.name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <StatusBadge
                              label={vendor.status}
                              variant={vendorStatusVariant(vendor.status)}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="caption"
                              fontWeight={600}
                              color={`${complianceColor(vendor.compliancePercentage)}.main`}
                            >
                              {vendor.compliancePercentage}%
                            </Typography>
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
                  No vendors assigned to this building yet
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid2>

        {/* ── Requirement Template ───────────────────────────── */}
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
                  Requirement Template
                </Typography>
                {template ? (
                  <Chip
                    icon={<FileText size={14} />}
                    label={template.name}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                ) : null}
              </Box>
              <Divider sx={{ mb: 2 }} />

              {template ? (
                <Box>
                  {template.description ? (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {template.description}
                    </Typography>
                  ) : null}

                  <Grid2 container spacing={2} sx={{ mb: 2 }}>
                    <Grid2 size={{ xs: 12, sm: 4 }}>
                      <StatusBadge
                        label={
                          template.additionalInsuredRequired
                            ? 'Additional Insured Required'
                            : 'Additional Insured Not Required'
                        }
                        variant={template.additionalInsuredRequired ? 'success' : 'default'}
                      />
                    </Grid2>
                    <Grid2 size={{ xs: 12, sm: 4 }}>
                      <StatusBadge
                        label={
                          template.waiverOfSubrogationRequired
                            ? 'Waiver of Subrogation Required'
                            : 'Waiver Not Required'
                        }
                        variant={template.waiverOfSubrogationRequired ? 'success' : 'default'}
                      />
                    </Grid2>
                    <Grid2 size={{ xs: 12, sm: 4 }}>
                      <StatusBadge
                        label={
                          template.endorsementRequired
                            ? 'Endorsement Required'
                            : 'Endorsement Not Required'
                        }
                        variant={template.endorsementRequired ? 'success' : 'default'}
                      />
                    </Grid2>
                  </Grid2>

                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>Policy Type</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Required</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Minimum Limits</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {template.policyRequirements.map((pr) => (
                          <TableRow key={pr.policyType}>
                            <TableCell>{POLICY_TYPE_LABELS[pr.policyType]}</TableCell>
                            <TableCell>
                              <StatusBadge
                                label={pr.required ? 'Yes' : 'No'}
                                variant={pr.required ? 'success' : 'default'}
                              />
                            </TableCell>
                            <TableCell>
                              {pr.minimumLimits ? (
                                <Box>
                                  {Object.entries(pr.minimumLimits).map(([key, val]) => (
                                    <Typography
                                      key={key}
                                      variant="caption"
                                      sx={{ display: 'block' }}
                                    >
                                      {key}: <strong>{val}</strong>
                                    </Typography>
                                  ))}
                                </Box>
                              ) : (
                                <Typography variant="caption" color="text.secondary">
                                  —
                                </Typography>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
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
                  }}
                >
                  No requirement template assigned — assign one to define COI policy requirements
                  for vendors
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>
    </Box>
  );
}
