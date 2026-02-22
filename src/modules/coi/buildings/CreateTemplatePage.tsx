'use client';

import { type ChangeEvent, useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid2 from '@mui/material/Grid2';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import type { SelectChangeEvent } from '@mui/material/Select';
import Select from '@mui/material/Select';
import Snackbar from '@mui/material/Snackbar';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { ArrowLeft, Save } from 'lucide-react';

import { PageShell } from '@shared/components';

import type { PolicyRequirement, PolicyType, TemplateFormValues } from './template.types';
import { POLICY_TYPE_LABELS } from './template.types';
import { addTemplate, useTemplates } from './useBuildingStore';

/* ------------------------------------------------------------------ */
/*  ACORD 25 limit field definitions                                  */
/* ------------------------------------------------------------------ */

interface LimitField {
  readonly key: string;
  readonly label: string;
}

const CGL_LIMITS: readonly LimitField[] = [
  { key: 'Each Occurrence', label: 'Each Occurrence' },
  { key: 'Damage to Rented Premises', label: 'Damage to Rented Premises (Ea occurrence)' },
  { key: 'Med Exp', label: 'Med Exp (Any one person)' },
  { key: 'Personal & Adv Injury', label: 'Personal & Adv Injury' },
  { key: 'General Aggregate', label: 'General Aggregate' },
  { key: 'Products-Comp/Op Agg', label: 'Products - Comp/Op Agg' },
] as const;

const AUTO_LIMITS: readonly LimitField[] = [
  { key: 'Combined Single Limit', label: 'Combined Single Limit (Ea accident)' },
  { key: 'Bodily Injury Per Person', label: 'Bodily Injury (Per person)' },
  { key: 'Bodily Injury Per Accident', label: 'Bodily Injury (Per accident)' },
  { key: 'Property Damage', label: 'Property Damage (Per accident)' },
] as const;

const UMBRELLA_LIMITS: readonly LimitField[] = [
  { key: 'Each Occurrence', label: 'Each Occurrence' },
  { key: 'Aggregate', label: 'Aggregate' },
] as const;

const WC_LIMITS: readonly LimitField[] = [
  { key: 'Each Accident', label: 'E.L. Each Accident' },
  { key: 'Disease - Each Employee', label: 'E.L. Disease - Ea Employee' },
  { key: 'Disease - Policy Limit', label: 'E.L. Disease - Policy Limit' },
] as const;

/** Default endorsement documents */
const DEFAULT_DOCUMENTS = [
  'Additional Insured Endorsement',
  'Waiver of Subrogation Endorsement',
  'Primary & Non-Contributory Endorsement',
  '30-Day Notice of Cancellation',
  'Per Project Aggregate Endorsement',
] as const;

/* ------------------------------------------------------------------ */
/*  Policy section state                                              */
/* ------------------------------------------------------------------ */

interface PolicySectionState {
  readonly enabled: boolean;
  readonly required: boolean;
  readonly limits: Record<string, string>;
}

type PolicySectionsState = Record<PolicyType, PolicySectionState>;

function createEmptyPolicySections(): PolicySectionsState {
  const sections: Partial<PolicySectionsState> = {};
  for (const key of Object.keys(POLICY_TYPE_LABELS) as PolicyType[]) {
    sections[key] = { enabled: false, required: false, limits: {} };
  }
  return sections as PolicySectionsState;
}

function createDefaultPolicySections(): PolicySectionsState {
  const sections = createEmptyPolicySections();
  sections.general_liability = {
    enabled: true,
    required: true,
    limits: {
      'Each Occurrence': '1,000,000',
      'General Aggregate': '2,000,000',
      'Products-Comp/Op Agg': '2,000,000',
      'Personal & Adv Injury': '1,000,000',
    },
  };
  sections.auto_liability = {
    enabled: true,
    required: true,
    limits: { 'Combined Single Limit': '1,000,000' },
  };
  sections.workers_compensation = {
    enabled: true,
    required: true,
    limits: {
      'Each Accident': '500,000',
      'Disease - Each Employee': '500,000',
      'Disease - Policy Limit': '500,000',
    },
  };
  sections.umbrella = {
    enabled: true,
    required: true,
    limits: { 'Each Occurrence': '5,000,000', Aggregate: '5,000,000' },
  };
  return sections;
}

/* ------------------------------------------------------------------ */
/*  PolicyAccordion — Controlled policy section component              */
/* ------------------------------------------------------------------ */

interface PolicyAccordionProps {
  readonly policyType: PolicyType;
  readonly label: string;
  readonly state: PolicySectionState;
  readonly limits: readonly LimitField[];
  readonly showAdditionalInsured?: boolean;
  readonly showWaiverOfSubrogation?: boolean;
  readonly showClaimsOccur?: boolean;
  readonly showAutoTypes?: boolean;
  readonly showUmbrellaType?: boolean;
  readonly showPerStatute?: boolean;
  readonly showDeductible?: boolean;
  readonly defaultExpanded?: boolean;
  readonly onToggle: (policyType: PolicyType, enabled: boolean) => void;
  readonly onRequiredChange: (policyType: PolicyType, required: boolean) => void;
  readonly onLimitChange: (policyType: PolicyType, key: string, value: string) => void;
}

function PolicyAccordion({
  policyType,
  label,
  state,
  limits,
  showAdditionalInsured = false,
  showWaiverOfSubrogation = false,
  showClaimsOccur = false,
  showAutoTypes = false,
  showUmbrellaType = false,
  showPerStatute = false,
  showDeductible = false,
  defaultExpanded = false,
  onToggle,
  onRequiredChange,
  onLimitChange,
}: PolicyAccordionProps) {
  return (
    <Accordion
      defaultExpanded={defaultExpanded}
      sx={{ '&:before': { display: 'none' }, opacity: state.enabled ? 1 : 0.6 }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          bgcolor: 'action.hover',
          borderBottom: '1px solid',
          borderColor: 'divider',
          '& .MuiAccordionSummary-content': { alignItems: 'center', gap: 2 },
        }}
      >
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              checked={state.enabled}
              onChange={(_, checked) => onToggle(policyType, checked)}
            />
          }
          label=""
          onClick={(e) => e.stopPropagation()}
          sx={{ mr: 0 }}
        />
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          {label}
        </Typography>
        <Chip
          label={state.required ? 'Required' : 'Optional'}
          size="small"
          color={state.required ? 'primary' : 'default'}
          variant="outlined"
          onClick={(e) => {
            e.stopPropagation();
            if (state.enabled) {
              onRequiredChange(policyType, !state.required);
            }
          }}
          sx={{ cursor: 'pointer' }}
        />
      </AccordionSummary>

      <AccordionDetails sx={{ pt: 3 }}>
        <Grid2 container spacing={2}>
          {/* Policy sub-type toggles */}
          {showClaimsOccur ? (
            <Grid2 size={{ xs: 12 }}>
              <Box sx={{ display: 'flex', gap: 3, mb: 1 }}>
                <FormControlLabel
                  control={<Switch size="small" defaultChecked />}
                  label={
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Occur
                    </Typography>
                  }
                />
                <FormControlLabel
                  control={<Switch size="small" />}
                  label={
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Claims-Made
                    </Typography>
                  }
                />
              </Box>
            </Grid2>
          ) : null}

          {showAutoTypes ? (
            <Grid2 size={{ xs: 12 }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 1 }}>
                {[
                  'Any Auto',
                  'All Owned Autos',
                  'Hired Autos',
                  'Scheduled Autos',
                  'Non-Owned Autos',
                ].map((autoType) => (
                  <FormControlLabel
                    key={autoType}
                    control={<Checkbox size="small" />}
                    label={<Typography variant="body2">{autoType}</Typography>}
                  />
                ))}
              </Box>
            </Grid2>
          ) : null}

          {showUmbrellaType ? (
            <Grid2 size={{ xs: 12 }}>
              <Box sx={{ display: 'flex', gap: 3, mb: 1 }}>
                {['Umbrella Liab', 'Excess Liab', 'Occur', 'Claims-Made'].map((t) => (
                  <FormControlLabel
                    key={t}
                    control={<Switch size="small" />}
                    label={
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {t}
                      </Typography>
                    }
                  />
                ))}
              </Box>
            </Grid2>
          ) : null}

          {showDeductible ? (
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Deductible / Retention"
                size="small"
                fullWidth
                placeholder="10,000"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid2>
          ) : null}

          {showPerStatute ? (
            <Grid2 size={{ xs: 12 }}>
              <FormControlLabel
                control={<Checkbox size="small" defaultChecked />}
                label={
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Per Statute (WC Statutory Limits)
                  </Typography>
                }
              />
            </Grid2>
          ) : null}

          {/* Additional Insured / Waiver of Subrogation */}
          {showAdditionalInsured || showWaiverOfSubrogation ? (
            <Grid2 size={{ xs: 12 }}>
              <Box sx={{ display: 'flex', gap: 3 }}>
                {showAdditionalInsured ? (
                  <FormControlLabel
                    control={<Switch size="small" color="primary" />}
                    label={
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        Additional Insured
                      </Typography>
                    }
                  />
                ) : null}
                {showWaiverOfSubrogation ? (
                  <FormControlLabel
                    control={<Switch size="small" color="primary" />}
                    label={
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        Waiver of Subrogation
                      </Typography>
                    }
                  />
                ) : null}
              </Box>
            </Grid2>
          ) : null}

          <Grid2 size={{ xs: 12 }}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Minimum Coverage Limits
            </Typography>
          </Grid2>

          {/* Limit fields — controlled */}
          {limits.map((limit) => (
            <Grid2 key={limit.key} size={{ xs: 12, sm: 6, md: 4 }}>
              <TextField
                label={limit.label}
                size="small"
                fullWidth
                placeholder="1,000,000"
                value={state.limits[limit.key] ?? ''}
                onChange={(e) => onLimitChange(policyType, limit.key, e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid2>
          ))}
        </Grid2>
      </AccordionDetails>
    </Accordion>
  );
}

