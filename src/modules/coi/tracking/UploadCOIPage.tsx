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
import Grid2 from '@mui/material/Grid2';
import LinearProgress from '@mui/material/LinearProgress';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import { alpha, useTheme } from '@mui/material/styles';
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
  ShieldCheck,
  Upload,
  User,
  XCircle,
} from 'lucide-react';

import { PageShell } from '@shared/components';

import { useBuildings } from '../buildings/useBuildingStore';
import { COIFileUpload, COIResultsSummary } from '../shared/components';
import type { COIVerificationResponse } from '../shared/types/coi.types';
import type { ComplianceLineItem } from '../shared/types/document.types';
import { useVendors } from '../vendors/useVendorStore';

import { mockVerifyCOIDocument } from './coi-verification.mock';
import { addCOIDocument, setCOIVerificationResults } from './useCOITrackingStore';

const UPLOAD_STEPS = [
  'Select Vendor & Building',
  'Upload Document',
  'AI Verification',
  'Review & Submit',
];

// ── Helpers ─────────────────────────────────────────────────────────

function complianceChipColor(score: number): 'success' | 'warning' | 'error' {
  if (score === 100) {
    return 'success';
  }
  return score >= 50 ? 'warning' : 'error';
}

function getStepIcon(step: number): React.ReactNode {
  if (step === 1) {
    return <Upload size={16} />;
  }
  if (step === 3) {
    return <CheckCircle size={16} />;
  }
  return undefined;
}

// ── Step 1: Select Vendor & Building ────────────────────────────────

interface Step1Props {
  readonly vendorId: string;
  readonly buildingId: string;
  readonly onVendorChange: (id: string) => void;
  readonly onBuildingChange: (id: string) => void;
}

