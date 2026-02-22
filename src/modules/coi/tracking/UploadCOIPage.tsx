'use client';

import { useCallback, useMemo, useState } from 'react';
import Link from 'next/link';

import Alert from '@mui/material/Alert';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid2 from '@mui/material/Grid2';
import LinearProgress from '@mui/material/LinearProgress';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
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
  CheckCircle,
  FileCheck,
  Loader2,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  User,
  XCircle,
} from 'lucide-react';

import { PageShell } from '@shared/components';

import { useBuildings, useTemplate } from '../buildings/useBuildingStore';
import { COIFileUpload, COIPoliciesTable, COIResultsSummary } from '../shared/components';
import type { COIVerificationResponse } from '../shared/types/coi.types';
import type { ComplianceLineItem } from '../shared/types/document.types';
import { useVendors } from '../vendors/useVendorStore';

import { generateTemplateComplianceResults, mockVerifyCOIDocument } from './coi-verification.mock';
import { addCOIDocument, setCOIVerificationResults } from './useCOITrackingStore';

const UPLOAD_STEPS = [
  'Select Context',
  'Upload Certificate',
  'Review Compliance',
  'Approve / Reject',
];

// ── Helpers ─────────────────────────────────────────────────────────

function complianceChipColor(score: number): 'success' | 'warning' | 'error' {
  if (score === 100) {
    return 'success';
  }
  return score >= 50 ? 'warning' : 'error';
}

// ── Step 1: Select Context ──────────────────────────────────────────

interface StepSelectContextProps {
  readonly vendorId: string;
  readonly buildingId: string;
  readonly onVendorChange: (id: string) => void;
  readonly onBuildingChange: (id: string) => void;
}

function StepSelectContext({
  vendorId,
  buildingId,
  onVendorChange,
  onBuildingChange,
}: StepSelectContextProps) {
  const vendors = useVendors();
  const buildings = useBuildings();

  const selectedVendor = useMemo(
    () => vendors.find((v) => v.id === vendorId) ?? null,
    [vendors, vendorId],
  );
  const selectedBuilding = useMemo(
    () => buildings.find((b) => b.id === buildingId) ?? null,
    [buildings, buildingId],
  );

  // Filter buildings to those associated with the selected vendor
  const availableBuildings = useMemo(() => {
    if (!selectedVendor) {
      return buildings;
    }
    return buildings.filter((b) => selectedVendor.buildingIds.includes(b.id));
  }, [buildings, selectedVendor]);

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <User size={20} />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Select Vendor
        </Typography>
      </Box>

      <Autocomplete
        options={vendors}
        getOptionLabel={(v) => v.companyName}
        value={selectedVendor}
        onChange={(_, newValue) => {
          onVendorChange(newValue?.id ?? '');
          if (newValue && buildingId && !newValue.buildingIds.includes(buildingId)) {
            onBuildingChange('');
          }
        }}
        renderInput={(params) => (
          <TextField {...params} label="Vendor" placeholder="Search vendors..." fullWidth />
        )}
        renderOption={(props, option) => (
          <li {...props} key={option.id}>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {option.companyName}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {option.contact.name} &middot; {option.address.city}, {option.address.state}
              </Typography>
            </Box>
          </li>
        )}
        sx={{ mb: 4 }}
      />

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <Building size={20} />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Select Building
        </Typography>
      </Box>

      <Autocomplete
        options={availableBuildings}
        getOptionLabel={(b) => b.name}
        value={selectedBuilding}
        onChange={(_, newValue) => onBuildingChange(newValue?.id ?? '')}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Building / Property"
            placeholder="Search buildings..."
            fullWidth
          />
        )}
        renderOption={(props, option) => (
          <li {...props} key={option.id}>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {option.name}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {option.address.street}, {option.address.city}, {option.address.state}{' '}
                {option.address.zip}
              </Typography>
            </Box>
          </li>
        )}
        disabled={!vendorId}
      />

      {vendorId && !selectedVendor?.buildingIds.length ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          This vendor has no assigned buildings. You can still select any building.
        </Alert>
      ) : null}
    </Box>
  );
}

