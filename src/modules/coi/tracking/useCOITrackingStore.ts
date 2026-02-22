import { useSyncExternalStore } from 'react';

import type {
  COIDocument,
  COIDocumentStatus,
  ComplianceLineItem,
} from '../shared/types/document.types';

import { MOCK_COI_DOCUMENTS } from './coi-document.mock-data';

// ── Internal state ──────────────────────────────────────────────────

let documents: COIDocument[] = [...MOCK_COI_DOCUMENTS];
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

function getSnapshot(): COIDocument[] {
  return documents;
}

function getServerSnapshot(): COIDocument[] {
  return MOCK_COI_DOCUMENTS;
}

// ── Filter types ────────────────────────────────────────────────────

export type COITrackingFilter =
  | 'all'
  | 'pending'
  | 'approved'
  | 'non_compliant'
  | 'expiring_soon'
  | 'expired';

/** Days threshold for "expiring soon" filter. */
const EXPIRING_SOON_DAYS = 30;

// ── Filter helpers ──────────────────────────────────────────────────

function isExpiringSoon(doc: COIDocument): boolean {
  if (!doc.earliestExpiration || doc.status === 'expired') {
    return false;
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expDate = new Date(doc.earliestExpiration);
  expDate.setHours(0, 0, 0, 0);
  const diffDays = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays >= 0 && diffDays <= EXPIRING_SOON_DAYS;
}

function isNonCompliant(doc: COIDocument): boolean {
  if (!doc.complianceResults || doc.complianceResults.length === 0) {
    return false;
  }
  return doc.complianceResults.some((r) => !r.passed);
}

function applyFilter(docs: COIDocument[], filter: COITrackingFilter): COIDocument[] {
  switch (filter) {
    case 'all':
      return docs;
    case 'pending':
      return docs.filter(
        (d) =>
          d.status === 'pending_upload' || d.status === 'uploaded' || d.status === 'under_review',
      );
    case 'approved':
      return docs.filter((d) => d.status === 'approved');
    case 'non_compliant':
      return docs.filter((d) => isNonCompliant(d) && d.status !== 'expired');
    case 'expiring_soon':
      return docs.filter((d) => isExpiringSoon(d));
    case 'expired':
      return docs.filter((d) => d.status === 'expired');
  }
}

// ── Compliance helpers (public) ─────────────────────────────────────

/** Calculate compliance percentage for a document. */
export function getCompliancePercentage(doc: COIDocument): number {
  if (!doc.complianceResults || doc.complianceResults.length === 0) {
    return 0;
  }
  const passed = doc.complianceResults.filter((r) => r.passed).length;
  return Math.round((passed / doc.complianceResults.length) * 100);
}

/** Get a UI-friendly status label. */
export function getStatusLabel(status: COIDocumentStatus): string {
  const labels: Record<COIDocumentStatus, string> = {
    pending_upload: 'Pending Upload',
    uploaded: 'Uploaded',
    under_review: 'Under Review',
    approved: 'Approved',
    rejected: 'Rejected',
    expired: 'Expired',
  };
  return labels[status];
}

/** Map status to StatusBadge variant. */
export function getStatusVariant(
  status: COIDocumentStatus,
): 'success' | 'error' | 'warning' | 'info' | 'default' {
  const variants: Record<COIDocumentStatus, 'success' | 'error' | 'warning' | 'info' | 'default'> =
    {
      pending_upload: 'info',
      uploaded: 'info',
      under_review: 'warning',
      approved: 'success',
      rejected: 'error',
      expired: 'error',
    };
  return variants[status];
}

// ── Filter count helper ────────────────────────────────────────────

export interface FilterCounts {
  all: number;
  pending: number;
  approved: number;
  non_compliant: number;
  expiring_soon: number;
  expired: number;
}

function computeFilterCounts(docs: COIDocument[]): FilterCounts {
  return {
    all: docs.length,
    pending: applyFilter(docs, 'pending').length,
    approved: applyFilter(docs, 'approved').length,
    non_compliant: applyFilter(docs, 'non_compliant').length,
    expiring_soon: applyFilter(docs, 'expiring_soon').length,
    expired: applyFilter(docs, 'expired').length,
  };
}

// ── Public hooks ────────────────────────────────────────────────────

/** Reactive hook — all COI documents (unfiltered). */
export function useCOIDocuments(): COIDocument[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Reactive hook — filtered COI documents. */
export function useFilteredCOIDocuments(filter: COITrackingFilter): COIDocument[] {
  const all = useCOIDocuments();
  return applyFilter(all, filter);
}

/** Reactive hook — single COI document by ID. */
export function useCOIDocument(id: string): COIDocument | undefined {
  const all = useCOIDocuments();
  return all.find((d) => d.id === id);
}

/** Reactive hook — documents pending review (status = under_review). */
export function usePendingReviewDocuments(): COIDocument[] {
  const all = useCOIDocuments();
  return all.filter((d) => d.status === 'under_review');
}

/** Reactive hook — filter counts for badge display. */
export function useFilterCounts(): FilterCounts {
  const all = useCOIDocuments();
  return computeFilterCounts(all);
}

// ── Mutations ───────────────────────────────────────────────────────

/** Add a new COI document (from upload wizard). */
export function addCOIDocument(
  doc: Omit<COIDocument, 'id' | 'createdAt' | 'updatedAt'>,
): COIDocument {
  const now = new Date().toISOString();
  const newDoc: COIDocument = {
    ...doc,
    id: `doc-${String(Date.now()).slice(-6)}`,
    createdAt: now,
    updatedAt: now,
  };
  documents = [newDoc, ...documents];
  emitChange();
  return newDoc;
}

/** Update a document's status. */
export function updateCOIDocumentStatus(
  id: string,
  status: COIDocumentStatus,
): COIDocument | undefined {
  const idx = documents.findIndex((d) => d.id === id);
  if (idx === -1) {
    return undefined;
  }
  const existing = documents[idx];
  if (!existing) {
    return undefined;
  }
  const updated: COIDocument = {
    ...existing,
    status,
    updatedAt: new Date().toISOString(),
  };
  documents = documents.map((d, i) => (i === idx ? updated : d));
  emitChange();
  return updated;
}

/** Approve a COI document. Optionally provide an override reason. */
export function approveCOIDocument(id: string, overrideReason?: string): COIDocument | undefined {
  const idx = documents.findIndex((d) => d.id === id);
  if (idx === -1) {
    return undefined;
  }
  const existing = documents[idx];
  if (!existing) {
    return undefined;
  }
  const now = new Date().toISOString();
  const updated: COIDocument = {
    ...existing,
    status: 'approved',
    overrideReason: overrideReason || undefined,
    reviewedAt: now,
    reviewedBy: 'Current User',
    updatedAt: now,
  };
  documents = documents.map((d, i) => (i === idx ? updated : d));
  emitChange();
  return updated;
}

/** Reject a COI document with a reason. */
export function rejectCOIDocument(id: string, reason: string): COIDocument | undefined {
  const idx = documents.findIndex((d) => d.id === id);
  if (idx === -1) {
    return undefined;
  }
  const existing = documents[idx];
  if (!existing) {
    return undefined;
  }
  const now = new Date().toISOString();
  const updated: COIDocument = {
    ...existing,
    status: 'rejected',
    rejectionReason: reason,
    reviewedAt: now,
    reviewedBy: 'Current User',
    updatedAt: now,
  };
  documents = documents.map((d, i) => (i === idx ? updated : d));
  emitChange();
  return updated;
}

/** Update a document with verification results (from AI step). */
export function setCOIVerificationResults(
  id: string,
  verificationId: string,
  complianceResults: readonly ComplianceLineItem[],
  earliestExpiration: string,
): COIDocument | undefined {
  const idx = documents.findIndex((d) => d.id === id);
  if (idx === -1) {
    return undefined;
  }
  const existing = documents[idx];
  if (!existing) {
    return undefined;
  }
  const updated: COIDocument = {
    ...existing,
    verificationId,
    complianceResults,
    earliestExpiration,
    status: 'under_review',
    updatedAt: new Date().toISOString(),
  };
  documents = documents.map((d, i) => (i === idx ? updated : d));
  emitChange();
  return updated;
}

/** Get current store version (for debugging). */
export function getCOITrackingVersion(): number {
  return version;
}
