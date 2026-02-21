'use client';

import { useState } from 'react';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
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
import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { PageShell } from '@shared/components';

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
    <Accordion defaultExpanded={defaultExpanded} sx={{ '&:before': { display: 'none' } }}>
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
          control={<Checkbox defaultChecked size="small" />}
          label=""
          onClick={(e) => e.stopPropagation()}
          sx={{ mr: 0 }}
        />
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        <Chip label="Required" size="small" color="primary" variant="outlined" />
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

          {/* Limit fields */}
          {limits.map((limit) => (
            <Grid2 key={limit.key} size={{ xs: 12, sm: 6, md: 4 }}>
              <TextField
                label={limit.label}
                size="small"
                fullWidth
                placeholder="1,000,000"
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
 *
 * TODO: Wire to templateService & settingsService once API is ready.
 */
export function COISettingsPage() {
  const [activeTab, setActiveTab] = useState(0);

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
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 5 }}>
                  <FormControl size="small" fullWidth>
                    <InputLabel>Base Template</InputLabel>
                    <Select label="Base Template" value="" displayEmpty>
                      <MenuItem value="">
                        <em>Corporate USA Best Practice — Default Template</em>
                      </MenuItem>
                      <MenuItem value="custom">Custom Template</MenuItem>
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
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Address"
                    size="small"
                    fullWidth
                    placeholder="14150 Huffmeister Road, Suite 200, Cypress, TX 77429"
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
              showAdditionalInsured
              showWaiverOfSubrogation
              showClaimsOccur
              defaultExpanded
            />

            <PolicySection
              title="Automobile Liability"
              limits={AUTO_LIMITS}
              showAdditionalInsured
              showWaiverOfSubrogation
              showAutoTypes
            />

            <PolicySection
              title="Umbrella / Excess Liability"
              limits={UMBRELLA_LIMITS}
              showUmbrellaType
              showDeductible
            />

            <PolicySection
              title="Workers' Compensation and Employers' Liability"
              limits={WC_LIMITS}
              showPerStatute
              showWaiverOfSubrogation
            />

            {/* Additional / custom policy types */}
            <Accordion sx={{ '&:before': { display: 'none' } }}>
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
                  control={<Checkbox size="small" />}
                  label=""
                  onClick={(e) => e.stopPropagation()}
                  sx={{ mr: 0 }}
                />
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  E&O / Cyber / Media Liability
                </Typography>
                <Chip label="Optional" size="small" variant="outlined" />
              </AccordionSummary>
              <AccordionDetails sx={{ pt: 3 }}>
                <Grid2 container spacing={2}>
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="Each Occurrence / Aggregate"
                      size="small"
                      fullWidth
                      placeholder="5,000,000"
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                    />
                  </Grid2>
                </Grid2>
              </AccordionDetails>
            </Accordion>

            <Accordion sx={{ '&:before': { display: 'none' } }}>
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
                  control={<Checkbox size="small" />}
                  label=""
                  onClick={(e) => e.stopPropagation()}
                  sx={{ mr: 0 }}
                />
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  3rd Party Crime
                </Typography>
                <Chip label="Optional" size="small" variant="outlined" />
              </AccordionSummary>
              <AccordionDetails sx={{ pt: 3 }}>
                <Grid2 container spacing={2}>
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="Limit"
                      size="small"
                      fullWidth
                      placeholder="5,000,000"
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                    />
                  </Grid2>
                </Grid2>
              </AccordionDetails>
            </Accordion>
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
                      <Checkbox size="small" defaultChecked />
                      <Typography variant="body2">{doc}</Typography>
                    </Box>
                    <IconButton size="small" color="error">
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ),
              )}
            </CardContent>
          </Card>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button variant="outlined">Cancel</Button>
            <Button variant="contained">Save Template</Button>
          </Box>
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