function StepSelectVendorBuilding({
  vendorId,
  buildingId,
  onVendorChange,
  onBuildingChange,
}: Step1Props) {
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
          // Reset building if vendor changes and current building is not in newValue's buildings
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
                {option.contact.name} · {option.address.city}, {option.address.state}
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

// ── Step 2: Upload Document ─────────────────────────────────────────

interface Step2Props {
  readonly file: File | null;
  readonly onFileSelect: (file: File) => void;
  readonly isUploading: boolean;
}

function StepUploadDocument({ file, onFileSelect, isUploading }: Step2Props) {
  return (
    <Box sx={{ maxWidth: 600, mx: 'auto' }}>
      {file ? (
        <Alert severity="success" icon={<FileCheck size={20} />} sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {file.name}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {(file.size / 1024).toFixed(1)} KB · Ready for verification
          </Typography>
        </Alert>
      ) : null}
      <COIFileUpload onFileSelect={onFileSelect} isUploading={isUploading} />
    </Box>
  );
}

// ── Step 3: AI Verification ─────────────────────────────────────────

interface Step3Props {
  readonly isVerifying: boolean;
  readonly verification: COIVerificationResponse | null;
  readonly error: string | null;
}

function StepAIVerification({ isVerifying, verification, error }: Step3Props) {
  const theme = useTheme();

  if (error) {
    return (
      <Alert severity="error" sx={{ maxWidth: 600, mx: 'auto' }}>
        {error}
      </Alert>
    );
  }

  if (isVerifying) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 8,
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
          AI Verification in Progress
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: 'text.secondary', maxWidth: 400, textAlign: 'center' }}
        >
          Our AI is analyzing the certificate, extracting policy details, and comparing coverage
          limits against your requirements template.
        </Typography>
        <Box sx={{ width: '100%', maxWidth: 300 }}>
          <LinearProgress sx={{ borderRadius: 2, height: 6 }} />
        </Box>
      </Box>
    );
  }

  if (!verification) {
    return (
      <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
        <Typography variant="body1">Waiting for document upload...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Alert
        severity={verification.status === 'verified' ? 'success' : 'warning'}
        icon={
          verification.status === 'verified' ? <ShieldCheck size={20} /> : <XCircle size={20} />
        }
        sx={{
          bgcolor:
            verification.status === 'verified'
              ? alpha(theme.palette.success.main, 0.08)
              : alpha(theme.palette.warning.main, 0.08),
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {verification.status === 'verified'
            ? 'Certificate verified successfully!'
            : 'Certificate verified with compliance gaps.'}
        </Typography>
      </Alert>
      <COIResultsSummary data={verification} />
    </Box>
  );
}

// ── Step 4: Review & Submit ─────────────────────────────────────────

interface Step4Props {
  readonly vendorName: string;
  readonly buildingName: string;
  readonly fileName: string;
  readonly complianceResults: readonly ComplianceLineItem[];
  readonly verification: COIVerificationResponse | null;
}

function StepReviewSubmit({
  vendorName,
  buildingName,
  fileName,
  complianceResults,
  verification,
}: Step4Props) {
  const theme = useTheme();
  const passedCount = complianceResults.filter((r) => r.passed).length;
  const totalCount = complianceResults.length;
  const compliancePct = totalCount > 0 ? Math.round((passedCount / totalCount) * 100) : 0;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Summary header */}
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Upload Summary
          </Typography>
          <Grid2 container spacing={3}>
            <Grid2 size={{ xs: 12, sm: 4 }}>
              <Typography
                variant="caption"
                sx={{ color: 'text.secondary', textTransform: 'uppercase' }}
              >
                Vendor
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {vendorName}
              </Typography>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 4 }}>
              <Typography
                variant="caption"
                sx={{ color: 'text.secondary', textTransform: 'uppercase' }}
              >
                Building
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {buildingName}
              </Typography>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 4 }}>
              <Typography
                variant="caption"
                sx={{ color: 'text.secondary', textTransform: 'uppercase' }}
              >
                File
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {fileName}
              </Typography>
            </Grid2>
          </Grid2>
        </CardContent>
      </Card>

      {/* Compliance results table */}
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Box
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Compliance Check Results
            </Typography>
            <Chip
              label={`${compliancePct}% Compliant`}
              color={complianceChipColor(compliancePct)}
              size="medium"
              sx={{ fontWeight: 600 }}
            />
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
                {complianceResults.map((item) => (
                  <TableRow
                    key={item.requirement}
                    sx={{
                      bgcolor: item.passed ? 'transparent' : alpha(theme.palette.error.main, 0.04),
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

      {/* Verification details */}
      {verification ? <COIResultsSummary data={verification} /> : null}
    </Box>
  );
}

// ── Main Upload COI Page ────────────────────────────────────────────

/**
 * Upload COI Page — 4-step wizard for uploading a COI document.
 *
 * Steps:
 *   1. Select vendor & building
 *   2. Upload the COI PDF
 *   3. AI-powered verification & extraction (auto-advances)
 *   4. Review extracted data, compliance results, submit
 */
export function UploadCOIPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [vendorId, setVendorId] = useState('');
  const [buildingId, setBuildingId] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verification, setVerification] = useState<COIVerificationResponse | null>(null);
  const [complianceResults, setComplianceResults] = useState<readonly ComplianceLineItem[]>([]);
  const [earliestExpiration, setEarliestExpiration] = useState('');
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [docId, setDocId] = useState<string | null>(null);

  const vendors = useVendors();
  const buildings = useBuildings();

  const selectedVendor = useMemo(() => vendors.find((v) => v.id === vendorId), [vendors, vendorId]);
  const selectedBuilding = useMemo(
    () => buildings.find((b) => b.id === buildingId),
    [buildings, buildingId],
  );

  // ── Step validation ────────────────────────────────────────────────
  const canProceed = useMemo(() => {
    switch (activeStep) {
      case 0:
        return Boolean(vendorId && buildingId);
      case 1:
        return Boolean(file);
      case 2:
        return Boolean(verification) && !isVerifying;
      case 3:
        return !submitted;
      default:
        return false;
    }
  }, [activeStep, vendorId, buildingId, file, verification, isVerifying, submitted]);

  // ── File selected handler (Step 2) ─────────────────────────────────
  const handleFileSelect = useCallback((selectedFile: File) => {
    setFile(selectedFile);
  }, []);

  // ── Start AI verification (Step 2 → Step 3 transition) ────────────
  const handleStartVerification = useCallback(async () => {
    if (!file || !selectedVendor) {
      return;
    }

    setActiveStep(2);
    setIsVerifying(true);
    setVerificationError(null);

    try {
      const result = await mockVerifyCOIDocument(file, selectedVendor.companyName);
      setVerification(result.verification);
      setComplianceResults(result.complianceResults);
      setEarliestExpiration(result.earliestExpiration);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Verification failed.';
      setVerificationError(message);
    } finally {
      setIsVerifying(false);
    }
  }, [file, selectedVendor]);

  // ── Submit (Step 4) ────────────────────────────────────────────────
  const handleSubmit = useCallback(() => {
    if (!selectedVendor || !selectedBuilding || !file || !verification) {
      return;
    }

    // Create document in store
    const newDoc = addCOIDocument({
      vendorId: selectedVendor.id,
      vendorName: selectedVendor.companyName,
      buildingId: selectedBuilding.id,
      buildingName: selectedBuilding.name,
      templateId: selectedBuilding.templateId,
      status: 'under_review',
      fileUrl: `/mock/coi/${file.name}`,
      fileName: file.name,
      verificationId: verification.id,
      complianceResults: [...complianceResults],
      earliestExpiration,
      uploadedAt: new Date().toISOString(),
    });

    // Also store verification results
    if (newDoc.id) {
      setCOIVerificationResults(newDoc.id, verification.id, complianceResults, earliestExpiration);
    }

    setDocId(newDoc.id);
    setSubmitted(true);
  }, [selectedVendor, selectedBuilding, file, verification, complianceResults, earliestExpiration]);

  // ── Navigation ─────────────────────────────────────────────────────
  const handleNext = useCallback(() => {
    if (activeStep === 1 && file) {
      // Auto-trigger verification when moving from step 2 to step 3
      handleStartVerification();
      return;
    }
    if (activeStep === 3) {
      handleSubmit();
      return;
    }
    setActiveStep((prev) => Math.min(prev + 1, UPLOAD_STEPS.length - 1));
  }, [activeStep, file, handleStartVerification, handleSubmit]);

  const handleBack = useCallback(() => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  }, []);

  // ── Get button label ───────────────────────────────────────────────
  const nextButtonLabel = useMemo(() => {
    switch (activeStep) {
      case 1:
        return 'Start Verification';
      case 3:
        return submitted ? 'Submitted' : 'Submit for Review';
      default:
        return 'Next';
    }
  }, [activeStep, submitted]);

  // ── Success state ──────────────────────────────────────────────────
  if (submitted) {
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
            <Box sx={{ color: 'success.main' }}>
              <CheckCircle size={64} strokeWidth={1.5} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              COI Submitted Successfully
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 500 }}>
              The certificate for <strong>{selectedVendor?.companyName}</strong> at{' '}
              <strong>{selectedBuilding?.name}</strong> has been submitted and is now pending
              review.
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
              <Button
                variant="outlined"
                onClick={() => {
                  setActiveStep(0);
                  setVendorId('');
                  setBuildingId('');
                  setFile(null);
                  setVerification(null);
                  setComplianceResults([]);
                  setEarliestExpiration('');
                  setVerificationError(null);
                  setSubmitted(false);
                  setDocId(null);
                }}
              >
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
              <StepSelectVendorBuilding
                vendorId={vendorId}
                buildingId={buildingId}
                onVendorChange={setVendorId}
                onBuildingChange={setBuildingId}
              />
            ) : null}

            {activeStep === 1 ? (
              <StepUploadDocument file={file} onFileSelect={handleFileSelect} isUploading={false} />
            ) : null}

            {activeStep === 2 ? (
              <StepAIVerification
                isVerifying={isVerifying}
                verification={verification}
                error={verificationError}
              />
            ) : null}

            {activeStep === 3 ? (
              <StepReviewSubmit
                vendorName={selectedVendor?.companyName ?? ''}
                buildingName={selectedBuilding?.name ?? ''}
                fileName={file?.name ?? ''}
                complianceResults={complianceResults}
                verification={verification}
              />
            ) : null}
          </Box>

          {/* Navigation buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 3 }}>
            <Button
              variant="outlined"
              onClick={handleBack}
              disabled={activeStep === 0 || isVerifying}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={!canProceed}
              startIcon={getStepIcon(activeStep)}
            >
              {nextButtonLabel}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
