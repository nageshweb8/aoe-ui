// ── COI Verification (existing) ────────────────────────────────────
export { verifyCOIDocument } from './coi.service';

// ── Vendor Management ──────────────────────────────────────────────
export { createVendor, deleteVendor, getVendor, getVendors, updateVendor } from './vendor.service';

// ── Building / Property ────────────────────────────────────────────
export { createBuilding, getBuilding, getBuildings, updateBuilding } from './building.service';

// ── Requirements Templates ─────────────────────────────────────────
export {
  createTemplate,
  deleteTemplate,
  getTemplate,
  getTemplates,
  updateTemplate,
} from './template.service';

// ── COI Document / Tracking ────────────────────────────────────────
export {
  approveCOIDocument,
  generateUploadToken,
  getCOIDocument,
  getCOIDocuments,
  rejectCOIDocument,
  uploadCOIDocument,
} from './document.service';

// ── Dashboard ──────────────────────────────────────────────────────
export {
  getActivityFeed,
  getComplianceTrend,
  getDashboardStats,
  getUpcomingExpirations,
} from './dashboard.service';

// ── Notifications & Reporting ──────────────────────────────────────
export {
  getAuditTrail,
  getComplianceReport,
  getExpirationReport,
  getNotificationLog,
  getNotificationSettings,
  updateNotificationSettings,
} from './report.service';
