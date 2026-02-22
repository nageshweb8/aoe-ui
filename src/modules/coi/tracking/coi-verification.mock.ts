import type { COITemplate } from '../buildings/template.types';
import type { PolicyType } from '../buildings/template.types';
import { POLICY_TYPE_LABELS } from '../buildings/template.types';
import type { COIVerificationResponse } from '../shared/types/coi.types';
import type { ComplianceLineItem } from '../shared/types/document.types';

/**
 * Mock COI verification service.
 *
 * Simulates AI-powered COI document analysis with a realistic delay.
 * Returns a deterministic mock response based on the file name.
 * Replace with real `verifyCOIDocument()` call when backend is ready.
 */

// ── Mock verification responses ─────────────────────────────────────

const MOCK_VERIFIED_RESPONSE: COIVerificationResponse = {
  id: `ver-${String(Date.now()).slice(-6)}`,
  certificateNumber: 'CERT-2026-0042',
  certificateDate: '2026-01-15',
  producer: {
    name: 'Apex Insurance Group',
    address: '4500 Main Street, Suite 800\nDallas, TX 75201',
    phone: '(972) 555-0188',
    email: 'service@apexinsurance.com',
  },
  insured: {
    name: 'Vendor Company',
    address: '1250 Industrial Blvd\nDallas, TX 75201',
  },
  certificateHolder: {
    name: 'AOE Property Management LLC',
    address: '600 N. Broad Street, Suite 200\nPhiladelphia, PA 19130',
  },
  insurers: [
    { letter: 'A', name: 'Hartford Financial Services', naicNumber: '29459' },
    { letter: 'B', name: 'Travelers Indemnity Company', naicNumber: '25658' },
    { letter: 'C', name: 'Zurich American Insurance Co', naicNumber: '16535' },
  ],
  policies: [
    {
      typeOfInsurance: 'Commercial General Liability',
      policyNumber: 'CGL-2026-001',
      policyEffectiveDate: '2026-01-01',
      policyExpirationDate: '2027-01-01',
      insurerLetter: 'A',
      limits: {
        'Each Occurrence': '$1,000,000',
        'General Aggregate': '$2,000,000',
        'Products/Completed Ops Aggregate': '$2,000,000',
        'Personal & Advertising Injury': '$1,000,000',
        'Damage to Rented Premises': '$300,000',
        'Medical Expense': '$10,000',
      },
    },
    {
      typeOfInsurance: 'Automobile Liability',
      policyNumber: 'AUTO-2026-001',
      policyEffectiveDate: '2026-01-01',
      policyExpirationDate: '2027-01-01',
      insurerLetter: 'A',
      limits: {
        'Combined Single Limit': '$1,000,000',
      },
    },
    {
      typeOfInsurance: 'Workers Compensation',
      policyNumber: 'WC-2026-001',
      policyEffectiveDate: '2026-01-01',
      policyExpirationDate: '2027-01-01',
      insurerLetter: 'B',
      limits: {
        'Each Accident': '$500,000',
        'Disease — Each Employee': '$500,000',
        'Disease — Policy Limit': '$500,000',
      },
    },
    {
      typeOfInsurance: 'Umbrella / Excess Liability',
      policyNumber: 'UMB-2026-001',
      policyEffectiveDate: '2026-01-01',
      policyExpirationDate: '2027-01-01',
      insurerLetter: 'C',
      limits: {
        'Each Occurrence': '$5,000,000',
        Aggregate: '$5,000,000',
      },
    },
  ],
  status: 'verified',
  message:
    'Certificate successfully verified. All policies are active and within valid date ranges.',
};

