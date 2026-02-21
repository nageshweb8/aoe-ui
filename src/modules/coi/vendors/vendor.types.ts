/**
 * Vendor Management — Type definitions
 */

/** Vendor compliance status */
export type VendorStatus = 'active' | 'pending' | 'rejected' | 'expired';

/** Primary contact for a vendor */
export interface VendorContact {
  readonly name: string;
  readonly jobTitle?: string;
  readonly email: string;
  readonly phone?: string;
}

/** Insurance agent / broker associated with a vendor */
export interface InsuranceAgent {
  readonly name: string;
  readonly company?: string;
  readonly email: string;
  readonly phone?: string;
}

/** Vendor entity */
export interface Vendor {
  readonly id: string;
  readonly companyName: string;
  readonly address: {
    readonly street: string;
    readonly city: string;
    readonly state: string;
    readonly zip: string;
    readonly country: string;
  };
  readonly contact: VendorContact;
  readonly agent?: InsuranceAgent;
  readonly status: VendorStatus;
  readonly buildingIds: readonly string[];
  readonly coiCount: number;
  readonly compliancePercentage: number;
  readonly createdAt: string;
  readonly updatedAt: string;
}

/** Form values for creating / editing a vendor */
export interface VendorFormValues {
  companyName: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  contactName: string;
  contactJobTitle: string;
  contactEmail: string;
  contactPhone: string;
  agentName: string;
  agentCompany: string;
  agentEmail: string;
  agentPhone: string;
  buildingIds: string[];
}
