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
import Divider from '@mui/material/Divider';
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
import { ArrowLeft, CheckCircle, ChevronDown, ChevronUp, FileText, XCircle } from 'lucide-react';

import { PageShell } from '@shared/components';

import { EmptyState } from '../shared/components';
import type { COIDocument } from '../shared/types/document.types';
import { formatPolicyDate } from '../shared/utils/coiValidation';

import {
  approveCOIDocument,
  getCompliancePercentage,
  rejectCOIDocument,
  usePendingReviewDocuments,
} from './useCOITrackingStore';

// ── Helpers ──────────────────────────────────────────────────────────

function getReasonLabel(action: ReviewAction, isOverride: boolean): string {
  if (action === 'reject') {
    return 'Rejection reason (required)';
  }
  if (isOverride) {
    return 'Override justification (required)';
  }
  return 'Notes (optional)';
}

function getReasonPlaceholder(action: ReviewAction, isOverride: boolean): string {
  if (action === 'reject') {
    return 'Explain why this COI is being rejected...';
  }
  if (isOverride) {
    return 'Explain why this COI is being approved despite compliance gaps...';
  }
  return 'Add any notes about this approval...';
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

// ── Review action dialog ────────────────────────────────────────────

type ReviewAction = 'approve' | 'reject' | null;

interface ReviewDialogProps {
  readonly action: ReviewAction;
  readonly document: COIDocument | null;
  readonly onClose: () => void;
}

function ReviewDialog({ action, document, onClose }: ReviewDialogProps) {
  const [reason, setReason] = useState('');
  const [isOverride, setIsOverride] = useState(false);

  const handleConfirm = useCallback(() => {
    if (!document) {
      return;
    }

    if (action === 'approve') {
      approveCOIDocument(document.id, isOverride ? reason : undefined);
    } else if (action === 'reject') {
      rejectCOIDocument(document.id, reason);
    }

    setReason('');
    setIsOverride(false);
    onClose();
  }, [document, action, reason, isOverride, onClose]);

  const hasComplianceIssues = useMemo(() => {
    if (!document?.complianceResults) {
      return false;
    }
    return document.complianceResults.some((r) => !r.passed);
  }, [document]);

  if (!action || !document) {
    return null;
  }

  return (
    <Dialog open={Boolean(action)} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>
        {action === 'approve' ? 'Approve COI Document' : 'Reject COI Document'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            <strong>Vendor:</strong> {document.vendorName}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            <strong>Building:</strong> {document.buildingName}
          </Typography>
          {document.fileName ? (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              <strong>File:</strong> {document.fileName}
            </Typography>
          ) : null}
        </Box>

        {action === 'approve' && hasComplianceIssues ? (
          <Alert severity="warning" sx={{ mb: 2 }}>
            This document has compliance gaps. Enabling override will approve it despite
            non-compliance. You must provide a justification.
          </Alert>
        ) : null}

        {action === 'approve' && hasComplianceIssues ? (
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
        ) : null}

        <TextField
          label={getReasonLabel(action, isOverride)}
          multiline
          rows={3}
          fullWidth
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder={getReasonPlaceholder(action, isOverride)}
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

// ── Expandable compliance detail ────────────────────────────────────

function ComplianceDetail({ document }: { readonly document: COIDocument }) {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);

  if (!document.complianceResults || document.complianceResults.length === 0) {
    return (
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        No compliance data
      </Typography>
    );
  }

  const passedCount = document.complianceResults.filter((r) => r.passed).length;
  const failedCount = document.complianceResults.length - passedCount;

  return (
    <Box>
      <Button
        size="small"
        onClick={() => setExpanded(!expanded)}
        endIcon={expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        sx={{ textTransform: 'none', fontWeight: 500 }}
      >
        {passedCount} passed, {failedCount} failed
      </Button>
      {expanded ? (
        <TableContainer sx={{ mt: 1 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Requirement</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Expected</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Actual</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }} align="center">
                  Result
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {document.complianceResults.map((item) => (
                <TableRow
                  key={item.requirement}
                  sx={{
                    bgcolor: item.passed ? 'transparent' : alpha(theme.palette.error.main, 0.04),
                  }}
                >
                  <TableCell>
                    <Typography variant="caption">{item.requirement}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                      {item.expected}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="caption"
                      sx={{
                        fontFamily: 'monospace',
                        color: item.passed ? 'text.primary' : 'error.main',
                        fontWeight: item.passed ? 400 : 700,
                      }}
                    >
                      {item.actual}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    {item.passed ? (
                      <CheckCircle size={14} color="green" />
                    ) : (
                      <XCircle size={14} color="red" />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : null}
    </Box>
  );
}

// ── Main Pending Review Page ────────────────────────────────────────

/**
 * Pending Review Page — Queue of COI documents awaiting review/approval.
 * Approve & reject actions with optional notes and override toggle.
 */
export function PendingReviewPage() {
  const pendingItems = usePendingReviewDocuments();
  const [reviewAction, setReviewAction] = useState<ReviewAction>(null);
  const [reviewDocument, setReviewDocument] = useState<COIDocument | null>(null);

  const handleOpenReview = useCallback((action: ReviewAction, doc: COIDocument) => {
    setReviewAction(action);
    setReviewDocument(doc);
  }, []);

  const handleCloseReview = useCallback(() => {
    setReviewAction(null);
    setReviewDocument(null);
  }, []);

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
      <PageShell
        title="Pending Review"
        description="Review and approve or reject submitted COI documents"
      />

      <Card sx={{ mt: 3 }}>
        <CardContent sx={{ p: 0 }}>
          {pendingItems.length === 0 ? (
            <EmptyState
              title="No Pending Reviews"
              description="All COI documents have been reviewed. Check back later."
            />
          ) : (
            <>
              <Box sx={{ px: 3, pt: 2, pb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {pendingItems.length} document{pendingItems.length !== 1 ? 's' : ''} awaiting
                  review
                </Typography>
              </Box>
              <Divider />

              {/* Review cards */}
              {pendingItems.map((doc) => {
                const compliance = getCompliancePercentage(doc);
                const hasIssues = doc.complianceResults?.some((r) => !r.passed) ?? false;

                return (
                  <Box key={doc.id}>
                    <Box sx={{ p: 3 }}>
                      <Grid2 container spacing={2} alignItems="flex-start">
                        {/* Document info */}
                        <Grid2 size={{ xs: 12, md: 5 }}>
                          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                            <Box sx={{ color: 'primary.main', mt: 0.25 }}>
                              <FileText size={20} />
                            </Box>
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                {doc.vendorName}
                              </Typography>
                              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                {doc.buildingName}
                              </Typography>
                              {doc.fileName ? (
                                <Typography
                                  variant="caption"
                                  sx={{ color: 'text.secondary', display: 'block' }}
                                >
                                  {doc.fileName}
                                </Typography>
                              ) : null}
                              <Typography
                                variant="caption"
                                sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}
                              >
                                Uploaded {doc.uploadedAt ? formatPolicyDate(doc.uploadedAt) : '—'}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid2>

                        {/* Compliance */}
                        <Grid2 size={{ xs: 12, md: 4 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
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
                              sx={{ flex: 1, height: 6, borderRadius: 3 }}
                            />
                          </Box>
                          <ComplianceDetail document={doc} />
                        </Grid2>

                        {/* Actions */}
                        <Grid2 size={{ xs: 12, md: 3 }}>
                          <Box
                            sx={{
                              display: 'flex',
                              gap: 1,
                              justifyContent: { xs: 'flex-start', md: 'flex-end' },
                            }}
                          >
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              startIcon={<XCircle size={14} />}
                              onClick={() => handleOpenReview('reject', doc)}
                            >
                              Reject
                            </Button>
                            <Button
                              variant="contained"
                              color="success"
                              size="small"
                              startIcon={<CheckCircle size={14} />}
                              onClick={() => handleOpenReview('approve', doc)}
                            >
                              {hasIssues ? 'Review & Approve' : 'Approve'}
                            </Button>
                          </Box>
                        </Grid2>
                      </Grid2>
                    </Box>
                    <Divider />
                  </Box>
                );
              })}
            </>
          )}
        </CardContent>
      </Card>

      {/* Review action dialog */}
      <ReviewDialog action={reviewAction} document={reviewDocument} onClose={handleCloseReview} />
    </Box>
  );
}
