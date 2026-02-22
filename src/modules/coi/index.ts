/**
 * @module coi (Certificate of Insurance)
 *
 * Self-contained domain module for COI verification.
 * Organised as feature-slices: each domain area lives in its own folder.
 *
 * Public API — only these exports should be consumed by route pages.
 * Internal implementation details (shared, api, constants) are hidden.
 *
 * Rules:
 *  - May import from `@shared`.
 *  - Must NOT import from other modules or `@shell`.
 */

// ── Feature-slice page exports ──────────────────────────────────────
export {
  AddBuildingPage,
  BuildingDetailPage,
  BuildingListPage,
  RequirementTemplatesPage,
} from './buildings';
export { COIDashboardPage } from './dashboard';
export { NotificationSettingsPage } from './notifications';
export { AuditTrailPage, ComplianceReportPage, ExpirationReportPage } from './reports';
export { COISettingsPage } from './settings';
export {
  CertificateOfInsurancePage,
  COITrackingListPage,
  PendingReviewPage,
  UploadCOIPage,
} from './tracking';
export { AddVendorPage, VendorDetailPage, VendorListPage } from './vendors';

// ── Re-export types for consumers that need them ────────────────────
export type {
  COIPolicy,
  COIPolicyExpiration,
  COIUploadStatus,
  COIVerificationResponse,
} from './shared/types';