// ── Step 2: Upload Certificate (upload + inline AI extraction) ──────

interface StepUploadCertificateProps {
  readonly file: File | null;
  readonly onFileSelect: (file: File) => void;
  readonly onReupload: () => void;
  readonly isProcessing: boolean;
  readonly verification: COIVerificationResponse | null;
  readonly processingError: string | null;
}

function StepUploadCertificate({
  file,
  onFileSelect,
  onReupload,
  isProcessing,
  verification,
  processingError,
}: StepUploadCertificateProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* File upload area */}
      {!file ? (
        <Box sx={{ maxWidth: 600, mx: 'auto', width: '100%' }}>
          <COIFileUpload onFileSelect={onFileSelect} isUploading={false} />
        </Box>
      ) : null}

      {/* File selected confirmation */}
      {file && !isProcessing && !verification ? (
        <Alert severity="success" icon={<FileCheck size={20} />} sx={{ maxWidth: 600, mx: 'auto' }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {file.name}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {(file.size / 1024).toFixed(1)} KB &middot; Processing will begin automatically&hellip;
          </Typography>
        </Alert>
      ) : null}

      {/* Processing indicator */}
      {isProcessing ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 6,
            gap: 3,
          }}
        >
          <Box
            sx={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CircularProgress size={80} thickness={2} />
            <Box sx={{ position: 'absolute' }}>
              <Loader2 size={32} className="animate-spin" />
            </Box>
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            AI Extraction in Progress
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: 'text.secondary', maxWidth: 400, textAlign: 'center' }}
          >
            Analyzing the certificate, extracting policy details, and comparing coverage limits
            against your building&apos;s requirement template.
          </Typography>
          <Box sx={{ width: '100%', maxWidth: 300 }}>
            <LinearProgress sx={{ borderRadius: 2, height: 6 }} />
          </Box>
        </Box>
      ) : null}

      {/* Processing error */}
      {processingError ? (
        <Box sx={{ maxWidth: 600, mx: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Alert severity="error">{processingError}</Alert>
          <Button
            variant="outlined"
            startIcon={<RefreshCw size={16} />}
            onClick={onReupload}
            sx={{ alignSelf: 'center' }}
          >
            Upload a Different File
          </Button>
        </Box>
      ) : null}

      {/* Extraction results (inline) */}
      {verification && !isProcessing ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
              flexWrap: 'wrap',
            }}
          >
            <Alert
              severity={verification.status === 'verified' ? 'success' : 'warning'}
              icon={
                verification.status === 'verified' ? (
                  <ShieldCheck size={20} />
                ) : (
                  <ShieldAlert size={20} />
                )
              }
              sx={{ flex: 1 }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {verification.status === 'verified'
                  ? 'Certificate data extracted successfully.'
                  : 'Certificate extracted with some issues.'}
              </Typography>
            </Alert>
            <Button
              variant="outlined"
              size="small"
              startIcon={<RefreshCw size={16} />}
              onClick={onReupload}
            >
              Re-upload
            </Button>
          </Box>
          <COIResultsSummary data={verification} />
          <COIPoliciesTable policies={verification.policies} />
        </Box>
      ) : null}
    </Box>
  );
}

// ── Step 3: Review Compliance ───────────────────────────────────────

interface StepReviewComplianceProps {
  readonly vendorName: string;
  readonly buildingName: string;
  readonly fileName: string;
  readonly verification: COIVerificationResponse | null;
  readonly complianceResults: readonly ComplianceLineItem[];
}

