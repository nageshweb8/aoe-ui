/**
 * Certificate of Insurance (COI) — ACORD 25 Standard
 * Type definitions for extracted insurance certificate data
 */

/** Individual insurance policy extracted from ACORD certificate */
export interface COIPolicy {
  /** Type of insurance (e.g. "Commercial General Liability") */
  readonly typeOfInsurance: string;
  /** Policy number */
  readonly policyNumber: string;
  /** Policy effective date (ISO 8601) */
  readonly policyEffectiveDate: string;
  /** Policy expiration date (ISO 8601) */
  readonly policyExpirationDate: string;
  /** Coverage limits as key-value pairs */
  readonly limits?: Record<string, string>;
  /** Insurer letter identifier (A, B, C, etc.) */
  readonly insurerLetter?: string;
}

/** Producer / Agent information */
export interface COIProducer {
  readonly name: string;
  readonly address?: string;
  readonly phone?: string;
  readonly fax?: string;
  readonly email?: string;
}

/** Insured entity */
export interface COIInsured {
  readonly name: string;
  readonly address?: string;
}

/** Certificate holder */
export interface COICertificateHolder {
  readonly name: string;
  readonly address?: string;
}

/** Insurer company */
export interface COIInsurer {
  readonly letter: string;
  readonly name: string;
  readonly naicNumber?: string;
}

/** Full COI verification response from backend */
export interface COIVerificationResponse {
  /** Unique verification ID */
  readonly id: string;
  /** Certificate number if present */
  readonly certificateNumber?: string;
  /** Date the certificate was issued (ISO 8601) */
  readonly certificateDate?: string;
  /** Producer / Agent details */
  readonly producer?: COIProducer;
  /** Insured party details */
  readonly insured: COIInsured;
  /** Certificate holder details */
  readonly certificateHolder?: COICertificateHolder;
  /** List of insurer companies */
  readonly insurers?: readonly COIInsurer[];
  /** Extracted policies */
  readonly policies: readonly COIPolicy[];
  /** Backend-provided expiration warnings */
  readonly expirationWarnings?: readonly COIPolicyExpiration[];
  /** Overall verification status */
  readonly status: 'verified' | 'expired' | 'partial' | 'error';
  /** Human-readable message */
  readonly message?: string;
}

/** Policy expiration detail (used by both backend response and frontend check) */
export interface COIPolicyExpiration {
  readonly typeOfInsurance: string;
  readonly policyNumber: string;
  readonly policyEffectiveDate: string;
  readonly policyExpirationDate: string;
  readonly daysExpired: number;
}

/** Upload state for the UI */
export type COIUploadStatus = 'idle' | 'uploading' | 'success' | 'error';

/** Accepted file types for COI upload — PDF only */
export const COI_ACCEPTED_FILE_TYPES = {
  'application/pdf': ['.pdf'],
} as const;

export const COI_MAX_FILE_SIZE_MB = 10;
export const COI_MAX_FILE_SIZE_BYTES = COI_MAX_FILE_SIZE_MB * 1024 * 1024;
