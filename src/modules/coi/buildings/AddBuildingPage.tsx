'use client';

import { type ChangeEvent, useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import Grid2 from '@mui/material/Grid2';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import type { SelectChangeEvent } from '@mui/material/Select';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { ArrowLeft, Save } from 'lucide-react';

import { PageShell } from '@shared/components';

import type { BuildingFormValues } from './building.types';
import { addBuilding, useTemplates } from './useBuildingStore';

const INITIAL_VALUES: BuildingFormValues = {
  name: '',
  street: '',
  city: '',
  state: '',
  zip: '',
  certificateHolderName: '',
  certificateHolderAddress: '',
  templateId: '',
};

/**
 * Add Building Page — Single-screen form to register a new
 * building/property with address, certificate holder, and
 * requirement template assignment.
 */
export function AddBuildingPage() {
  const router = useRouter();
  const templates = useTemplates();
  const [values, setValues] = useState<BuildingFormValues>(INITIAL_VALUES);
  const [success, setSuccess] = useState(false);

  const handleChange = useCallback(
    (field: keyof BuildingFormValues) => (e: ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({ ...prev, [field]: e.target.value }));
    },
    [],
  );

  const handleTemplateChange = useCallback((e: SelectChangeEvent) => {
    setValues((prev) => ({ ...prev, templateId: e.target.value }));
  }, []);

  // Auto-fill certificate holder address from building address
  const handleAutoFill = useCallback(() => {
    setValues((prev) => ({
      ...prev,
      certificateHolderAddress: [
        prev.street,
        [prev.city, prev.state, prev.zip].filter(Boolean).join(', '),
      ]
        .filter(Boolean)
        .join(', '),
    }));
  }, []);

  const handleSubmit = useCallback(() => {
    const building = addBuilding(values);
    setSuccess(true);
    setTimeout(() => {
      router.push(`/certificate-of-insurance/buildings/${building.id}`);
    }, 600);
  }, [values, router]);

  const templateOptions = useMemo(
    () => templates.map((t) => ({ id: t.id, name: t.name })),
    [templates],
  );

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
          title="Add Building"
          description="Register a new building or property and configure its COI requirements"
        />
      </Box>

      {success ? (
        <Alert severity="success" sx={{ mb: 2 }}>
          Building created successfully! Redirecting…
        </Alert>
      ) : null}

      <Card>
        <CardContent sx={{ p: 3 }}>
          {/* Building Information */}
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Building Information
          </Typography>
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Building Name"
                required
                size="small"
                value={values.name}
                onChange={handleChange('name')}
              />
            </Grid2>
            <Grid2 size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Street Address"
                required
                size="small"
                value={values.street}
                onChange={handleChange('street')}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                label="City"
                required
                size="small"
                value={values.city}
                onChange={handleChange('city')}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                label="State"
                required
                size="small"
                value={values.state}
                onChange={handleChange('state')}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                label="ZIP Code"
                required
                size="small"
                value={values.zip}
                onChange={handleChange('zip')}
              />
            </Grid2>
          </Grid2>

          <Divider sx={{ my: 3 }} />

          {/* Certificate Holder */}
          <Box
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Certificate Holder
            </Typography>
            <Button variant="text" size="small" onClick={handleAutoFill}>
              Auto-fill from address
            </Button>
          </Box>
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Certificate Holder Name"
                required
                size="small"
                value={values.certificateHolderName}
                onChange={handleChange('certificateHolderName')}
                helperText="Legal entity name that should appear on certificates"
              />
            </Grid2>
            <Grid2 size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Certificate Holder Address"
                required
                size="small"
                value={values.certificateHolderAddress}
                onChange={handleChange('certificateHolderAddress')}
                helperText="Full mailing address for the certificate holder"
              />
            </Grid2>
          </Grid2>

          <Divider sx={{ my: 3 }} />

          {/* Requirement Template */}
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Requirement Template
          </Typography>
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth size="small">
                <InputLabel>COI Requirement Template</InputLabel>
                <Select
                  value={values.templateId}
                  label="COI Requirement Template"
                  onChange={handleTemplateChange}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {templateOptions.map((opt) => (
                    <MenuItem key={opt.id} value={opt.id}>
                      {opt.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid2>
          </Grid2>

          {/* Actions */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
            <Button variant="outlined" component={Link} href="/certificate-of-insurance/buildings">
              Cancel
            </Button>
            <Button
              variant="contained"
              startIcon={<Save size={16} />}
              onClick={handleSubmit}
              disabled={success}
            >
              Save Building
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
