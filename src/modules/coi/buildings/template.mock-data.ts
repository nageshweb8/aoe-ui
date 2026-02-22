import type { COITemplate } from './template.types';

/**
 * Seed data for requirement templates.
 * These define what insurance policies vendors must provide for assigned buildings.
 */
export const MOCK_TEMPLATES: COITemplate[] = [
  {
    id: 't-001',
    name: 'Standard Commercial',
    description:
      'Standard COI requirements for commercial office and retail properties. Covers general liability, auto liability, workers comp, and umbrella.',
    isDefault: true,
    policyRequirements: [
      {
        policyType: 'general_liability',
        required: true,
        minimumLimits: {
          'Each Occurrence': '$1,000,000',
          'General Aggregate': '$2,000,000',
          'Products-Comp/Op Agg': '$2,000,000',
          'Personal & Adv Injury': '$1,000,000',
        },
      },
      {
        policyType: 'auto_liability',
        required: true,
        minimumLimits: {
          'Combined Single Limit': '$1,000,000',
        },
      },
      {
        policyType: 'workers_compensation',
        required: true,
        minimumLimits: {
          'Each Accident': '$500,000',
          'Disease - Each Employee': '$500,000',
          'Disease - Policy Limit': '$500,000',
        },
      },
      {
        policyType: 'umbrella',
        required: true,
        minimumLimits: {
          'Each Occurrence': '$5,000,000',
          Aggregate: '$5,000,000',
        },
      },
    ],
    additionalInsuredRequired: true,
    waiverOfSubrogationRequired: true,
    endorsementRequired: true,
    additionalVerbiage:
      'Certificate Holder must be listed as Additional Insured on the General Liability and Umbrella policies.',
    buildingIds: ['b-001', 'b-002', 'b-004', 'b-007'],
    createdAt: '2024-08-01T10:00:00Z',
    updatedAt: '2026-01-15T14:00:00Z',
  },
  {
    id: 't-002',
    name: 'Enhanced Industrial',
    description:
      'Enhanced requirements for industrial and warehouse facilities. Includes professional liability and higher umbrella limits.',
    isDefault: false,
    policyRequirements: [
      {
        policyType: 'general_liability',
        required: true,
        minimumLimits: {
          'Each Occurrence': '$2,000,000',
          'General Aggregate': '$4,000,000',
          'Products-Comp/Op Agg': '$4,000,000',
          'Personal & Adv Injury': '$2,000,000',
        },
      },
      {
        policyType: 'auto_liability',
        required: true,
        minimumLimits: {
          'Combined Single Limit': '$1,000,000',
        },
      },
      {
        policyType: 'workers_compensation',
        required: true,
        minimumLimits: {
          'Each Accident': '$1,000,000',
          'Disease - Each Employee': '$1,000,000',
          'Disease - Policy Limit': '$1,000,000',
        },
      },
      {
        policyType: 'umbrella',
        required: true,
        minimumLimits: {
          'Each Occurrence': '$10,000,000',
          Aggregate: '$10,000,000',
        },
      },
      {
        policyType: 'professional_liability',
        required: true,
        minimumLimits: {
          'Each Claim': '$1,000,000',
          Aggregate: '$2,000,000',
        },
      },
      {
        policyType: 'property',
        required: true,
        minimumLimits: {
          'Replacement Cost': 'Full Value',
        },
      },
    ],
    additionalInsuredRequired: true,
    waiverOfSubrogationRequired: true,
    endorsementRequired: true,
    additionalVerbiage:
      'All policies must name the Certificate Holder as Additional Insured. 30-day advance notice of cancellation required.',
    buildingIds: ['b-003', 'b-005'],
    createdAt: '2025-01-10T09:00:00Z',
    updatedAt: '2026-02-01T11:30:00Z',
  },
  {
    id: 't-003',
    name: 'Residential Basic',
    description:
      'Minimum requirements for residential property vendors. General liability and workers compensation only.',
    isDefault: false,
    policyRequirements: [
      {
        policyType: 'general_liability',
        required: true,
        minimumLimits: {
          'Each Occurrence': '$500,000',
          'General Aggregate': '$1,000,000',
        },
      },
      {
        policyType: 'workers_compensation',
        required: true,
        minimumLimits: {
          'Each Accident': '$500,000',
          'Disease - Each Employee': '$500,000',
          'Disease - Policy Limit': '$500,000',
        },
      },
    ],
    additionalInsuredRequired: true,
    waiverOfSubrogationRequired: false,
    endorsementRequired: false,
    buildingIds: [],
    createdAt: '2025-06-20T13:00:00Z',
    updatedAt: '2025-06-20T13:00:00Z',
  },
];
