import type { COIVerificationResponse } from '../shared/types/coi.types';
import type { COIDocument, UploadToken } from '../shared/types/document.types';

const API_BASE = process.env['NEXT_PUBLIC_API_BASE_URL']
  ? `${process.env['NEXT_PUBLIC_API_BASE_URL']}/api/coi`
  : '/api/coi';

/** Fetch all COI documents (with optional filters) */
export async function getCOIDocuments(params?: {
  vendorId?: string;
  buildingId?: string;
  status?: string;
}): Promise<COIDocument[]> {
  const query = new URLSearchParams();
  if (params?.vendorId) {
    query.set('vendor_id', params.vendorId);
  }
  if (params?.buildingId) {
    query.set('building_id', params.buildingId);
  }
  if (params?.status) {
    query.set('status', params.status);
  }
  const qs = query.toString();
  const res = await fetch(`${API_BASE}/documents${qs ? `?${qs}` : ''}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch COI documents (${res.status})`);
  }
  return res.json();
}

/** Fetch a single COI document */
export async function getCOIDocument(id: string): Promise<COIDocument> {
  const res = await fetch(`${API_BASE}/documents/${id}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch COI document (${res.status})`);
  }
  return res.json();
}

/** Upload a COI document for a specific vendor + building */
export async function uploadCOIDocument(
  file: File,
  vendorId: string,
  buildingId: string,
): Promise<COIVerificationResponse> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('vendor_id', vendorId);
  formData.append('building_id', buildingId);

  const res = await fetch(`${API_BASE}/documents/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const errorBody = await res.text().catch(() => 'Unknown error');
    throw new Error(`COI upload failed (${res.status}): ${errorBody}`);
  }
  return res.json();
}

/** Approve a COI document */
export async function approveCOIDocument(
  id: string,
  overrideReason?: string,
): Promise<COIDocument> {
  const res = await fetch(`${API_BASE}/documents/${id}/approve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ overrideReason }),
  });
  if (!res.ok) {
    throw new Error(`Failed to approve COI document (${res.status})`);
  }
  return res.json();
}

/** Reject a COI document */
export async function rejectCOIDocument(id: string, reason: string): Promise<COIDocument> {
  const res = await fetch(`${API_BASE}/documents/${id}/reject`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reason }),
  });
  if (!res.ok) {
    throw new Error(`Failed to reject COI document (${res.status})`);
  }
  return res.json();
}

/** Generate an upload token for vendor loginless portal */
export async function generateUploadToken(
  vendorId: string,
  buildingId: string,
  expiresInDays: number = 30,
  maxUses: number = 1,
): Promise<UploadToken> {
  const res = await fetch(`${API_BASE}/tokens`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      vendor_id: vendorId,
      building_id: buildingId,
      expires_in_days: expiresInDays,
      max_uses: maxUses,
    }),
  });
  if (!res.ok) {
    throw new Error(`Failed to generate upload token (${res.status})`);
  }
  return res.json();
}
