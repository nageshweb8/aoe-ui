import type { COIVerificationResponse } from '../shared/types/coi.types';

const COI_API_BASE = process.env['NEXT_PUBLIC_API_BASE_URL']
  ? `${process.env['NEXT_PUBLIC_API_BASE_URL']}/api/coi`
  : '/api/coi';

/**
 * Upload a Certificate of Insurance document for verification.
 *
 * POST /api/coi/verify
 * Content-Type: multipart/form-data
 * Body: { file: File }
 */
export async function verifyCOIDocument(file: File): Promise<COIVerificationResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${COI_API_BASE}/verify`, {
    method: 'POST',
    body: formData,
    // Do NOT set Content-Type — browser sets it with boundary for multipart
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => 'Unknown error');
    throw new Error(`COI verification failed (${response.status}): ${errorBody}`);
  }

  const data: COIVerificationResponse = await response.json();
  return data;
}
