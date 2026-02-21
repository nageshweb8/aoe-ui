/**
 * COI Requirements Template — Type definitions
 */

/** Policy type that can be required in a template */
export type PolicyType =
  | 'general_liability'
  | 'auto_liability'
  | 'workers_compensation'
  | 'umbrella'
  | 'professional_liability'
  | 'errors_omissions'
  | 'property'
  | 'cyber_liability';

/** Human-readable labels for policy types */
export const POLICY_TYPE_LABELS: Record<PolicyType, string> = {
  general_liability: 'Commercial General Liability',
  auto_liability: 'Automobile Liability',
  workers_compensation: "Workers' Compensation",
  umbrella: 'Umbrella / Excess Liability',
  professional_liability: 'Professional Liability',
  errors_omissions: 'Errors & Omissions',
  property: 'Property Insurance',
  cyber_liability: 'Cyber Liability',
} as const;

/** Single policy requirement within a template */
export interface PolicyRequirement {
  readonly policyType: PolicyType;
  readonly required: boolean;
  /** Minimum coverage limits as key-value (e.g., "Each Occurrence" → "$1,000,000") */
  readonly minimumLimits?: Record<string, string>;
}

/** COI requirements template */
export interface COITemplate {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  /** Whether this is the default template for new buildings */
  readonly isDefault: boolean;
  readonly policyRequirements: readonly PolicyRequirement[];
  /** Additional Insured endorsement required */
  readonly additionalInsuredRequired: boolean;
  /** Waiver of Subrogation required */
  readonly waiverOfSubrogationRequired: boolean;
  /** Endorsement documents required */
  readonly endorsementRequired: boolean;
  /** Additional verbiage that must appear on the COI */
  readonly additionalVerbiage?: string;
  /** Certificate holder information (exact match expected) */
  readonly certificateHolder?: {
    readonly name: string;
    readonly address: string;
  };
  readonly buildingIds: readonly string[];
  readonly createdAt: string;
  readonly updatedAt: string;
}

/** Form values for creating / editing a template */
export interface TemplateFormValues {
  name: string;
  description: string;
  isDefault: boolean;
  policyRequirements: PolicyRequirement[];
  additionalInsuredRequired: boolean;
  waiverOfSubrogationRequired: boolean;
  endorsementRequired: boolean;
  additionalVerbiage: string;
}
