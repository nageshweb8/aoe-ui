/**
 * @module coi (Certificate of Insurance)
 *
 * Self-contained domain module for COI verification.
 *
 * Public API — only these exports should be consumed by route pages.
 * Internal implementation details (components, utils, services) are hidden.
 *
 * Rules:
 *  - May import from `@shared`.
 *  - Must NOT import from other modules or `@shell`.
 */
export { CertificateOfInsurancePage } from './views';

// Re-export types for consumers that need them
export type {
  COIPolicy,
  COIPolicyExpiration,
  COIUploadStatus,
  COIVerificationResponse,
} from './types';
