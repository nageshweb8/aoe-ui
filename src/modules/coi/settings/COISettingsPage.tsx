'use client';

import { type ChangeEvent, useCallback, useMemo, useState } from 'react';

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
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { PageShell } from '@shared/components';

import type {
  PolicyRequirement,
  PolicyType,
  TemplateFormValues,
} from '../buildings/template.types';
import { addTemplate, updateTemplate, useTemplates } from '../buildings/useBuildingStore';

/* ------------------------------------------------------------------ */
/*  ACORD 25 limit labels — mirrors the standard form fields          */
/* ------------------------------------------------------------------ */

const CGL_LIMITS = [
  { key: 'eachOccurrence', label: 'Each Occurrence' },
  { key: 'damageToRentedPremises', label: 'Damage to Rented Premises (Ea occurrence)' },
  { key: 'medExp', label: 'Med Exp (Any one person)' },
  { key: 'personalAdvInjury', label: 'Personal & Adv Injury' },
  { key: 'generalAggregate', label: 'General Aggregate' },
  { key: 'productsCompOpAgg', label: 'Products - Comp/Op Agg' },
] as const;

const AUTO_LIMITS = [
  { key: 'combinedSingleLimit', label: 'Combined Single Limit (Ea accident)' },
  { key: 'bodilyInjuryPerPerson', label: 'Bodily Injury (Per person)' },
  { key: 'bodilyInjuryPerAccident', label: 'Bodily Injury (Per accident)' },
  { key: 'propertyDamage', label: 'Property Damage (Per accident)' },
] as const;

const UMBRELLA_LIMITS = [
  { key: 'eachOccurrence', label: 'Each Occurrence' },
  { key: 'aggregate', label: 'Aggregate' },
] as const;

const WC_LIMITS = [
  { key: 'elEachAccident', label: 'E.L. Each Accident' },
  { key: 'elDiseaseEaEmployee', label: 'E.L. Disease - Ea Employee' },
  { key: 'elDiseasePolicyLimit', label: 'E.L. Disease - Policy Limit' },
] as const;

/* ------------------------------------------------------------------ */
/*  PolicySection — Reusable collapsible policy requirement section   */
/* ------------------------------------------------------------------ */

interface LimitField {
  readonly key: string;
  readonly label: string;
}

interface PolicySectionProps {
  readonly title: string;
  readonly limits: readonly LimitField[];
  readonly enabled: boolean;
  readonly required: boolean;
  readonly limitValues: Record<string, string>;
  readonly onToggle: (enabled: boolean) => void;
  readonly onRequiredChange: (required: boolean) => void;
  readonly onLimitChange: (key: string, value: string) => void;
  readonly showAdditionalInsured?: boolean;
  readonly showWaiverOfSubrogation?: boolean;
  readonly showClaimsOccur?: boolean;
  readonly showAutoTypes?: boolean;
  readonly showUmbrellaType?: boolean;
  readonly showPerStatute?: boolean;
  readonly showDeductible?: boolean;
  readonly defaultExpanded?: boolean;
}

