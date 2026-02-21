'use client';

import { useState } from 'react';
import Link from 'next/link';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';
import { ArrowLeft } from 'lucide-react';

import { PageShell } from '@shared/components';

const UPLOAD_STEPS = [
  'Select Vendor & Building',
  'Upload Document',
  'AI Verification',
  'Review & Submit',
];

/**
 * Upload COI Page — 4-step wizard for uploading a COI document.
 *
 * Steps:
 *   1. Select vendor & building (or create new vendor inline)
 *   2. Upload the COI PDF/image
 *   3. AI-powered verification & extraction (auto-advances)
 *   4. Review extracted data, compliance results, approve/reject
 *
 * TODO: Wire to documentService.uploadCOIDocument() & AI verification endpoints
 */
export function UploadCOIPage() {
  const [activeStep] = useState(0);

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

          {/* Step content placeholder */}
          <Box
            sx={{
              p: 4,
              borderRadius: 2,
              border: '2px dashed',
              borderColor: 'divider',
              textAlign: 'center',
              color: 'text.secondary',
              minHeight: 300,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
            }}
          >
            <Typography variant="h6" color="text.secondary">
              Step {activeStep + 1}: {UPLOAD_STEPS[activeStep]}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Upload wizard step content — Coming Soon
            </Typography>
          </Box>

          {/* Navigation buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 3 }}>
            <Button variant="outlined" disabled>
              Back
            </Button>
            <Button variant="contained" disabled>
              Next
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
