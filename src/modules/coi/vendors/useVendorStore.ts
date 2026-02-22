import { useSyncExternalStore } from 'react';

import { MOCK_VENDORS } from './vendor.mock-data';
import type { Vendor, VendorFormValues } from './vendor.types';

// ── In-memory store ─────────────────────────────────────────────────
// Module-level mutable store that persists across renders.
// Will be replaced by TanStack Query + real API calls.

let vendors: Vendor[] = [...MOCK_VENDORS];
let version = 0;
const listeners = new Set<() => void>();

function emitChange() {
  version++;
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): Vendor[] {
  return vendors;
}

function getServerSnapshot(): Vendor[] {
  return MOCK_VENDORS;
}

// ── Public API ──────────────────────────────────────────────────────

/** Reactive hook — re-renders when vendor list changes. */
export function useVendors(): Vendor[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Reactive hook — returns a single vendor by ID (or undefined). */
export function useVendor(id: string): Vendor | undefined {
  const all = useVendors();
  return all.find((v) => v.id === id);
}

/** Add a new vendor from form values. Returns the created vendor. */
export function addVendor(values: VendorFormValues): Vendor {
  const now = new Date().toISOString();
  const newVendor: Vendor = {
    id: `v-${String(Date.now()).slice(-6)}`,
    companyName: values.companyName,
    address: {
      street: values.street,
      city: values.city,
      state: values.state,
      zip: values.zip,
      country: values.country || 'US',
    },
    contact: {
      name: values.contactName,
      jobTitle: values.contactJobTitle || undefined,
      email: values.contactEmail,
      phone: values.contactPhone || undefined,
    },
    agent:
      values.agentName || values.agentEmail
        ? {
            name: values.agentName,
            company: values.agentCompany || undefined,
            email: values.agentEmail,
            phone: values.agentPhone || undefined,
          }
        : undefined,
    status: 'pending',
    buildingIds: values.buildingIds,
    coiCount: 0,
    compliancePercentage: 0,
    createdAt: now,
    updatedAt: now,
  };

  vendors = [newVendor, ...vendors];
  emitChange();
  return newVendor;
}

/** Update an existing vendor. */
export function updateVendor(id: string, values: Partial<VendorFormValues>): Vendor | undefined {
  const idx = vendors.findIndex((v) => v.id === id);
  if (idx === -1) {
    return undefined;
  }

  const existing = vendors[idx];
  if (!existing) {
    return undefined;
  }
  const updated: Vendor = {
    ...existing,
    companyName: values.companyName ?? existing.companyName,
    address: {
      street: values.street ?? existing.address.street,
      city: values.city ?? existing.address.city,
      state: values.state ?? existing.address.state,
      zip: values.zip ?? existing.address.zip,
      country: values.country ?? existing.address.country,
    },
    contact: {
      name: values.contactName ?? existing.contact.name,
      jobTitle: values.contactJobTitle ?? existing.contact.jobTitle,
      email: values.contactEmail ?? existing.contact.email,
      phone: values.contactPhone ?? existing.contact.phone,
    },
    buildingIds: values.buildingIds ?? existing.buildingIds,
    updatedAt: new Date().toISOString(),
  };

  vendors = vendors.map((v, i) => (i === idx ? updated : v));
  emitChange();
  return updated;
}

/** Delete a vendor by ID. */
export function deleteVendor(id: string): boolean {
  const before = vendors.length;
  vendors = vendors.filter((v) => v.id !== id);
  if (vendors.length < before) {
    emitChange();
    return true;
  }
  return false;
}

// Expose version for potential cache-busting
export function getVersion(): number {
  return version;
}
