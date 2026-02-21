import type {
  AuditTrailEntry,
  NotificationLogEntry,
  NotificationSettings,
  ReportFilters,
} from '../reports/notification.types';
import type { COIDocument } from '../shared/types/document.types';

const API_BASE = process.env['NEXT_PUBLIC_API_BASE_URL']
  ? `${process.env['NEXT_PUBLIC_API_BASE_URL']}/api/coi`
  : '/api/coi';

// ── Notification Settings ──────────────────────────────────────────

/** Fetch notification settings */
export async function getNotificationSettings(): Promise<NotificationSettings> {
  const res = await fetch(`${API_BASE}/notifications/settings`);
  if (!res.ok) {
    throw new Error(`Failed to fetch notification settings (${res.status})`);
  }
  return res.json();
}

/** Update notification settings */
export async function updateNotificationSettings(
  data: Partial<NotificationSettings>,
): Promise<NotificationSettings> {
  const res = await fetch(`${API_BASE}/notifications/settings`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(`Failed to update notification settings (${res.status})`);
  }
  return res.json();
}

/** Fetch notification log */
export async function getNotificationLog(
  page: number = 1,
  limit: number = 50,
): Promise<NotificationLogEntry[]> {
  const res = await fetch(`${API_BASE}/notifications/log?page=${page}&limit=${limit}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch notification log (${res.status})`);
  }
  return res.json();
}

// ── Reporting ──────────────────────────────────────────────────────

/** Fetch compliance report */
export async function getComplianceReport(filters: ReportFilters): Promise<COIDocument[]> {
  const query = new URLSearchParams();
  if (filters.buildingId) {
    query.set('building_id', filters.buildingId);
  }
  if (filters.vendorId) {
    query.set('vendor_id', filters.vendorId);
  }
  if (filters.status) {
    query.set('status', filters.status);
  }
  if (filters.dateFrom) {
    query.set('date_from', filters.dateFrom);
  }
  if (filters.dateTo) {
    query.set('date_to', filters.dateTo);
  }
  const qs = query.toString();
  const res = await fetch(`${API_BASE}/reports/compliance${qs ? `?${qs}` : ''}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch compliance report (${res.status})`);
  }
  return res.json();
}

/** Fetch expiration report */
export async function getExpirationReport(days: number = 90): Promise<COIDocument[]> {
  const res = await fetch(`${API_BASE}/reports/expirations?days=${days}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch expiration report (${res.status})`);
  }
  return res.json();
}

/** Fetch audit trail */
export async function getAuditTrail(
  entityType?: string,
  entityId?: string,
): Promise<AuditTrailEntry[]> {
  const query = new URLSearchParams();
  if (entityType) {
    query.set('entity_type', entityType);
  }
  if (entityId) {
    query.set('entity_id', entityId);
  }
  const qs = query.toString();
  const res = await fetch(`${API_BASE}/reports/audit${qs ? `?${qs}` : ''}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch audit trail (${res.status})`);
  }
  return res.json();
}
