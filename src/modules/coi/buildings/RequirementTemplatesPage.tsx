'use client';

import Link from 'next/link';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid2 from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import { ArrowLeft } from 'lucide-react';

import { PageShell } from '@shared/components';

import { EmptyState } from '../shared/components';

/**
 * Requirement Templates Page — Create and manage reusable COI
 * requirement templates that can be assigned to buildings.
 *
 * Each template defines policy types, minimum coverage amounts,
 * additional insured requirements, waiver of subrogation, etc.
 *
 * TODO: Wire to templateService.getTemplates() once API is ready.
 */
export function RequirementTemplatesPage() {
  const templates: unknown[] = [];

  return (
    <Box>
      <Button
        component={Link}
        href="/certificate-of-insurance/buildings"
        startIcon={<ArrowLeft size={16} />}
        size="small"
        sx={{ mb: 1 }}
      >
        Back to Buildings
      </Button>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <PageShell
          title="Requirement Templates"
          description="Define reusable COI policy requirements for your buildings"
        />
        <Button variant="contained" size="small" disabled>
          Create Template
        </Button>
      </Box>

      {templates.length === 0 ? (
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <EmptyState
              title="No Templates"
              description="Create a requirement template to define the insurance policies vendors must provide."
              action={
                <Button variant="contained" size="small" disabled>
                  Create Template
                </Button>
              }
            />
          </CardContent>
        </Card>
      ) : (
        <Grid2 container spacing={2} sx={{ mt: 2 }}>
          {/* Template cards will render here */}
          <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                  Template cards — Coming Soon
                </Typography>
              </CardContent>
            </Card>
          </Grid2>
        </Grid2>
      )}
    </Box>
  );
}
