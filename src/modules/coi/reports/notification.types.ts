/**
 * Notification & Reporting — Type definitions
 */

/** Notification event types */
export type NotificationEventType =
  | 'coi_request'
  | 'coi_uploaded'
  | 'coi_approved'
  | 'coi_rejected'
  | 'expiry_warning'
  | 'coi_expired';

/** Notification settings configuration */
export interface NotificationSettings {
  readonly id: string;
  /** Days before expiry to send reminders */
  readonly expiryReminderDays: readonly number[];
  /** Recipients per event type */
  readonly eventRecipients: Record<
    NotificationEventType,
    {
      readonly sendToVendor: boolean;
      readonly sendToAgent: boolean;
      readonly additionalEmails: readonly string[];
    }
  >;
  readonly updatedAt: string;
}

/** Notification log entry */
export interface NotificationLogEntry {
  readonly id: string;
  readonly eventType: NotificationEventType;
  readonly recipientEmail: string;
  readonly recipientName?: string;
  readonly subject: string;
  readonly status: 'sent' | 'opened' | 'bounced' | 'failed';
  readonly sentAt: string;
  readonly vendorId?: string;
  readonly buildingId?: string;
}

/** Audit trail entry */
export interface AuditTrailEntry {
  readonly id: string;
  readonly action: 'upload' | 'approve' | 'reject' | 'override' | 'request' | 'edit' | 'delete';
  readonly entityType: 'coi' | 'vendor' | 'building' | 'template';
  readonly entityId: string;
  readonly description: string;
  readonly reason?: string;
  readonly userId: string;
  readonly userName: string;
  readonly timestamp: string;
}

/** Report filter options */
export interface ReportFilters {
  buildingId?: string;
  vendorId?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}
