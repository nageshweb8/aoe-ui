'use client';

import { type ChangeEvent, useCallback, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import Alert from '@mui/material/Alert';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid2 from '@mui/material/Grid2';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { ArrowLeft, Save } from 'lucide-react';

import { PageShell } from '@shared/components';

import { useBuildings } from '../buildings/useBuildingStore';

import { addVendor } from './useVendorStore';
import type { VendorFormValues } from './vendor.types';

const INITIAL_VALUES: VendorFormValues = {
  companyName: '',
  street: '',
  city: '',
  state: '',
  zip: '',
  country: 'US',
  contactName: '',
  contactJobTitle: '',
  contactEmail: '',
  contactPhone: '',
  agentName: '',
  agentCompany: '',
  agentEmail: '',
  agentPhone: '',
  buildingIds: [],
};

/**
 * Add Vendor Page — Single-screen wizard to create a vendor
 * with company info, contact details, and insurance agent info.
 *
 * Design principle: "Fewer steps than the competitor — consolidate
 * into a single-screen wizard" (COI-UI-Enhancement-Plan §6).
 */
export function AddVendorPage() {
  const router = useRouter();
  const [values, setValues] = useState<VendorFormValues>(INITIAL_VALUES);
  const [success, setSuccess] = useState(false);
  const buildings = useBuildings();

  const selectedBuildings = buildings.filter((b) => values.buildingIds.includes(b.id));

  const handleChange = useCallback(
    (field: keyof VendorFormValues) => (e: ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({ ...prev, [field]: e.target.value }));
    },
    [],
  );

  const handleSubmit = useCallback(() => {
    const vendor = addVendor(values);
    setSuccess(true);
    // Navigate to the new vendor's detail page after a brief delay
    setTimeout(() => {
      router.push(`/certificate-of-insurance/vendors/${vendor.id}`);
    }, 600);
  }, [values, router]);

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Button
          component={Link}
          href="/certificate-of-insurance/vendors"
          startIcon={<ArrowLeft size={16} />}
          size="small"
          sx={{ mb: 1 }}
        >
          Back to Vendors
        </Button>
        <PageShell
          title="Add Vendor"
          description="Register a new vendor and capture their company, contact, and insurance agent details"
        />
      </Box>

      {success ? (
        <Alert severity="success" sx={{ mb: 2 }}>
          Vendor created successfully! Redirecting…
        </Alert>
      ) : null}

      <Card>
        <CardContent sx={{ p: 3 }}>
          {/* Company Information */}
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Company Information
          </Typography>
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Company Name"
                required
                size="small"
                value={values.companyName}
                onChange={handleChange('companyName')}
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

          {/* Primary Contact */}
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Primary Contact
          </Typography>
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Contact Name"
                required
                size="small"
                value={values.contactName}
                onChange={handleChange('contactName')}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Job Title"
                size="small"
                value={values.contactJobTitle}
                onChange={handleChange('contactJobTitle')}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                required
                size="small"
                value={values.contactEmail}
                onChange={handleChange('contactEmail')}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Phone"
                type="tel"
                size="small"
                value={values.contactPhone}
                onChange={handleChange('contactPhone')}
              />
            </Grid2>
          </Grid2>

          <Divider sx={{ my: 3 }} />

          {/* Insurance Agent */}
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Insurance Agent / Broker
          </Typography>
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Agent Name"
                size="small"
                value={values.agentName}
                onChange={handleChange('agentName')}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Agent Company"
                size="small"
                value={values.agentCompany}
                onChange={handleChange('agentCompany')}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Agent Email"
                type="email"
                size="small"
                value={values.agentEmail}
                onChange={handleChange('agentEmail')}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Agent Phone"
                type="tel"
                size="small"
                value={values.agentPhone}
                onChange={handleChange('agentPhone')}
              />
            </Grid2>
          </Grid2>

          <Divider sx={{ my: 3 }} />

          {/* Building Assignment */}
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Building Assignment
          </Typography>
          <Autocomplete
            multiple
            options={buildings}
            getOptionLabel={(b) => b.name}
            value={selectedBuildings}
            onChange={(_, newValue) => {
              setValues((prev) => ({ ...prev, buildingIds: newValue.map((b) => b.id) }));
            }}
            disableCloseOnSelect
            renderOption={(props, option, { selected }) => (
              <li {...props} key={option.id}>
                <Checkbox size="small" checked={selected} sx={{ mr: 1 }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {option.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {option.address.street}, {option.address.city}, {option.address.state}{' '}
                    {option.address.zip}
                  </Typography>
                </Box>
              </li>
            )}
            renderTags={(tagValue, getTagProps) =>
              tagValue.map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  key={option.id}
                  label={option.name}
                  size="small"
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Assigned Buildings"
                placeholder={selectedBuildings.length === 0 ? 'Search buildings…' : ''}
                size="small"
              />
            )}
            isOptionEqualToValue={(option, value) => option.id === value.id}
          />

          {/* Actions */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
            <Button variant="outlined" component={Link} href="/certificate-of-insurance/vendors">
              Cancel
            </Button>
            <Button
              variant="contained"
              startIcon={<Save size={16} />}
              onClick={handleSubmit}
              disabled={success}
            >
              Save Vendor
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
