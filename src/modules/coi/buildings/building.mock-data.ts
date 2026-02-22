import type { Building } from './building.types';

/**
 * Seed data for local development — 8 buildings.
 * Each building has certificate holder info that auto-fills when selected.
 * Replace with real API calls when the backend is ready.
 */
export const MOCK_BUILDINGS: Building[] = [
  {
    id: 'b-001',
    name: 'Park Central Tower',
    address: {
      street: '3100 McKinnon Street',
      city: 'Dallas',
      state: 'TX',
      zip: '75201',
    },
    certificateHolder: {
      name: 'Park Central Tower LLC',
      address: '3100 McKinnon Street, Dallas, TX 75201',
    },
    templateId: 't-001',
    vendorCount: 4,
    compliancePercentage: 92,
    createdAt: '2024-08-01T10:00:00Z',
    updatedAt: '2026-02-15T09:30:00Z',
  },
  {
    id: 'b-002',
    name: 'Lakewood Plaza',
    address: {
      street: '6300 Gaston Avenue',
      city: 'Dallas',
      state: 'TX',
      zip: '75214',
    },
    certificateHolder: {
      name: 'Lakewood Plaza Partners LP',
      address: '6300 Gaston Avenue, Suite 100, Dallas, TX 75214',
    },
    templateId: 't-001',
    vendorCount: 3,
    compliancePercentage: 78,
    createdAt: '2024-09-15T08:00:00Z',
    updatedAt: '2026-02-10T14:20:00Z',
  },
  {
    id: 'b-003',
    name: 'Legacy Business Park - Bldg A',
    address: {
      street: '7200 Bishop Road',
      city: 'Plano',
      state: 'TX',
      zip: '75024',
    },
    certificateHolder: {
      name: 'Legacy BP Holdings Inc.',
      address: '7200 Bishop Road, Plano, TX 75024',
    },
    templateId: 't-002',
    vendorCount: 3,
    compliancePercentage: 100,
    createdAt: '2024-10-01T12:00:00Z',
    updatedAt: '2026-01-28T16:45:00Z',
  },
  {
    id: 'b-004',
    name: 'Uptown Residences',
    address: {
      street: '2500 Cedar Springs Road',
      city: 'Dallas',
      state: 'TX',
      zip: '75201',
    },
    certificateHolder: {
      name: 'Uptown Residential Management LLC',
      address: '2500 Cedar Springs Road, Dallas, TX 75201',
    },
    templateId: 't-001',
    vendorCount: 2,
    compliancePercentage: 65,
    createdAt: '2024-11-10T09:30:00Z',
    updatedAt: '2026-02-18T11:00:00Z',
  },
  {
    id: 'b-005',
    name: 'Commerce Street Lofts',
    address: {
      street: '1400 Commerce Street',
      city: 'Fort Worth',
      state: 'TX',
      zip: '76102',
    },
    certificateHolder: {
      name: 'Commerce Lofts Associates',
      address: '1400 Commerce Street, Fort Worth, TX 76102',
    },
    templateId: 't-002',
    vendorCount: 2,
    compliancePercentage: 50,
    createdAt: '2025-01-05T14:00:00Z',
    updatedAt: '2026-02-01T10:15:00Z',
  },
  {
    id: 'b-006',
    name: 'Riverside Office Center',
    address: {
      street: '900 River Bend Drive',
      city: 'Irving',
      state: 'TX',
      zip: '75039',
    },
    certificateHolder: {
      name: 'Riverside Office Center LP',
      address: '900 River Bend Drive, Irving, TX 75039',
    },
    vendorCount: 1,
    compliancePercentage: 42,
    createdAt: '2025-03-20T11:00:00Z',
    updatedAt: '2026-01-30T08:40:00Z',
  },
  {
    id: 'b-007',
    name: 'Preston Hollow Village',
    address: {
      street: '8400 Westchester Drive',
      city: 'Dallas',
      state: 'TX',
      zip: '75225',
    },
    certificateHolder: {
      name: 'Preston Hollow Village Owners Assoc.',
      address: '8400 Westchester Drive, Dallas, TX 75225',
    },
    templateId: 't-001',
    vendorCount: 1,
    compliancePercentage: 100,
    createdAt: '2025-05-12T10:00:00Z',
    updatedAt: '2026-02-20T13:00:00Z',
  },
  {
    id: 'b-008',
    name: 'Trinity Industrial Complex',
    address: {
      street: '5500 Trinity Boulevard',
      city: 'Arlington',
      state: 'TX',
      zip: '76011',
    },
    certificateHolder: {
      name: 'Trinity Industrial LLC',
      address: '5500 Trinity Boulevard, Arlington, TX 76011',
    },
    vendorCount: 1,
    compliancePercentage: 0,
    createdAt: '2025-07-01T09:00:00Z',
    updatedAt: '2026-02-05T15:30:00Z',
  },
];
