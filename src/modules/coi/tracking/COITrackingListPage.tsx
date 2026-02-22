'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';

import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { Eye, FileText } from 'lucide-react';

import { PageShell } from '@shared/components';

import { EmptyState, StatusBadge } from '../shared/components';
import { formatPolicyDate } from '../shared/utils/coiValidation';

import type { COITrackingFilter } from './useCOITrackingStore';
import {
  getCompliancePercentage,
  getStatusLabel,
  getStatusVariant,
  useFilterCounts,
  useFilteredCOIDocuments,
  usePendingReviewDocuments,
} from './useCOITrackingStore';

// ── Filter chip config ──────────────────────────────────────────────

interface FilterChipConfig {
  readonly key: COITrackingFilter;
  readonly label: string;
}

const FILTER_CHIPS: readonly FilterChipConfig[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'non_compliant', label: 'Non-Compliant' },
  { key: 'expiring_soon', label: 'Expiring Soon' },
  { key: 'expired', label: 'Expired' },
];

// ── Compliance bar color ────────────────────────────────────────────

function getComplianceColor(pct: number): 'success' | 'warning' | 'error' {
  if (pct >= 80) {
    return 'success';
  }
  if (pct >= 50) {
    return 'warning';
  }
  return 'error';
}

/**
 * COI Tracking List — Main worklist for all COI documents.
 * Filterable by status with badge counts. Wired to useCOITrackingStore.
 */
export function COITrackingListPage() {
  const [activeFilter, setActiveFilter] = useState<COITrackingFilter>('all');
  const documents = useFilteredCOIDocuments(activeFilter);
  const filterCounts = useFilterCounts();
  const pendingReviewDocs = usePendingReviewDocuments();

  const handleFilterChange = useCallback((filter: COITrackingFilter) => {
    setActiveFilter(filter);
  }, []);

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <PageShell
          title="COI Tracking"
          description="Track and manage all certificates of insurance"
        />
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Badge badgeContent={pendingReviewDocs.length} color="warning">
            <Button
              component={Link}
              href="/certificate-of-insurance/tracking/pending"
              variant="outlined"
              size="small"
            >
              Pending Review
            </Button>
          </Badge>
          <Button
            component={Link}
            href="/certificate-of-insurance/tracking/upload"
            variant="contained"
            size="small"
          >
            Upload COI
          </Button>
        </Box>
      </Box>

      {/* Status filter chips */}
      <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
        {FILTER_CHIPS.map(({ key, label }) => (
          <Chip
            key={key}
            label={`${label} (${filterCounts[key]})`}
            variant={activeFilter === key ? 'filled' : 'outlined'}
            color={activeFilter === key ? 'primary' : 'default'}
            size="small"
            clickable
            onClick={() => handleFilterChange(key)}
          />
        ))}
      </Box>

      <Card>
        <CardContent sx={{ p: 0 }}>
          {documents.length === 0 ? (
            <EmptyState
              title="No COI Documents"
              description={
                activeFilter === 'all'
                  ? 'Upload or request COI documents from vendors to start tracking.'
                  : `No documents match the "${FILTER_CHIPS.find((f) => f.key === activeFilter)?.label}" filter.`
              }
              action={
                activeFilter === 'all' ? (
                  <Button
                    component={Link}
                    href="/certificate-of-insurance/tracking/upload"
                    variant="contained"
                    size="small"
                  >
                    Upload COI
                  </Button>
                ) : (
                  <Button variant="outlined" size="small" onClick={() => setActiveFilter('all')}>
                    Clear Filter
                  </Button>
                )
              }
            />
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Vendor</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Building</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Uploaded</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Expiration</TableCell>
                    <TableCell sx={{ fontWeight: 700, minWidth: 140 }}>Compliance</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {documents.map((doc) => {
                    const compliance = getCompliancePercentage(doc);
                    return (
                      <TableRow key={doc.id} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <FileText size={16} />
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {doc.vendorName}
                              </Typography>
                              {doc.fileName ? (
                                <Typography
                                  variant="caption"
                                  sx={{ color: 'text.secondary', display: 'block' }}
                                >
                                  {doc.fileName}
                                </Typography>
                              ) : null}
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{doc.buildingName}</Typography>
                        </TableCell>
                        <TableCell>
                          <StatusBadge
                            label={getStatusLabel(doc.status)}
                            variant={getStatusVariant(doc.status)}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {doc.uploadedAt ? formatPolicyDate(doc.uploadedAt) : '—'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: doc.status === 'expired' ? 700 : 400,
                              color: doc.status === 'expired' ? 'error.main' : 'text.primary',
                            }}
                          >
                            {doc.earliestExpiration
                              ? formatPolicyDate(doc.earliestExpiration)
                              : '—'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {doc.complianceResults && doc.complianceResults.length > 0 ? (
                            <Tooltip title={`${compliance}% compliance`}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <LinearProgress
                                  variant="determinate"
                                  value={compliance}
                                  color={getComplianceColor(compliance)}
                                  sx={{ flex: 1, height: 6, borderRadius: 3 }}
                                />
                                <Typography
                                  variant="caption"
                                  sx={{ fontWeight: 600, minWidth: 32 }}
                                >
                                  {compliance}%
                                </Typography>
                              </Box>
                            </Tooltip>
                          ) : (
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              N/A
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="View Details">
                            <IconButton
                              component={Link}
                              href={`/certificate-of-insurance/tracking/${doc.id}`}
                              size="small"
                            >
                              <Eye size={16} />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