function StepReviewCompliance({
  vendorName,
  buildingName,
  fileName,
  verification,
  complianceResults,
}: StepReviewComplianceProps) {
  const theme = useTheme();
  const passedCount = complianceResults.filter((r) => r.passed).length;
  const totalCount = complianceResults.length;
  const compliancePct = totalCount > 0 ? Math.round((passedCount / totalCount) * 100) : 0;
  const scoreColor = complianceChipColor(compliancePct);

  return (
    <Grid2 container spacing={3}>
      {/* Left panel — Document info + score */}
      <Grid2 size={{ xs: 12, md: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1 }}>
                Document Info
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {fileName}
              </Typography>
              <Divider sx={{ my: 1.5 }} />
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Vendor
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {vendorName}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: 'text.secondary', mt: 1, display: 'block' }}
              >
                Building
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {buildingName}
              </Typography>
            </CardContent>
          </Card>

          {/* Certificate details */}
          {verification ? (
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1 }}>
                  Certificate Details
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Producer
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                  {verification.producer?.name ?? '\u2014'}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Insured
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                  {verification.insured?.name ?? '\u2014'}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Certificate Holder
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {verification.certificateHolder?.name ?? '\u2014'}
                </Typography>
              </CardContent>
            </Card>
          ) : null}

          {/* Compliance score */}
          <Card
            sx={{
              bgcolor: alpha(theme.palette[scoreColor].main, 0.06),
            }}
          >
            <CardContent sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                {compliancePct}%
              </Typography>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                Compliance Score
              </Typography>
              <Chip
                label={`${passedCount} / ${totalCount} passed`}
                color={complianceChipColor(compliancePct)}
                size="small"
                sx={{ mt: 1, fontWeight: 600 }}
              />
            </CardContent>
          </Card>
        </Box>
      </Grid2>

      {/* Right panel — Requirements comparison table */}
      <Grid2 size={{ xs: 12, md: 8 }}>
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Requirement Comparison
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Requirement</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Required</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Certificate</TableCell>
                    <TableCell sx={{ fontWeight: 700 }} align="center">
                      Result
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {complianceResults.map((item) => (
                    <TableRow
                      key={item.requirement}
                      sx={{
                        bgcolor: item.passed
                          ? 'transparent'
                          : alpha(theme.palette.error.main, 0.06),
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
                      <TableCell align="center">
                        {item.passed ? (
                          <CheckCircle size={18} color="green" />
                        ) : (
                          <XCircle size={18} color="red" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid2>
    </Grid2>
  );
}

// ── Step 4: Approve / Reject ────────────────────────────────────────

interface StepApproveRejectProps {
  readonly complianceResults: readonly ComplianceLineItem[];
  readonly onApprove: (overrideReason?: string) => void;
  readonly onReject: (reason: string) => void;
}

function StepApproveReject({ complianceResults, onApprove, onReject }: StepApproveRejectProps) {
  const theme = useTheme();
  const [action, setAction] = useState<'approve' | 'reject' | null>(null);
  const [overrideEnabled, setOverrideEnabled] = useState(false);
  const [overrideReason, setOverrideReason] = useState('');
  const [rejectReason, setRejectReason] = useState('');

  const passedCount = complianceResults.filter((r) => r.passed).length;
  const totalCount = complianceResults.length;
  const compliancePct = totalCount > 0 ? Math.round((passedCount / totalCount) * 100) : 0;
  const isFullyCompliant = compliancePct === 100;
  const failedItems = complianceResults.filter((r) => !r.passed);

  const canConfirmApprove =
    isFullyCompliant || (overrideEnabled && overrideReason.trim().length > 0);
  const canConfirmReject = rejectReason.trim().length > 0;

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Compliance summary banner */}
      <Alert
        severity={isFullyCompliant ? 'success' : 'warning'}
        icon={isFullyCompliant ? <ShieldCheck size={20} /> : <ShieldAlert size={20} />}
        sx={{
          bgcolor: isFullyCompliant
            ? alpha(theme.palette.success.main, 0.08)
            : alpha(theme.palette.warning.main, 0.08),
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {isFullyCompliant
            ? `All ${totalCount} requirements met \u2014 certificate is fully compliant.`
            : `${failedItems.length} of ${totalCount} requirements failed compliance checks.`}
        </Typography>
      </Alert>

      {/* Failed items summary (when not fully compliant) */}
      {failedItems.length > 0 ? (
        <Card>
          <CardContent sx={{ p: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Failed Requirements
            </Typography>
            {failedItems.map((item) => (
              <Box
                key={item.requirement}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  py: 0.5,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <XCircle size={14} color="red" />
                  <Typography variant="body2">{item.requirement}</Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{ fontFamily: 'monospace', color: 'error.main', fontWeight: 600 }}
                >
                  {item.actual} (need {item.expected})
                </Typography>
              </Box>
            ))}
          </CardContent>
        </Card>
      ) : null}

      {/* Decision buttons */}
      {action === null ? (
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="success"
            size="large"
            startIcon={<CheckCircle size={18} />}
            onClick={() => {
              if (isFullyCompliant) {
                onApprove();
              } else {
                setAction('approve');
              }
            }}
            sx={{ minWidth: 180 }}
          >
            Approve
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="large"
            startIcon={<XCircle size={18} />}
            onClick={() => setAction('reject')}
            sx={{ minWidth: 180 }}
          >
            Reject
          </Button>
        </Box>
      ) : null}

      {/* Override approval panel (for non-compliant certificates) */}
      {action === 'approve' && !isFullyCompliant ? (
        <Card sx={{ border: `1px solid ${theme.palette.warning.main}` }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Override Approval
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
              This certificate does not meet all requirements. To approve it anyway, enable the
              override and provide a justification.
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={overrideEnabled}
                  onChange={(e) => setOverrideEnabled(e.target.checked)}
                  color="warning"
                />
              }
              label="I acknowledge the compliance gaps and want to override"
            />
            {overrideEnabled ? (
              <TextField
                label="Override Justification"
                placeholder="Explain why this certificate is being approved despite compliance gaps&hellip;"
                multiline
                rows={3}
                fullWidth
                value={overrideReason}
                onChange={(e) => setOverrideReason(e.target.value)}
                sx={{ mt: 2 }}
                required
              />
            ) : null}
            <Box sx={{ display: 'flex', gap: 1, mt: 2, justifyContent: 'flex-end' }}>
              <Button variant="outlined" onClick={() => setAction(null)}>
                Cancel
              </Button>
              <Button
                variant="contained"
                color="warning"
                disabled={!canConfirmApprove}
                onClick={() => onApprove(overrideReason)}
              >
                Confirm Override Approval
              </Button>
            </Box>
          </CardContent>
        </Card>
      ) : null}

      {/* Rejection panel */}
      {action === 'reject' ? (
        <Card sx={{ border: `1px solid ${theme.palette.error.main}` }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Reject Certificate
            </Typography>
            <TextField
              label="Rejection Reason"
              placeholder="Describe why this certificate is being rejected&hellip;"
              multiline
              rows={3}
              fullWidth
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              required
            />
            <Box sx={{ display: 'flex', gap: 1, mt: 2, justifyContent: 'flex-end' }}>
              <Button variant="outlined" onClick={() => setAction(null)}>
                Cancel
              </Button>
              <Button
                variant="contained"
                color="error"
                disabled={!canConfirmReject}
                onClick={() => onReject(rejectReason)}
              >
                Confirm Rejection
              </Button>
            </Box>
          </CardContent>
        </Card>
      ) : null}
    </Box>
  );
}

// ── Main Upload COI Page ────────────────────────────────────────────

/**
 * Upload COI Page — 4-step wizard.
 *
 * Steps:
 *   1. Select Context — pick vendor & building
 *   2. Upload Certificate — file upload + inline AI extraction
 *   3. Review Compliance — side-by-side requirement comparison
 *   4. Approve / Reject — decision with optional override
 */
export function UploadCOIPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [vendorId, setVendorId] = useState('');
  const [buildingId, setBuildingId] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [verification, setVerification] = useState<COIVerificationResponse | null>(null);
  const [complianceResults, setComplianceResults] = useState<readonly ComplianceLineItem[]>([]);
  const [earliestExpiration, setEarliestExpiration] = useState('');
  const [processingError, setProcessingError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submittedAction, setSubmittedAction] = useState<'approved' | 'rejected' | null>(null);
  const [docId, setDocId] = useState<string | null>(null);

  const vendors = useVendors();
  const buildings = useBuildings();

  const selectedVendor = useMemo(() => vendors.find((v) => v.id === vendorId), [vendors, vendorId]);
  const selectedBuilding = useMemo(
    () => buildings.find((b) => b.id === buildingId),
    [buildings, buildingId],
  );

  const template = useTemplate(selectedBuilding?.templateId ?? '');

  // ── Step validation ────────────────────────────────────────────────
  const canProceed = useMemo(() => {
    switch (activeStep) {
      case 0:
        return Boolean(vendorId && buildingId);
      case 1:
        return Boolean(verification) && !isProcessing;
      case 2:
        return complianceResults.length > 0;
      default:
        return false;
    }
  }, [activeStep, vendorId, buildingId, verification, isProcessing, complianceResults]);

  // ── File selected -> auto-trigger extraction ──────────────────────
  const handleFileSelect = useCallback(
    async (selectedFile: File) => {
      setFile(selectedFile);
      setIsProcessing(true);
      setProcessingError(null);
      setVerification(null);
      setComplianceResults([]);

      try {
        const result = await mockVerifyCOIDocument(selectedFile, selectedVendor?.companyName ?? '');
        setVerification(result.verification);
        setEarliestExpiration(result.earliestExpiration);

        // Generate template-aware compliance if template exists
        if (template) {
          const templateResults = generateTemplateComplianceResults(result.verification, template);
          setComplianceResults(templateResults);
        } else {
          setComplianceResults(result.complianceResults);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Extraction failed.';
        setProcessingError(message);
      } finally {
        setIsProcessing(false);
      }
    },
    [selectedVendor, template],
  );

  // ── Re-upload handler ──────────────────────────────────────────────
  const handleReupload = useCallback(() => {
    setFile(null);
    setVerification(null);
    setComplianceResults([]);
    setEarliestExpiration('');
    setProcessingError(null);
    setIsProcessing(false);
  }, []);

  // ── Approve handler ────────────────────────────────────────────────
  const handleApprove = useCallback(
    (overrideReason?: string) => {
      if (!selectedVendor || !selectedBuilding || !file || !verification) {
        return;
      }

      const newDoc = addCOIDocument({
        vendorId: selectedVendor.id,
        vendorName: selectedVendor.companyName,
        buildingId: selectedBuilding.id,
        buildingName: selectedBuilding.name,
        templateId: selectedBuilding.templateId,
        status: 'approved',
        fileUrl: `/mock/coi/${file.name}`,
        fileName: file.name,
        verificationId: verification.id,
        complianceResults: [...complianceResults],
        earliestExpiration,
        uploadedAt: new Date().toISOString(),
        ...(overrideReason ? { overrideReason } : {}),
      });

      if (newDoc.id) {
        setCOIVerificationResults(
          newDoc.id,
          verification.id,
          complianceResults,
          earliestExpiration,
        );
      }

      setDocId(newDoc.id);
      setSubmittedAction('approved');
      setSubmitted(true);
    },
    [selectedVendor, selectedBuilding, file, verification, complianceResults, earliestExpiration],
  );

  // ── Reject handler ─────────────────────────────────────────────────
  const handleReject = useCallback(
    (reason: string) => {
      if (!selectedVendor || !selectedBuilding || !file || !verification) {
        return;
      }

      const newDoc = addCOIDocument({
        vendorId: selectedVendor.id,
        vendorName: selectedVendor.companyName,
        buildingId: selectedBuilding.id,
        buildingName: selectedBuilding.name,
        templateId: selectedBuilding.templateId,
        status: 'rejected',
        fileUrl: `/mock/coi/${file.name}`,
        fileName: file.name,
        verificationId: verification.id,
        complianceResults: [...complianceResults],
        earliestExpiration,
        uploadedAt: new Date().toISOString(),
        rejectionReason: reason,
      });

      if (newDoc.id) {
        setCOIVerificationResults(
          newDoc.id,
          verification.id,
          complianceResults,
          earliestExpiration,
        );
      }

      setDocId(newDoc.id);
      setSubmittedAction('rejected');
      setSubmitted(true);
    },
    [selectedVendor, selectedBuilding, file, verification, complianceResults, earliestExpiration],
  );

  // ── Navigation ─────────────────────────────────────────────────────
  const handleNext = useCallback(() => {
    setActiveStep((prev) => Math.min(prev + 1, UPLOAD_STEPS.length - 1));
  }, []);

  const handleBack = useCallback(() => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  }, []);

  // ── Reset wizard ───────────────────────────────────────────────────
  const handleReset = useCallback(() => {
    setActiveStep(0);
    setVendorId('');
    setBuildingId('');
    setFile(null);
    setVerification(null);
    setComplianceResults([]);
    setEarliestExpiration('');
    setProcessingError(null);
    setSubmitted(false);
    setSubmittedAction(null);
    setDocId(null);
  }, []);

  // ── Success state ──────────────────────────────────────────────────
  if (submitted) {
    const isApproved = submittedAction === 'approved';

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
        <PageShell title="Upload COI" description="Upload and verify a certificate of insurance" />

        <Card sx={{ mt: 3 }}>
          <CardContent
            sx={{
              p: 6,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: 2,
            }}
          >
            <Box sx={{ color: isApproved ? 'success.main' : 'error.main' }}>
              {isApproved ? (
                <CheckCircle size={64} strokeWidth={1.5} />
              ) : (
                <XCircle size={64} strokeWidth={1.5} />
              )}
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {isApproved ? 'COI Approved' : 'COI Rejected'}
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 500 }}>
              The certificate for <strong>{selectedVendor?.companyName}</strong> at{' '}
              <strong>{selectedBuilding?.name}</strong> has been{' '}
              {isApproved ? 'approved and recorded' : 'rejected'}.
            </Typography>
            <Divider sx={{ width: '100%', my: 2 }} />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button component={Link} href="/certificate-of-insurance/tracking" variant="outlined">
                View All Documents
              </Button>
              <Button
                component={Link}
                href={`/certificate-of-insurance/tracking/${docId}`}
                variant="contained"
              >
                View Submission
              </Button>
              <Button variant="outlined" onClick={handleReset}>
                Upload Another
              </Button>
            </Box>
          </CardContent>
        </Card>
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
      <PageShell title="Upload COI" description="Upload and verify a certificate of insurance" />

      <Card sx={{ mt: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {UPLOAD_STEPS.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Step content */}
          <Box sx={{ minHeight: 300 }}>
            {activeStep === 0 ? (
              <StepSelectContext
                vendorId={vendorId}
                buildingId={buildingId}
                onVendorChange={setVendorId}
                onBuildingChange={setBuildingId}
              />
            ) : null}

            {activeStep === 1 ? (
              <StepUploadCertificate
                file={file}
                onFileSelect={handleFileSelect}
                onReupload={handleReupload}
                isProcessing={isProcessing}
                verification={verification}
                processingError={processingError}
              />
            ) : null}

            {activeStep === 2 ? (
              <StepReviewCompliance
                vendorName={selectedVendor?.companyName ?? ''}
                buildingName={selectedBuilding?.name ?? ''}
                fileName={file?.name ?? ''}
                verification={verification}
                complianceResults={complianceResults}
              />
            ) : null}

            {activeStep === 3 ? (
              <StepApproveReject
                complianceResults={complianceResults}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ) : null}
          </Box>

          {/* Navigation buttons — Steps 0-2 only; Step 3 has its own action buttons */}
          {activeStep < 3 ? (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 3 }}>
              <Button
                variant="outlined"
                onClick={handleBack}
                disabled={activeStep === 0 || isProcessing}
              >
                Back
              </Button>
              <Button variant="contained" onClick={handleNext} disabled={!canProceed}>
                Next
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 3 }}>
              <Button variant="outlined" onClick={handleBack}>
                Back
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
