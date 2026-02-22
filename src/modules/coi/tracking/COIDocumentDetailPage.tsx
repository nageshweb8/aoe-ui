'use client';

import { useCallback, useMemo, useState } from 'react';
import Link from 'next/link';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid2 from '@mui/material/Grid2';
import LinearProgress from '@mui/material/LinearProgress';
import { alpha, useTheme } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import {
  ArrowLeft,
  Building,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  Shield,
  User,
  XCircle,
} from 'lucide-react';

import { PageShell } from '@shared/components';

import { EmptyState, StatusBadge } from '../shared/components';
import { formatPolicyDate } from '../shared/utils/coiValidation';

import {
  approveCOIDocument,
  getCompliancePercentage,
  getStatusLabel,
  getStatusVariant,
  rejectCOIDocument,
  useCOIDocument,
} from './useCOITrackingStore';

// ── Helpers ─────────────────────────────────────────────────────────

function getReasonLabel(action: 'approve' | 'reject', isOverride: boolean): string {
  if (action === 'reject') {
    return 'Rejection reason (required)';
  }
  if (isOverride) {
    return 'Override justification (required)';
  }
  return 'Notes (optional)';
}

function complianceColor(score: number): 'success' | 'warning' | 'error' {
  if (score === 100) {
    return 'success';
  }
  return score >= 50 ? 'warning' : 'error';
}

function progressColor(score: number): 'success' | 'warning' | 'error' {
  if (score >= 80) {
    return 'success';
  }
  return score >= 50 ? 'warning' : 'error';
}

// ── Info row ────────────────────────────────────────────────────────

function InfoRow({
  icon,
  label,
  value,
}: {
  readonly icon: React.ReactNode;
  readonly label: string;
  readonly value: string;
}) {
  return (
    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
      <Box sx={{ color: 'text.secondary', mt: 0.25 }}>{icon}</Box>
      <Box>
        <Typography
          variant="caption"
          sx={{ color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5 }}
        >
          {label}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {value}
        </Typography>
      </Box>
    </Box>
  );
}

// ── Review dialog ───────────────────────────────────────────────────

interface ReviewDialogProps {
  readonly open: boolean;
  readonly action: 'approve' | 'reject';
  readonly docId: string;
  readonly hasIssues: boolean;
  readonly onClose: () => void;
}