/* ------------------------------------------------------------------ */
/*  CreateTemplatePage                                                 */
/* ------------------------------------------------------------------ */

/**
 * Create Template Page — ACORD 25-based template editor with full
 * controlled state. Allows defining policy types, minimum coverage
 * limits, certificate holder info, endorsement documents, and
 * additional verbiage.
 *
 * Route: /certificate-of-insurance/buildings/templates/create
 */
export function CreateTemplatePage() {
  const router = useRouter();
  const existingTemplates = useTemplates();

  // ── Form state ──────────────────────────────────────────────────
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [baseTemplate, setBaseTemplate] = useState('');
  const [certHolderName, setCertHolderName] = useState('');
  const [certHolderAddress, setCertHolderAddress] = useState('');
  const [additionalVerbiage, setAdditionalVerbiage] = useState('');
  const [additionalInsuredRequired, setAdditionalInsuredRequired] = useState(true);
  const [waiverOfSubrogationRequired, setWaiverOfSubrogationRequired] = useState(true);
  const [endorsementRequired, setEndorsementRequired] = useState(true);
  const [policySections, setPolicySections] = useState<PolicySectionsState>(
    createDefaultPolicySections,
  );
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([
    'Additional Insured Endorsement',
    'Waiver of Subrogation Endorsement',
  ]);
  const [customDoc, setCustomDoc] = useState('');

  // ── Feedback state ──────────────────────────────────────────────
  const [success, setSuccess] = useState(false);
  const [snackbar, setSnackbar] = useState(false);

  // ── Derived ─────────────────────────────────────────────────────
  const canSubmit = useMemo(() => {
    const hasName = name.trim().length > 0;
    const hasPolicy = Object.values(policySections).some((s) => s.enabled);
    return hasName && hasPolicy;
  }, [name, policySections]);

  // ── Policy section handlers ─────────────────────────────────────
  const handlePolicyToggle = useCallback((policyType: PolicyType, enabled: boolean) => {
    setPolicySections((prev) => ({
      ...prev,
      [policyType]: {
        ...prev[policyType],
        enabled,
        required: enabled ? prev[policyType].required : false,
      },
    }));
  }, []);

  const handlePolicyRequired = useCallback((policyType: PolicyType, required: boolean) => {
    setPolicySections((prev) => ({
      ...prev,
      [policyType]: { ...prev[policyType], required },
    }));
  }, []);

  const handleLimitChange = useCallback((policyType: PolicyType, key: string, value: string) => {
    setPolicySections((prev) => ({
      ...prev,
      [policyType]: {
        ...prev[policyType],
        limits: { ...prev[policyType].limits, [key]: value },
      },
    }));
  }, []);

  // ── Document handlers ───────────────────────────────────────────
  const handleToggleDocument = useCallback((doc: string) => {
    setSelectedDocuments((prev) =>
      prev.includes(doc) ? prev.filter((d) => d !== doc) : [...prev, doc],
    );
  }, []);

  const handleAddCustomDoc = useCallback(() => {
    const trimmed = customDoc.trim();
    if (trimmed && !selectedDocuments.includes(trimmed)) {
      setSelectedDocuments((prev) => [...prev, trimmed]);
      setCustomDoc('');
    }
  }, [customDoc, selectedDocuments]);

  const handleRemoveDocument = useCallback((doc: string) => {
    setSelectedDocuments((prev) => prev.filter((d) => d !== doc));
  }, []);

  // ── Base template handler ───────────────────────────────────────
  const handleBaseTemplateChange = useCallback(
    (e: SelectChangeEvent) => {
      const templateId = e.target.value;
      setBaseTemplate(templateId);

      if (!templateId) {
        setPolicySections(createDefaultPolicySections());
        return;
      }

      const tmpl = existingTemplates.find((t) => t.id === templateId);
      if (!tmpl) {
        return;
      }

      // Pre-fill from existing template
      setDescription(tmpl.description ?? '');
      setCertHolderName(tmpl.certificateHolder?.name ?? '');
      setCertHolderAddress(tmpl.certificateHolder?.address ?? '');
      setAdditionalVerbiage(tmpl.additionalVerbiage ?? '');
      setAdditionalInsuredRequired(tmpl.additionalInsuredRequired);
      setWaiverOfSubrogationRequired(tmpl.waiverOfSubrogationRequired);
      setEndorsementRequired(tmpl.endorsementRequired);
      setSelectedDocuments(tmpl.additionalDocuments ? [...tmpl.additionalDocuments] : []);

      // Build policy sections from template requirements
      const sections = createEmptyPolicySections();
      for (const pr of tmpl.policyRequirements) {
        const cleaned: Record<string, string> = {};
        if (pr.minimumLimits) {
          for (const [k, v] of Object.entries(pr.minimumLimits)) {
            cleaned[k] = v.replace(/^\$/, '');
          }
        }
        sections[pr.policyType] = {
          enabled: true,
          required: pr.required,
          limits: cleaned,
        };
      }
      setPolicySections(sections);
    },
    [existingTemplates],
  );

  // ── Submit ──────────────────────────────────────────────────────
  const handleSubmit = useCallback(() => {
    // Build policy requirements from sections state
    const policyRequirements: PolicyRequirement[] = [];
    for (const [type, section] of Object.entries(policySections)) {
      if (!section.enabled) {
        continue;
      }
      const minimumLimits: Record<string, string> = {};
      for (const [k, v] of Object.entries(section.limits)) {
        if (v.trim()) {
          minimumLimits[k] = `$${v.replace(/^\$/, '')}`;
        }
      }
      policyRequirements.push({
        policyType: type as PolicyType,
        required: section.required,
        minimumLimits: Object.keys(minimumLimits).length > 0 ? minimumLimits : undefined,
      });
    }

    const formValues: TemplateFormValues = {
      name: name.trim(),
      description: description.trim(),
      isDefault,
      policyRequirements,
      additionalInsuredRequired,
      waiverOfSubrogationRequired,
      endorsementRequired,
      additionalVerbiage: additionalVerbiage.trim(),
      certificateHolderName: certHolderName.trim(),
      certificateHolderAddress: certHolderAddress.trim(),
      additionalDocuments: selectedDocuments,
    };

    addTemplate(formValues);
    setSuccess(true);
    setSnackbar(true);

    setTimeout(() => {
      router.push('/certificate-of-insurance/buildings/templates');
    }, 800);
  }, [
    name,
    description,
    isDefault,
    policySections,
    additionalInsuredRequired,
    waiverOfSubrogationRequired,
    endorsementRequired,
    additionalVerbiage,
    certHolderName,
    certHolderAddress,
    selectedDocuments,
    router,
  ]);

  // ── Render ──────────────────────────────────────────────────────
  return (
    <Box>
      <Button
        component={Link}
        href="/certificate-of-insurance/buildings/templates"
        startIcon={<ArrowLeft size={16} />}
        size="small"
        sx={{ mb: 1 }}
      >
        Back to Templates
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
          title="Create Requirement Template"
          description="Define ACORD 25-based insurance requirements that can be assigned to buildings"
        />
      </Box>

      {success ? (
        <Alert severity="success" sx={{ mb: 2 }}>
          Template created successfully! Redirecting…
        </Alert>
      ) : null}

      {/* Template Name & Base Template */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 2 }}>
          <Grid2 container spacing={2} alignItems="center">
            <Grid2 size={{ xs: 12, sm: 5 }}>
              <TextField
                label="Template Name"
                size="small"
                fullWidth
                required
                placeholder="e.g., Standard Commercial"
                value={name}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 5 }}>
              <FormControl size="small" fullWidth>
                <InputLabel>Base Template (optional)</InputLabel>
                <Select
                  label="Base Template (optional)"
                  value={baseTemplate}
                  onChange={handleBaseTemplateChange}
                >
                  <MenuItem value="">
                    <em>Start from scratch</em>
                  </MenuItem>
                  {existingTemplates.map((t) => (
                    <MenuItem key={t.id} value={t.id}>
                      {t.name}
                      {t.isDefault ? ' (Default)' : ''}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    size="small"
                    checked={isDefault}
                    onChange={(_, checked) => setIsDefault(checked)}
                  />
                }
                label={
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Default
                  </Typography>
                }
              />
            </Grid2>
          </Grid2>
          {/* Description */}
          <TextField
            label="Description"
            size="small"
            fullWidth
            multiline
            rows={2}
            placeholder="Brief description of when to use this template"
            value={description}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
            sx={{ mt: 2 }}
          />
        </CardContent>
      </Card>

      {/* Certificate Holder Information */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            Certificate Holder Information
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
            The exact text that must appear in the Certificate Holder section of the ACORD form
          </Typography>
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Certificate Holder Name"
                size="small"
                fullWidth
                placeholder="AOE Property Management LLC"
                value={certHolderName}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setCertHolderName(e.target.value)}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Address"
                size="small"
                fullWidth
                placeholder="600 N. Broad Street, Suite 200, Philadelphia, PA 19130"
                value={certHolderAddress}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setCertHolderAddress(e.target.value)
                }
              />
            </Grid2>
          </Grid2>
        </CardContent>
      </Card>

      {/* ACORD 25 Policy Sections */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <PolicyAccordion
          policyType="general_liability"
          label="Commercial General Liability"
          state={policySections.general_liability}
          limits={CGL_LIMITS}
          showAdditionalInsured
          showWaiverOfSubrogation
          showClaimsOccur
          defaultExpanded
          onToggle={handlePolicyToggle}
          onRequiredChange={handlePolicyRequired}
          onLimitChange={handleLimitChange}
        />

        <PolicyAccordion
          policyType="auto_liability"
          label="Automobile Liability"
          state={policySections.auto_liability}
          limits={AUTO_LIMITS}
          showAdditionalInsured
          showWaiverOfSubrogation
          showAutoTypes
          onToggle={handlePolicyToggle}
          onRequiredChange={handlePolicyRequired}
          onLimitChange={handleLimitChange}
        />

        <PolicyAccordion
          policyType="umbrella"
          label="Umbrella / Excess Liability"
          state={policySections.umbrella}
          limits={UMBRELLA_LIMITS}
          showUmbrellaType
          showDeductible
          onToggle={handlePolicyToggle}
          onRequiredChange={handlePolicyRequired}
          onLimitChange={handleLimitChange}
        />

        <PolicyAccordion
          policyType="workers_compensation"
          label="Workers' Compensation and Employers' Liability"
          state={policySections.workers_compensation}
          limits={WC_LIMITS}
          showPerStatute
          showWaiverOfSubrogation
          onToggle={handlePolicyToggle}
          onRequiredChange={handlePolicyRequired}
          onLimitChange={handleLimitChange}
        />

        <PolicyAccordion
          policyType="errors_omissions"
          label="E&O / Cyber / Media Liability"
          state={policySections.errors_omissions}
          limits={[{ key: 'Each Occurrence / Aggregate', label: 'Each Occurrence / Aggregate' }]}
          onToggle={handlePolicyToggle}
          onRequiredChange={handlePolicyRequired}
          onLimitChange={handleLimitChange}
        />

        <PolicyAccordion
          policyType="cyber_liability"
          label="3rd Party Crime"
          state={policySections.cyber_liability}
          limits={[{ key: 'Limit', label: 'Limit' }]}
          onToggle={handlePolicyToggle}
          onRequiredChange={handlePolicyRequired}
          onLimitChange={handleLimitChange}
        />
      </Box>

      {/* Global endorsement toggles */}
      <Card sx={{ mt: 3 }}>
        <CardContent sx={{ p: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            Global Endorsement Requirements
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={additionalInsuredRequired}
                  onChange={(_, checked) => setAdditionalInsuredRequired(checked)}
                />
              }
              label={
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Additional Insured
                </Typography>
              }
            />
            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={waiverOfSubrogationRequired}
                  onChange={(_, checked) => setWaiverOfSubrogationRequired(checked)}
                />
              }
              label={
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Waiver of Subrogation
                </Typography>
              }
            />
            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={endorsementRequired}
                  onChange={(_, checked) => setEndorsementRequired(checked)}
                />
              }
              label={
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Endorsement Documents Required
                </Typography>
              }
            />
          </Box>
        </CardContent>
      </Card>

      {/* Description of Operations */}
      <Card sx={{ mt: 2 }}>
        <CardContent sx={{ p: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            Description of Operations / Locations / Vehicles
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
            Required verbiage that must appear in the Description section of the ACORD form
          </Typography>
          <TextField
            size="small"
            fullWidth
            multiline
            rows={3}
            placeholder="Certificate holder is added as an additional insured on all policies listed above."
            value={additionalVerbiage}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setAdditionalVerbiage(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Additional Required Documents */}
      <Card sx={{ mt: 2 }}>
        <CardContent sx={{ p: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 1,
            }}
          >
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Additional Required Documents
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Endorsement pages or supplementary documents required alongside the ACORD form
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ my: 1 }} />
          {DEFAULT_DOCUMENTS.map((doc) => (
            <Box
              key={doc}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                py: 1,
                borderBottom: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Checkbox
                  size="small"
                  checked={selectedDocuments.includes(doc)}
                  onChange={() => handleToggleDocument(doc)}
                />
                <Typography variant="body2">{doc}</Typography>
              </Box>
              <IconButton
                size="small"
                color="error"
                onClick={() => handleRemoveDocument(doc)}
                disabled={!selectedDocuments.includes(doc)}
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
          {/* Custom documents added by user */}
          {selectedDocuments
            .filter((d) => !DEFAULT_DOCUMENTS.includes(d as (typeof DEFAULT_DOCUMENTS)[number]))
            .map((doc) => (
              <Box
                key={doc}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  py: 1,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Checkbox size="small" checked />
                  <Typography variant="body2">{doc}</Typography>
                </Box>
                <IconButton size="small" color="error" onClick={() => handleRemoveDocument(doc)}>
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          {/* Add custom document */}
          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
            <TextField
              size="small"
              placeholder="Add custom document…"
              value={customDoc}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setCustomDoc(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddCustomDoc();
                }
              }}
              sx={{ flex: 1 }}
            />
            <Button
              variant="outlined"
              size="small"
              startIcon={<AddCircleOutlineIcon />}
              onClick={handleAddCustomDoc}
              disabled={!customDoc.trim()}
            >
              Add
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Actions */}
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Button
          variant="outlined"
          component={Link}
          href="/certificate-of-insurance/buildings/templates"
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          startIcon={<Save size={16} />}
          onClick={handleSubmit}
          disabled={!canSubmit || success}
        >
          Save Template
        </Button>
      </Box>

      <Snackbar
        open={snackbar}
        autoHideDuration={3000}
        onClose={() => setSnackbar(false)}
        message="Template saved successfully"
      />
    </Box>
  );
}