const MOCK_PARTIAL_RESPONSE: COIVerificationResponse = {
  ...MOCK_VERIFIED_RESPONSE,
  id: `ver-${String(Date.now()).slice(-5)}`,
  status: 'partial',
  message: 'Certificate partially verified. Some coverage limits do not meet minimum requirements.',
  policies: [
    {
      typeOfInsurance: 'Commercial General Liability',
      policyNumber: 'CGL-2026-055',
      policyEffectiveDate: '2026-01-01',
      policyExpirationDate: '2027-01-01',
      insurerLetter: 'A',
      limits: {
        'Each Occurrence': '$1,000,000',
        'General Aggregate': '$2,000,000',
        'Products/Completed Ops Aggregate': '$2,000,000',
        'Personal & Advertising Injury': '$1,000,000',
        'Damage to Rented Premises': '$300,000',
        'Medical Expense': '$10,000',
      },
    },
    {
      typeOfInsurance: 'Automobile Liability',
      policyNumber: 'AUTO-2026-055',
      policyEffectiveDate: '2026-01-01',
      policyExpirationDate: '2027-01-01',
      insurerLetter: 'A',
      limits: {
        'Combined Single Limit': '$500,000',
      },
    },
    {
      typeOfInsurance: 'Workers Compensation',
      policyNumber: 'WC-2026-055',
      policyEffectiveDate: '2026-01-01',
      policyExpirationDate: '2027-01-01',
      insurerLetter: 'B',
      limits: {
        'Each Accident': '$500,000',
        'Disease — Each Employee': '$500,000',
        'Disease — Policy Limit': '$500,000',
      },
    },
  ],
};

// ── Template-aware compliance comparison ────────────────────────────

/** Keywords for matching extracted policy names to template policy types. */
const POLICY_KEYWORDS: Record<PolicyType, readonly string[]> = {
  general_liability: ['general', 'cgl'],
  auto_liability: ['auto', 'automobile'],
  workers_compensation: ['worker', 'comp'],
  umbrella: ['umbrella', 'excess'],
  professional_liability: ['professional'],
  errors_omissions: ['errors', 'omissions', 'e&o'],
  property: ['property'],
  cyber_liability: ['cyber'],
};

function matchesPolicyType(typeOfInsurance: string, policyType: PolicyType): boolean {
  const insurance = typeOfInsurance.toLowerCase();
  const keywords = POLICY_KEYWORDS[policyType];
  return keywords.some((kw) => insurance.includes(kw));
}

/** Normalize a limit name for fuzzy comparison. */
function normalizeLimitName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Find a matching limit value from extracted limits by fuzzy name match. */
function findMatchingLimit(
  limits: Record<string, string> | undefined,
  limitName: string,
): string | undefined {
  if (!limits) {
    return undefined;
  }
  // Exact match first
  if (limits[limitName] !== undefined) {
    return limits[limitName];
  }
  // Fuzzy match — compare normalized names and check significant word overlap
  const normalizedTarget = normalizeLimitName(limitName);
  const targetWords = normalizedTarget.split(' ').filter((w) => w.length > 2);

  for (const [key, value] of Object.entries(limits)) {
    const normalizedKey = normalizeLimitName(key);
    if (normalizedKey === normalizedTarget) {
      return value;
    }
    // Check if significant words overlap
    const keyWords = normalizedKey.split(' ').filter((w) => w.length > 2);
    const matchingWords = targetWords.filter((tw) =>
      keyWords.some((kw) => kw.includes(tw) || tw.includes(kw)),
    );
    if (matchingWords.length >= Math.max(1, Math.ceil(targetWords.length * 0.5))) {
      return value;
    }
  }
  return undefined;
}

/** Parse a dollar amount string like "$1,000,000" to a number. */
function parseDollarAmount(value: string): number | null {
  const cleaned = value.replace(/[$,\s]/g, '');
  const match = cleaned.match(/^(\d+)$/);
  if (match?.[1]) {
    return parseInt(match[1], 10);
  }
  return null;
}

/** Compare extracted limit against minimum required limit. */
function meetsLimit(actual: string, expected: string): boolean {
  const actualNum = parseDollarAmount(actual);
  const expectedNum = parseDollarAmount(expected);
  if (actualNum !== null && expectedNum !== null) {
    return actualNum >= expectedNum;
  }
  // Non-numeric comparison (e.g., "Full Value")
  return actual.toLowerCase().trim() === expected.toLowerCase().trim();
}