function PolicySection({
  title,
  limits,
  enabled,
  required: isRequired,
  limitValues,
  onToggle,
  onRequiredChange,
  onLimitChange,
  showAdditionalInsured = false,
  showWaiverOfSubrogation = false,
  showClaimsOccur = false,
  showAutoTypes = false,
  showUmbrellaType = false,
  showPerStatute = false,
  showDeductible = false,
  defaultExpanded = false,
}: PolicySectionProps) {
  return (
    <Accordion
      defaultExpanded={defaultExpanded}
      sx={{ '&:before': { display: 'none' }, opacity: enabled ? 1 : 0.6 }}
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
            <Checkbox checked={enabled} size="small" onChange={(_, checked) => onToggle(checked)} />
          }
          label=""
          onClick={(e) => e.stopPropagation()}
          sx={{ mr: 0 }}
        />
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        <Chip
          label={isRequired ? 'Required' : 'Optional'}
          size="small"
          color={isRequired ? 'primary' : 'default'}
          variant="outlined"
          onClick={(e) => {
            e.stopPropagation();
            if (enabled) {
              onRequiredChange(!isRequired);
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
                <FormControlLabel
                  control={<Switch size="small" defaultChecked />}
                  label={
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Umbrella Liab
                    </Typography>
                  }
                />
                <FormControlLabel
                  control={<Switch size="small" />}
                  label={
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Excess Liab
                    </Typography>
                  }
                />
                <FormControlLabel
                  control={<Switch size="small" />}
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
                value={limitValues[limit.key] ?? ''}
                onChange={(e) => onLimitChange(limit.key, e.target.value)}
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
/*  Policy sections state type                                        */
/* ------------------------------------------------------------------ */

interface PolicySectionState {
  readonly enabled: boolean;
  readonly required: boolean;
  readonly limits: Record<string, string>;
}

type PolicySectionsMap = Record<string, PolicySectionState>;

const DEFAULT_POLICY_SECTIONS: PolicySectionsMap = {
  general_liability: {
    enabled: true,
    required: true,
    limits: {
      eachOccurrence: '1,000,000',
      generalAggregate: '2,000,000',
      productsCompOpAgg: '2,000,000',
      personalAdvInjury: '1,000,000',
    },
  },
  auto_liability: {
    enabled: true,
    required: true,
    limits: { combinedSingleLimit: '1,000,000' },
  },
  umbrella: {
    enabled: true,
    required: true,
    limits: { eachOccurrence: '5,000,000', aggregate: '5,000,000' },
  },
  workers_compensation: {
    enabled: true,
    required: true,
    limits: {
      elEachAccident: '500,000',
      elDiseaseEaEmployee: '500,000',
      elDiseasePolicyLimit: '500,000',
    },
  },
  errors_omissions: { enabled: false, required: false, limits: {} },
  cyber_liability: { enabled: false, required: false, limits: {} },
};

/** Default endorsement documents used by the Settings template editor */
const SETTINGS_DEFAULT_DOCUMENTS = [
  'Additional Insured Endorsement',
  'Waiver of Subrogation Endorsement',
] as const;

/* ------------------------------------------------------------------ */
/*  Main COI Settings Page                                            */
/* ------------------------------------------------------------------ */

/**
 * COI Settings Page — Redesigned to mirror ACORD 25 Certificate of
 * Liability Insurance form structure.
 *
 * Tab 1: Requirement Template — ACORD-based policy requirements with
 *        per-policy-type limits, additional insured, waiver toggles.
 * Tab 2: Certificate Holder — Default holder name & address.
 * Tab 3: Notifications & Email — Event-based notification settings.
 * Tab 4: AI & General — Verification thresholds and preferences.
 */
export function COISettingsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const allTemplates = useTemplates();

  // ── Tab 0 form state ────────────────────────────────────────────
  const [editingTemplateId, setEditingTemplateId] = useState('');
  const [templateName, setTemplateName] = useState('');
  const [baseTemplate, setBaseTemplate] = useState('');
  const [certHolderName, setCertHolderName] = useState('');
  const [certHolderAddress, setCertHolderAddress] = useState('');
  const [policySections, setPolicySections] = useState<PolicySectionsMap>(() => ({
    ...DEFAULT_POLICY_SECTIONS,
  }));
  const [additionalVerbiage, setAdditionalVerbiage] = useState('');
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([
    ...SETTINGS_DEFAULT_DOCUMENTS,
  ]);
  const [additionalInsuredRequired, setAdditionalInsuredRequired] = useState(true);
  const [waiverOfSubrogationRequired, setWaiverOfSubrogationRequired] = useState(true);
  const [endorsementRequired, setEndorsementRequired] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [snackbar, setSnackbar] = useState(false);

  // ── Derived ─────────────────────────────────────────────────────
  const canSave = useMemo(() => {
    const hasName = templateName.trim().length > 0;
    const hasPolicy = Object.values(policySections).some((s) => s.enabled);
    return hasName && hasPolicy;
  }, [templateName, policySections]);

  // ── Policy section handlers ─────────────────────────────────────
  const handlePolicyToggle = useCallback((key: string, enabled: boolean) => {
    setPolicySections((prev) => {
      const existing = prev[key] ?? { enabled: false, required: false, limits: {} };
      return {
        ...prev,
        [key]: { ...existing, enabled, required: enabled ? existing.required : false },
      };
    });
  }, []);

  const handlePolicyRequired = useCallback((key: string, required: boolean) => {
    setPolicySections((prev) => {
      const existing = prev[key] ?? { enabled: false, required: false, limits: {} };
      return { ...prev, [key]: { ...existing, required } };
    });
  }, []);

  const handleLimitChange = useCallback((sectionKey: string, limitKey: string, value: string) => {
    setPolicySections((prev) => {
      const existing = prev[sectionKey] ?? { enabled: false, required: false, limits: {} };
      return {
        ...prev,
        [sectionKey]: {
          ...existing,
          limits: { ...existing.limits, [limitKey]: value },
        },
      };
    });
  }, []);

  // ── Document handlers ───────────────────────────────────────────
  const handleToggleDocument = useCallback((doc: string) => {
    setSelectedDocuments((prev) =>
      prev.includes(doc) ? prev.filter((d) => d !== doc) : [...prev, doc],
    );
  }, []);

  // ── Load existing template ──────────────────────────────────────
  const handleBaseTemplateChange = useCallback(
    (e: SelectChangeEvent) => {
      const templateId = e.target.value;
      setBaseTemplate(templateId);

      if (!templateId) {
        setEditingTemplateId('');
        setTemplateName('');
        setCertHolderName('');
        setCertHolderAddress('');
        setAdditionalVerbiage('');
        setPolicySections({ ...DEFAULT_POLICY_SECTIONS });
        setSelectedDocuments([...SETTINGS_DEFAULT_DOCUMENTS]);
        return;
      }

      const tmpl = allTemplates.find((t) => t.id === templateId);
      if (!tmpl) {
        return;
      }

      setEditingTemplateId(tmpl.id);
      setTemplateName(tmpl.name);
      setCertHolderName(tmpl.certificateHolder?.name ?? '');
      setCertHolderAddress(tmpl.certificateHolder?.address ?? '');
      setAdditionalVerbiage(tmpl.additionalVerbiage ?? '');
      setAdditionalInsuredRequired(tmpl.additionalInsuredRequired);
      setWaiverOfSubrogationRequired(tmpl.waiverOfSubrogationRequired);
      setEndorsementRequired(tmpl.endorsementRequired);
      setSelectedDocuments(tmpl.additionalDocuments ? [...tmpl.additionalDocuments] : []);

      // Build policy sections from template requirements
      const sections: PolicySectionsMap = {};
      for (const key of Object.keys(DEFAULT_POLICY_SECTIONS)) {
        const existing = tmpl.policyRequirements.find((pr) => pr.policyType === key);
        if (existing) {
          const cleaned: Record<string, string> = {};
          if (existing.minimumLimits) {
            for (const [k, v] of Object.entries(existing.minimumLimits)) {
              // Map limit label keys to field keys for CGL/Auto/etc
              cleaned[k] = v.replace(/^\$/, '');
            }
          }
          sections[key] = { enabled: true, required: existing.required, limits: cleaned };
        } else {
          sections[key] = { enabled: false, required: false, limits: {} };
        }
      }
      setPolicySections(sections);
    },
    [allTemplates],
  );

  // ── Save Template handler ──────────────────────────────────────
  const handleSaveTemplate = useCallback(() => {
    // Build policy requirements
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
      name: templateName.trim(),
      description: '',
      isDefault: false,
      policyRequirements,
      additionalInsuredRequired,
      waiverOfSubrogationRequired,
      endorsementRequired,
      additionalVerbiage: additionalVerbiage.trim(),
      certificateHolderName: certHolderName.trim(),
      certificateHolderAddress: certHolderAddress.trim(),
      additionalDocuments: selectedDocuments,
    };

    if (editingTemplateId) {
      updateTemplate(editingTemplateId, formValues);
    } else {
      addTemplate(formValues);
    }

    setSaveSuccess(true);
    setSnackbar(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  }, [
    templateName,
    policySections,
    additionalInsuredRequired,
    waiverOfSubrogationRequired,
    endorsementRequired,
    additionalVerbiage,
    certHolderName,
    certHolderAddress,
    selectedDocuments,
    editingTemplateId,
  ]);

  return (
    <Box>
      <PageShell
        title="COI Settings"
        description="Configure ACORD-based insurance requirements, certificate holder, and verification settings"
      />

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 2, mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_, v: number) => setActiveTab(v)}
          aria-label="COI Settings tabs"
        >
          <Tab label="Requirement Template" />
          <Tab label="Certificate Holder" />
          <Tab label="Notifications" />
          <Tab label="AI & General" />
        </Tabs>
      </Box>

      {/* ── Tab 0: Requirement Template ────────────────────────── */}
      {activeTab === 0 && (
        <Box>
          {saveSuccess ? (
            <Alert severity="success" sx={{ mb: 2 }}>
              Template {editingTemplateId ? 'updated' : 'saved'} successfully!
            </Alert>
          ) : null}

          {/* Template selector */}
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 2 }}>
              <Grid2 container spacing={2} alignItems="center">
                <Grid2 size={{ xs: 12, sm: 5 }}>
                  <TextField
                    label="Template Name"
                    size="small"
                    fullWidth
                    placeholder="Default Requirements"
                    value={templateName}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setTemplateName(e.target.value)}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 5 }}>
                  <FormControl size="small" fullWidth>
                    <InputLabel>Load Existing Template</InputLabel>
                    <Select
                      label="Load Existing Template"
                      value={baseTemplate}
                      onChange={handleBaseTemplateChange}
                    >
                      <MenuItem value="">
                        <em>New Template</em>
                      </MenuItem>
                      {allTemplates.map((t) => (
                        <MenuItem key={t.id} value={t.id}>
                          {t.name}
                          {t.isDefault ? ' (Default)' : ''}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 2 }}>
                  <Tooltip title="Add a new custom policy type">
                    <Button
                      variant="outlined"
                      size="small"
                      fullWidth
                      startIcon={<AddCircleOutlineIcon />}
                    >
                      Add Policy
                    </Button>
                  </Tooltip>
                </Grid2>
              </Grid2>
            </CardContent>
          </Card>

          {/* Certificate Holder Info (inline, matches ACORD form bottom) */}
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
                    placeholder="QSource Group Inc"
                    value={certHolderName}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setCertHolderName(e.target.value)
                    }
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Address"
                    size="small"
                    fullWidth
                    placeholder="14150 Huffmeister Road, Suite 200, Cypress, TX 77429"
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
            <PolicySection
              title="Commercial General Liability"
              limits={CGL_LIMITS}
              enabled={policySections['general_liability']?.enabled ?? false}
              required={policySections['general_liability']?.required ?? false}
              limitValues={policySections['general_liability']?.limits ?? {}}
              onToggle={(v) => handlePolicyToggle('general_liability', v)}
              onRequiredChange={(v) => handlePolicyRequired('general_liability', v)}
              onLimitChange={(k, v) => handleLimitChange('general_liability', k, v)}
              showAdditionalInsured
              showWaiverOfSubrogation
              showClaimsOccur
              defaultExpanded
            />

            <PolicySection
              title="Automobile Liability"
              limits={AUTO_LIMITS}
              enabled={policySections['auto_liability']?.enabled ?? false}
              required={policySections['auto_liability']?.required ?? false}
              limitValues={policySections['auto_liability']?.limits ?? {}}
              onToggle={(v) => handlePolicyToggle('auto_liability', v)}
              onRequiredChange={(v) => handlePolicyRequired('auto_liability', v)}
              onLimitChange={(k, v) => handleLimitChange('auto_liability', k, v)}
              showAdditionalInsured
              showWaiverOfSubrogation
              showAutoTypes
            />

            <PolicySection
              title="Umbrella / Excess Liability"
              limits={UMBRELLA_LIMITS}
              enabled={policySections['umbrella']?.enabled ?? false}
              required={policySections['umbrella']?.required ?? false}
              limitValues={policySections['umbrella']?.limits ?? {}}
              onToggle={(v) => handlePolicyToggle('umbrella', v)}
              onRequiredChange={(v) => handlePolicyRequired('umbrella', v)}
              onLimitChange={(k, v) => handleLimitChange('umbrella', k, v)}
              showUmbrellaType
              showDeductible
            />

            <PolicySection
              title="Workers' Compensation and Employers' Liability"
              limits={WC_LIMITS}
              enabled={policySections['workers_compensation']?.enabled ?? false}
              required={policySections['workers_compensation']?.required ?? false}
              limitValues={policySections['workers_compensation']?.limits ?? {}}
              onToggle={(v) => handlePolicyToggle('workers_compensation', v)}
              onRequiredChange={(v) => handlePolicyRequired('workers_compensation', v)}
              onLimitChange={(k, v) => handleLimitChange('workers_compensation', k, v)}
              showPerStatute
              showWaiverOfSubrogation
            />

            {/* Additional / custom policy types */}
            <PolicySection
              title="E&O / Cyber / Media Liability"
              limits={[
                {
                  key: 'eachOccurrenceAggregate',
                  label: 'Each Occurrence / Aggregate',
                },
              ]}
              enabled={policySections['errors_omissions']?.enabled ?? false}
              required={policySections['errors_omissions']?.required ?? false}
              limitValues={policySections['errors_omissions']?.limits ?? {}}
              onToggle={(v) => handlePolicyToggle('errors_omissions', v)}
              onRequiredChange={(v) => handlePolicyRequired('errors_omissions', v)}
              onLimitChange={(k, v) => handleLimitChange('errors_omissions', k, v)}
            />

            <PolicySection
              title="3rd Party Crime"
              limits={[{ key: 'limit', label: 'Limit' }]}
              enabled={policySections['cyber_liability']?.enabled ?? false}
              required={policySections['cyber_liability']?.required ?? false}
              limitValues={policySections['cyber_liability']?.limits ?? {}}
              onToggle={(v) => handlePolicyToggle('cyber_liability', v)}
              onRequiredChange={(v) => handlePolicyRequired('cyber_liability', v)}
              onLimitChange={(k, v) => handleLimitChange('cyber_liability', k, v)}
            />
          </Box>

          {/* Description of Operations */}
          <Card sx={{ mt: 3 }}>
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
                placeholder="Certificate holder is added as an additional insured."
                value={additionalVerbiage}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setAdditionalVerbiage(e.target.value)
                }
              />
            </CardContent>
          </Card>

          {/* Additional Documents */}
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
                <Button variant="outlined" size="small" startIcon={<AddCircleOutlineIcon />}>
                  Add Document
                </Button>
              </Box>
              <Divider sx={{ my: 1 }} />
              {['Additional Insured Endorsement', 'Waiver of Subrogation Endorsement'].map(
                (doc) => (
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
                      onClick={() => setSelectedDocuments((prev) => prev.filter((d) => d !== doc))}
                      disabled={!selectedDocuments.includes(doc)}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ),
              )}
            </CardContent>
          </Card>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button
              variant="outlined"
              onClick={() => {
                setTemplateName('');
                setBaseTemplate('');
                setEditingTemplateId('');
                setCertHolderName('');
                setCertHolderAddress('');
                setAdditionalVerbiage('');
                setPolicySections({ ...DEFAULT_POLICY_SECTIONS });
                setSelectedDocuments([...SETTINGS_DEFAULT_DOCUMENTS]);
              }}
            >
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSaveTemplate} disabled={!canSave}>
              {editingTemplateId ? 'Update Template' : 'Save Template'}
            </Button>
          </Box>

          <Snackbar
            open={snackbar}
            autoHideDuration={3000}
            onClose={() => setSnackbar(false)}
            message={`Template ${editingTemplateId ? 'updated' : 'saved'} successfully`}
          />
        </Box>
      )}

      {/* ── Tab 1: Certificate Holder ──────────────────────────── */}
      {activeTab === 1 && (
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              Default Certificate Holder
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              This information will be pre-filled on requirement templates and verified on incoming
              COI documents.
            </Typography>

            <Grid2 container spacing={2}>
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Company Name"
                  size="small"
                  fullWidth
                  placeholder="QSource Group Inc"
                />
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Street Address"
                  size="small"
                  fullWidth
                  placeholder="14150 Huffmeister Road, Suite 200"
                />
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 4 }}>
                <TextField label="City" size="small" fullWidth placeholder="Cypress" />
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 4 }}>
                <TextField label="State" size="small" fullWidth placeholder="TX" />
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 4 }}>
                <TextField label="ZIP Code" size="small" fullWidth placeholder="77429" />
              </Grid2>
            </Grid2>

            <Divider sx={{ my: 3 }} />

            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Cancellation Notice
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
              Standard language required in the cancellation section of the ACORD form
            </Typography>
            <TextField
              size="small"
              fullWidth
              multiline
              rows={3}
              defaultValue="SHOULD ANY OF THE ABOVE DESCRIBED POLICIES BE CANCELLED BEFORE THE EXPIRATION DATE THEREOF, NOTICE WILL BE DELIVERED IN ACCORDANCE WITH THE POLICY PROVISIONS."
            />

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="contained">Save Certificate Holder</Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* ── Tab 2: Notifications ───────────────────────────────── */}
      {activeTab === 2 && (
        <Grid2 container spacing={3}>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Email Templates
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Customize email templates sent to vendors and agents.
                </Typography>

                {['COI Request', 'Expiry Reminder', 'Rejection Notice'].map((template) => (
                  <Box key={template} sx={{ mb: 2 }}>
                    <TextField
                      label={`${template} Subject`}
                      size="small"
                      fullWidth
                      placeholder={`Default ${template.toLowerCase()} subject line`}
                      sx={{ mb: 1 }}
                    />
                    <TextField
                      label={`${template} Body`}
                      size="small"
                      fullWidth
                      multiline
                      rows={3}
                      placeholder={`Default ${template.toLowerCase()} email body`}
                    />
                    {template !== 'Rejection Notice' && <Divider sx={{ mt: 2 }} />}
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid2>

          <Grid2 size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Expiry Reminder Schedule
                </Typography>
                <TextField
                  label="Days before expiry"
                  size="small"
                  fullWidth
                  placeholder="30, 60, 90"
                  helperText="Comma-separated days before policy expiry to send reminders"
                />
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  Event Notifications
                </Typography>
                {[
                  { label: 'COI Uploaded', desc: 'When a new COI is uploaded' },
                  { label: 'COI Approved', desc: 'When a COI is approved' },
                  { label: 'COI Rejected', desc: 'When a COI is rejected' },
                  { label: 'Non-Compliance Detected', desc: 'When compliance issues are found' },
                  { label: 'Override Applied', desc: 'When a manual override is used' },
                ].map((event) => (
                  <FormControlLabel
                    key={event.label}
                    control={<Switch size="small" />}
                    label={
                      <Box>
                        <Typography variant="body2">{event.label}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {event.desc}
                        </Typography>
                      </Box>
                    }
                    sx={{ display: 'flex', mb: 1 }}
                  />
                ))}
              </CardContent>
            </Card>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="contained">Save Notifications</Button>
            </Box>
          </Grid2>
        </Grid2>
      )}

      {/* ── Tab 3: AI & General ────────────────────────────────── */}
      {activeTab === 3 && (
        <Grid2 container spacing={3}>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  AI Verification
                </Typography>
                <TextField
                  label="Auto-approve confidence threshold (%)"
                  size="small"
                  type="number"
                  fullWidth
                  placeholder="95"
                  helperText="COIs with AI confidence above this threshold are auto-approved"
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Minimum acceptable confidence (%)"
                  size="small"
                  type="number"
                  fullWidth
                  placeholder="70"
                  helperText="COIs below this threshold are auto-rejected and flagged for manual review"
                />
              </CardContent>
            </Card>
          </Grid2>

          <Grid2 size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  General Preferences
                </Typography>
                <TextField
                  label="Expiry grace period (days)"
                  size="small"
                  type="number"
                  fullWidth
                  placeholder="30"
                  helperText="Days before expiry to flag as 'Expiring Soon'"
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Default report date range (days)"
                  size="small"
                  type="number"
                  fullWidth
                  placeholder="90"
                  helperText="Default lookback period for reports and dashboard widgets"
                  sx={{ mb: 2 }}
                />
                <FormControlLabel
                  control={<Switch size="small" />}
                  label={
                    <Box>
                      <Typography variant="body2">Vendor Portal</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Enable loginless vendor portal for direct COI submissions
                      </Typography>
                    </Box>
                  }
                  sx={{ display: 'flex' }}
                />
              </CardContent>
            </Card>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="contained">Save Preferences</Button>
            </Box>
          </Grid2>
        </Grid2>
      )}
    </Box>
  );
}
