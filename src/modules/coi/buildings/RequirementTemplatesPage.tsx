'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Grid2 from '@mui/material/Grid2';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { ArrowLeft, Building2, Plus, Search, ShieldCheck } from 'lucide-react';

import { PageShell } from '@shared/components';

import { EmptyState, StatusBadge } from '../shared/components';

import { POLICY_TYPE_LABELS } from './template.types';
import { useTemplates } from './useBuildingStore';

/**
 * Requirement Templates Page — Create and manage reusable COI
 * requirement templates that can be assigned to buildings.
 */
export function RequirementTemplatesPage() {
  const templates = useTemplates();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) {
      return templates;
    }
    const q = search.toLowerCase();
    return templates.filter(
      (t) => t.name.toLowerCase().includes(q) || (t.description ?? '').toLowerCase().includes(q),
    );
  }, [templates, search]);

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
          title="Requirement Templates"
          description="Define reusable COI policy requirements for your buildings"
        />
        <Button variant="contained" size="small" startIcon={<Plus size={18} />} disabled>
          Create Template
        </Button>
      </Box>

      {/* Search */}
      <Box sx={{ mb: 2 }}>
        <TextField
          size="small"
          placeholder="Search templates…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={16} />
                </InputAdornment>
              ),
            },
          }}
          sx={{ width: { xs: '100%', sm: 320 } }}
        />
      </Box>

      {filtered.length === 0 && !search ? (
        <Card>
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
      ) : null}
      {filtered.length === 0 && search ? (
        <Card>
          <CardContent>
            <EmptyState title="No results" description={`No templates match "${search}".`} />
          </CardContent>
        </Card>
      ) : null}
      {filtered.length > 0 ? (
        <Grid2 container spacing={2}>
          {filtered.map((template) => (
            <Grid2 key={template.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                sx={{
                  height: '100%',
                  borderLeft: template.isDefault ? 4 : 0,
                  borderColor: 'primary.main',
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mb: 1,
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {template.name}
                    </Typography>
                    {template.isDefault ? (
                      <Chip label="Default" size="small" color="primary" variant="filled" />
                    ) : null}
                  </Box>

                  {template.description ? (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {template.description}
                    </Typography>
                  ) : null}

                  {/* Policy types */}
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontWeight: 600, mb: 0.5, display: 'block' }}
                    >
                      Required Policies
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {template.policyRequirements
                        .filter((pr) => pr.required)
                        .map((pr) => (
                          <Chip
                            key={pr.policyType}
                            label={POLICY_TYPE_LABELS[pr.policyType]}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                    </Box>
                  </Box>

                  {/* Endorsements */}
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                    {template.additionalInsuredRequired ? (
                      <StatusBadge label="Addl. Insured" variant="success" size="small" />
                    ) : null}
                    {template.waiverOfSubrogationRequired ? (
                      <StatusBadge label="Waiver of Sub." variant="success" size="small" />
                    ) : null}
                    {template.endorsementRequired ? (
                      <StatusBadge label="Endorsement" variant="success" size="small" />
                    ) : null}
                  </Box>

                  {/* Stats */}
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 2,
                      pt: 1,
                      borderTop: 1,
                      borderColor: 'divider',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Building2 size={14} />
                      <Typography variant="caption">
                        {template.buildingIds.length} building
                        {template.buildingIds.length === 1 ? '' : 's'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <ShieldCheck size={14} />
                      <Typography variant="caption">
                        {template.policyRequirements.filter((p) => p.required).length} policies
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid2>
          ))}
        </Grid2>
      ) : null}
    </Box>
  );
}
