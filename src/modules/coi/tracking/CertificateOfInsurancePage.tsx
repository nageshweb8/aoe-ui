'use client';

import { useCallback, useState } from 'react';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid2 from '@mui/material/Grid2';
import { RotateCcw } from 'lucide-react';

import { PageShell } from '@shared/components';

import { verifyCOIDocument } from '../api/coi.service';
import {
  COIExpirationAlert,
  COIFileUpload,
  COIPoliciesTable,
  COIResultsSummary,
} from '../shared/components';
import type { COIUploadStatus, COIVerificationResponse } from '../shared/types/coi.types';
import { checkExpiredPolicies } from '../shared/utils/coiValidation';

export function CertificateOfInsurancePage() {
  const [uploadStatus, setUploadStatus] = useState<COIUploadStatus>('idle');
  const [result, setResult] = useState<COIVerificationResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileSelect = useCallback(async (file: File) => {
    setUploadStatus('uploading');
    setErrorMessage(null);
    setResult(null);

    try {
      const response = await verifyCOIDocument(file);
      setResult(response);
      setUploadStatus('success');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setErrorMessage(message);
      setUploadStatus('error');
    }
  }, []);

  const handleReset = useCallback(() => {
    setUploadStatus('idle');
    setResult(null);
    setErrorMessage(null);
  }, []);

  const expiredPolicies = result ? checkExpiredPolicies(result.policies) : [];

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
          title="COI Verification"
          description="Upload a Certificate of Insurance for automated data extraction and expiration validation."
        />
        {result ? (
          <Button
            variant="outlined"
            startIcon={<RotateCcw size={16} />}
            onClick={handleReset}
            size="small"
          >
            New Verification
          </Button>
        ) : null}
      </Box>

      {/* Upload phase */}
      {!result && (
        <Grid2 container spacing={3} justifyContent="center">
          <Grid2 size={{ xs: 12, sm: 10, md: 6 }}>
            <COIFileUpload
              onFileSelect={handleFileSelect}
              isUploading={uploadStatus === 'uploading'}
            />
          </Grid2>
        </Grid2>
      )}

      {/* Error */}
      {uploadStatus === 'error' && errorMessage ? (
        <Alert severity="error" sx={{ mt: 2 }} onClose={handleReset}>
          {errorMessage}
        </Alert>
      ) : null}

      {/* Results phase */}
      {result ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Expiration warnings at top */}
          <COIExpirationAlert expirations={expiredPolicies} />

          {/* Summary card */}
          <COIResultsSummary data={result} />

          {/* Policies table */}
          <COIPoliciesTable policies={result.policies} />
        </Box>
      ) : null}
    </Box>
  );
}
