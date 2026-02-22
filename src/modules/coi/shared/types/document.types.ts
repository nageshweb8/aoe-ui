/**
 * COI Document / Tracking — Type definitions
 */

/** COI document status within the tracking workflow */
export type COIDocumentStatus =
  | 'pending_upload'
  | 'uploaded'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'expired';

/** Compliance comparison result for a single requirement */
export interface ComplianceLineItem {
  readonly requirement: string;
  readonly expected: string;
  readonly actual: string;
  readonly passed: boolean;
  /** AI confidence score (0–1) */
  readonly confidence?: number;
}

/** A COI document record — ties a vendor + building to an uploaded certificate */
export interface COIDocument {
  readonly id: string;
  readonly vendorId: string;
  readonly vendorName: string;
  readonly buildingId: string;
  readonly buildingName: string;
  readonly templateId?: string;
  readonly status: COIDocumentStatus;
  /** Reference to the uploaded file */
  readonly fileUrl?: string;
  readonly fileName?: string;
  /** Verification result from the extraction/AI pipeline */
  readonly verificationId?: string;
  /** Compliance comparison results */
  readonly complianceResults?: readonly ComplianceLineItem[];
  /** Rejection reason (if rejected) */
  readonly rejectionReason?: string;
  /** Override reason (if approved despite non-compliance) */
  readonly overrideReason?: string;
  /** Expiration date of the earliest policy in this COI */
  readonly earliestExpiration?: string;
  readonly uploadedAt?: string;
  readonly reviewedAt?: string;
  readonly reviewedBy?: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

/** Upload token for the vendor loginless portal */
export interface UploadToken {
  readonly id: string;
  readonly token: string;
  readonly vendorId: string;
  readonly buildingId: string;
  readonly templateId?: string;
  readonly expiresAt: string;
  readonly maxUses: number;
  readonly usedCount: number;
  readonly isActive: boolean;
  readonly createdAt: string;
}
