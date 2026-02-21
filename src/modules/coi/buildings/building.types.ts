/**
 * Building / Property — Type definitions
 */

/** Building / property entity */
export interface Building {
  readonly id: string;
  readonly name: string;
  readonly address: {
    readonly street: string;
    readonly city: string;
    readonly state: string;
    readonly zip: string;
  };
  /** Certificate holder information auto-filled when this building is selected */
  readonly certificateHolder: {
    readonly name: string;
    readonly address: string;
  };
  /** ID of the COI requirements template assigned to this building */
  readonly templateId?: string;
  readonly vendorCount: number;
  readonly compliancePercentage: number;
  readonly createdAt: string;
  readonly updatedAt: string;
}

/** Form values for creating / editing a building */
export interface BuildingFormValues {
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  certificateHolderName: string;
  certificateHolderAddress: string;
  templateId: string;
}