function ReviewActionDialog({ open, action, docId, hasIssues, onClose }: ReviewDialogProps) {
  const [reason, setReason] = useState('');
  const [isOverride, setIsOverride] = useState(false);

  const handleConfirm = useCallback(() => {
    if (action === 'approve') {
      approveCOIDocument(docId, isOverride ? reason : undefined);
    } else {
      rejectCOIDocument(docId, reason);
    }
    setReason('');
    setIsOverride(false);
    onClose();
  }, [docId, action, reason, isOverride, onClose]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>
        {action === 'approve' ? 'Approve COI Document' : 'Reject COI Document'}
      </DialogTitle>
      <DialogContent>
        {action === 'approve' && hasIssues ? (
          <>
            <Alert severity="warning" sx={{ mb: 2 }}>
              This document has compliance gaps. Enable override to approve despite non-compliance.
            </Alert>
            <FormControlLabel
              control={
                <Switch
                  checked={isOverride}
                  onChange={(_, checked) => setIsOverride(checked)}
                  color="warning"
                />
              }
              label="Override compliance check"
              sx={{ mb: 2 }}
            />
          </>
        ) : null}
        <TextField
          label={getReasonLabel(action, isOverride)}
          multiline
          rows={3}
          fullWidth
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color={action === 'approve' ? 'success' : 'error'}
          disabled={
            (action === 'reject' && !reason.trim()) ||
            (action === 'approve' && isOverride && !reason.trim())
          }
        >
          {action === 'approve' ? 'Approve' : 'Reject'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ── Main document detail page ───────────────────────────────────────

interface COIDocumentDetailPageProps {
  readonly documentId: string;
}

/**
 * COI Document Detail Page — Displays full detail for a single COI document.
 * Shows status, vendor/building info, compliance results, review history.
 * Allows approve/reject if document is under review.
 */
export function COIDocumentDetailPage({ documentId }: COIDocumentDetailPageProps) {
  const theme = useTheme();
  const doc = useCOIDocument(documentId);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState<'approve' | 'reject'>('approve');

  const compliance = useMemo(() => (doc ? getCompliancePercentage(doc) : 0), [doc]);
  const hasIssues = useMemo(() => doc?.complianceResults?.some((r) => !r.passed) ?? false, [doc]);
  const isReviewable = doc?.status === 'under_review';

  const handleOpenDialog = useCallback((action: 'approve' | 'reject') => {
    setDialogAction(action);
    setDialogOpen(true);
  }, []);

  if (!doc) {
    return (
      <Box>
        <Button
          component={Link}
          href="/certificate-of-insurance/tracking"
          startIcon={<ArrowLeft size={16} />}
          size="small"
          sx={{ mb: 1 }}
        >
          Back to COI Tracking
        </Button>
        <EmptyState
          title="Document Not Found"
          description="The requested COI document could not be found."
          action={
            <Button
              component={Link}
              href="/certificate-of-insurance/tracking"
              variant="contained"
              size="small"
            >
              View All Documents
            </Button>
          }
        />
      </Box>
    );
  }

  return (
    <Box>
      <Button
        component={Link}
        href="/certificate-of-insurance/tracking"
        startIcon={<ArrowLeft size={16} />}
        size="small"
        sx={{ mb: 1 }}
      >
        Back to COI Tracking
      </Button>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <PageShell title="COI Document Detail" description={doc.fileName ?? doc.id} />
        <Box sx={{ display: 'flex', gap: 1 }}>
          <StatusBadge
            label={getStatusLabel(doc.status)}
            variant={getStatusVariant(doc.status)}
            size="medium"
          />
          {isReviewable ? (
            <>
              <Button
                variant="outlined"
                color="error"
                size="small"
                startIcon={<XCircle size={14} />}
                onClick={() => handleOpenDialog('reject')}
              >
                Reject
              </Button>
              <Button
                variant="contained"
                color="success"
                size="small"
                startIcon={<CheckCircle size={14} />}
                onClick={() => handleOpenDialog('approve')}
              >
                Approve
              </Button>
            </>
          ) : null}
        </Box>
      </Box>

      {/* Override / rejection reason alerts */}
      {doc.overrideReason ? (
        <Alert severity="warning" sx={{ mb: 2 }}>
          <strong>Approved with override:</strong> {doc.overrideReason}
        </Alert>
      ) : null}
      {doc.rejectionReason ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          <strong>Rejection reason:</strong> {doc.rejectionReason}
        </Alert>
      ) : null}

      {/* Document info */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Document Information
          </Typography>
          <Grid2 container spacing={3}>
            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
              <InfoRow icon={<User size={16} />} label="Vendor" value={doc.vendorName} />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
              <InfoRow icon={<Building size={16} />} label="Building" value={doc.buildingName} />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
              <InfoRow
                icon={<Calendar size={16} />}
                label="Uploaded"
                value={doc.uploadedAt ? formatPolicyDate(doc.uploadedAt) : '—'}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
              <InfoRow
                icon={<Calendar size={16} />}
                label="Earliest Expiration"
                value={doc.earliestExpiration ? formatPolicyDate(doc.earliestExpiration) : '—'}
              />
            </Grid2>
            {doc.fileName ? (
              <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                <InfoRow icon={<FileText size={16} />} label="File" value={doc.fileName} />
              </Grid2>
            ) : null}
            {doc.reviewedBy ? (
              <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                <InfoRow icon={<User size={16} />} label="Reviewed By" value={doc.reviewedBy} />
              </Grid2>
            ) : null}
            {doc.reviewedAt ? (
              <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                <InfoRow
                  icon={<Clock size={16} />}
                  label="Reviewed At"
                  value={formatPolicyDate(doc.reviewedAt)}
                />
              </Grid2>
            ) : null}
          </Grid2>
        </CardContent>
      </Card>

      {/* Compliance results */}
      {doc.complianceResults && doc.complianceResults.length > 0 ? (
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Box
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Shield size={20} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Compliance Results
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip
                  label={`${compliance}%`}
                  size="small"
                  color={complianceColor(compliance)}
                  sx={{ fontWeight: 700 }}
                />
                <LinearProgress
                  variant="determinate"
                  value={compliance}
                  color={progressColor(compliance)}
                  sx={{ width: 100, height: 6, borderRadius: 3 }}
                />
              </Box>
            </Box>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Requirement</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Expected</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Actual</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Confidence</TableCell>
                    <TableCell sx={{ fontWeight: 700 }} align="center">
                      Result
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {doc.complianceResults.map((item) => (
                    <TableRow
                      key={item.requirement}
                      sx={{
                        bgcolor: item.passed
                          ? 'transparent'
                          : alpha(theme.palette.error.main, 0.04),
                      }}
                    >
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {item.requirement}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                          {item.expected}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: 'monospace',
                            color: item.passed ? 'text.primary' : 'error.main',
                            fontWeight: item.passed ? 400 : 700,
                          }}
                        >
                          {item.actual}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                          {item.confidence ? `${Math.round(item.confidence * 100)}%` : '—'}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        {item.passed ? (
                          <CheckCircle size={16} color="green" />
                        ) : (
                          <XCircle size={16} color="red" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      ) : null}

      {/* Review dialog */}
      <ReviewActionDialog
        open={dialogOpen}
        action={dialogAction}
        docId={doc.id}
        hasIssues={hasIssues}
        onClose={() => setDialogOpen(false)}
      />
    </Box>
  );
}
