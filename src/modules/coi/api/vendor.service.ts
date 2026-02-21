import type { Vendor, VendorFormValues } from '../vendors/vendor.types';

const API_BASE = process.env['NEXT_PUBLIC_API_BASE_URL']
  ? `${process.env['NEXT_PUBLIC_API_BASE_URL']}/api/coi/vendors`
  : '/api/coi/vendors';

/** Fetch all vendors */
export async function getVendors(): Promise<Vendor[]> {
  const res = await fetch(API_BASE);
  if (!res.ok) {
    throw new Error(`Failed to fetch vendors (${res.status})`);
  }
  return res.json();
}

/** Fetch a single vendor by ID */
export async function getVendor(id: string): Promise<Vendor> {
  const res = await fetch(`${API_BASE}/${id}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch vendor (${res.status})`);
  }
  return res.json();
}

/** Create a new vendor */
export async function createVendor(data: VendorFormValues): Promise<Vendor> {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(`Failed to create vendor (${res.status})`);
  }
  return res.json();
}

/** Update an existing vendor */
export async function updateVendor(id: string, data: Partial<VendorFormValues>): Promise<Vendor> {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(`Failed to update vendor (${res.status})`);
  }
  return res.json();
}

/** Delete a vendor */
export async function deleteVendor(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    throw new Error(`Failed to delete vendor (${res.status})`);
  }
}