/**
 * Generate compliance results by comparing a verification response
 * against a building's requirement template.
 */
export function generateTemplateComplianceResults(
  verification: COIVerificationResponse,
  template: COITemplate,
): ComplianceLineItem[] {
  const results: ComplianceLineItem[] = [];

  // Compare each policy requirement in the template
  for (const req of template.policyRequirements) {
    if (!req.required) {
      continue;
    }

    const policyLabel = POLICY_TYPE_LABELS[req.policyType];

    // Find corresponding extracted policy
    const extracted = verification.policies.find((p) =>
      matchesPolicyType(p.typeOfInsurance, req.policyType),
    );

    if (!extracted) {
      // Policy not found in certificate
      if (req.minimumLimits) {
        for (const [limitName, expected] of Object.entries(req.minimumLimits)) {
          results.push({
            requirement: `${policyLabel} — ${limitName}`,
            expected,
            actual: 'Not Found',
            passed: false,
            confidence: 0.85,
          });
        }
      } else {
        results.push({
          requirement: policyLabel,
          expected: 'Required',
          actual: 'Not Found',
          passed: false,
          confidence: 0.85,
        });
      }
      continue;
    }

    // Compare each minimum limit
    if (req.minimumLimits) {
      for (const [limitName, expected] of Object.entries(req.minimumLimits)) {
        const actual = findMatchingLimit(extracted.limits, limitName) ?? 'Not Found';
        const passed = actual !== 'Not Found' && meetsLimit(actual, expected);
        results.push({
          requirement: `${policyLabel} — ${limitName}`,
          expected,
          actual,
          passed,
          confidence: passed ? 0.96 : 0.92,
        });
      }
    }
  }

  // Certificate holder match
  if (template.certificateHolder) {
    const extractedName = verification.certificateHolder?.name?.toLowerCase().trim() ?? '';
    const templateName = template.certificateHolder.name.toLowerCase().trim();
    const nameMatch = extractedName === templateName;
    results.push({
      requirement: 'Certificate Holder Name',
      expected: template.certificateHolder.name,
      actual: verification.certificateHolder?.name ?? 'Not Found',
      passed: nameMatch,
      confidence: 0.98,
    });
  }

  // Additional Insured endorsement
  if (template.additionalInsuredRequired) {
    results.push({
      requirement: 'Additional Insured Endorsement',
      expected: 'Required',
      actual: verification.status === 'verified' ? 'Present' : 'Missing',
      passed: verification.status === 'verified',
      confidence: 0.91,
    });
  }

  // Waiver of Subrogation
  if (template.waiverOfSubrogationRequired) {
    results.push({
      requirement: 'Waiver of Subrogation',
      expected: 'Required',
      actual: 'Present',
      passed: true,
      confidence: 0.9,
    });
  }

  return results;
}

// ── Compliance generation ──────────────────────────────────────────

function generateComplianceResults(response: COIVerificationResponse): ComplianceLineItem[] {
  const results: ComplianceLineItem[] = [];

  // Check General Liability
  const gl = response.policies.find((p) => p.typeOfInsurance.toLowerCase().includes('general'));
  if (gl) {
    const eachOcc = gl.limits?.['Each Occurrence'] ?? 'Not Found';
    results.push({
      requirement: 'General Liability — Each Occurrence',
      expected: '$1,000,000',
      actual: eachOcc,
      passed: eachOcc === '$1,000,000',
      confidence: 0.97,
    });
    const genAgg = gl.limits?.['General Aggregate'] ?? 'Not Found';
    results.push({
      requirement: 'General Liability — General Aggregate',
      expected: '$2,000,000',
      actual: genAgg,
      passed: genAgg === '$2,000,000',
      confidence: 0.96,
    });
  } else {
    results.push({
      requirement: 'General Liability — Each Occurrence',
      expected: '$1,000,000',
      actual: 'Not Found',
      passed: false,
      confidence: 0.9,
    });
  }

  // Check Auto Liability
  const auto = response.policies.find((p) => p.typeOfInsurance.toLowerCase().includes('auto'));
  if (auto) {
    const csl = auto.limits?.['Combined Single Limit'] ?? 'Not Found';
    results.push({
      requirement: 'Auto Liability — Combined Single Limit',
      expected: '$1,000,000',
      actual: csl,
      passed: csl === '$1,000,000',
      confidence: 0.95,
    });
  } else {
    results.push({
      requirement: 'Auto Liability — Combined Single Limit',
      expected: '$1,000,000',
      actual: 'Not Found',
      passed: false,
      confidence: 0.88,
    });
  }

  // Check Workers Comp
  const wc = response.policies.find((p) => p.typeOfInsurance.toLowerCase().includes('worker'));
  if (wc) {
    const eachAcc = wc.limits?.['Each Accident'] ?? 'Not Found';
    results.push({
      requirement: 'Workers Compensation — Each Accident',
      expected: '$500,000',
      actual: eachAcc,
      passed: eachAcc === '$500,000',
      confidence: 0.98,
    });
  } else {
    results.push({
      requirement: 'Workers Compensation — Each Accident',
      expected: '$500,000',
      actual: 'Not Found',
      passed: false,
      confidence: 0.87,
    });
  }

  // Check Umbrella
  const umb = response.policies.find((p) => p.typeOfInsurance.toLowerCase().includes('umbrella'));
  if (umb) {
    const eachOcc = umb.limits?.['Each Occurrence'] ?? 'Not Found';
    results.push({
      requirement: 'Umbrella — Each Occurrence',
      expected: '$5,000,000',
      actual: eachOcc,
      passed: eachOcc === '$5,000,000',
      confidence: 0.94,
    });
  } else {
    results.push({
      requirement: 'Umbrella — Each Occurrence',
      expected: '$5,000,000',
      actual: 'Not Found',
      passed: false,
      confidence: 0.86,
    });
  }

  // Endorsements
  results.push({
    requirement: 'Additional Insured Endorsement',
    expected: 'Required',
    actual: response.status === 'verified' ? 'Present' : 'Missing',
    passed: response.status === 'verified',
    confidence: 0.91,
  });

  results.push({
    requirement: 'Waiver of Subrogation',
    expected: 'Required',
    actual: 'Present',
    passed: true,
    confidence: 0.9,
  });

  return results;
}

/** Find the earliest expiration date from policies. */
function findEarliestExpiration(response: COIVerificationResponse): string {
  if (response.policies.length === 0) {
    return new Date().toISOString().split('T')[0] ?? '';
  }
  const dates = response.policies.map((p) => p.policyExpirationDate);
  dates.sort();
  return dates[0] ?? '';
}

// ── Public API ──────────────────────────────────────────────────────

/** Simulated verification delay (ms). */
const MOCK_DELAY_MS = 2500;

export interface MockVerificationResult {
  readonly verification: COIVerificationResponse;
  readonly complianceResults: ComplianceLineItem[];
  readonly earliestExpiration: string;
}

/**
 * Simulate AI verification of a COI document.
 * Returns a mock response after a realistic delay.
 *
 * @param _file - The file being "uploaded" (not actually processed in mock)
 * @param vendorName - Vendor name for populating the response
 */
export async function mockVerifyCOIDocument(
  _file: File,
  vendorName: string,
): Promise<MockVerificationResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Alternate between verified and partial based on file name length
      const isFullCompliance = _file.name.length % 2 === 0;
      const base = isFullCompliance ? MOCK_VERIFIED_RESPONSE : MOCK_PARTIAL_RESPONSE;

      const verification: COIVerificationResponse = {
        ...base,
        id: `ver-${String(Date.now()).slice(-6)}`,
        insured: {
          ...base.insured,
          name: vendorName,
        },
      };

      const complianceResults = generateComplianceResults(verification);
      const earliestExpiration = findEarliestExpiration(verification);

      resolve({ verification, complianceResults, earliestExpiration });
    }, MOCK_DELAY_MS);
  });
}
