/**
 * COI Dashboard — Type definitions
 */

/** Dashboard summary statistics */
export interface COIDashboardStats {
  readonly totalVendors: number;
  readonly totalCOIs: number;
  readonly compliantCOIs: number;
  readonly compliantPercentage: number;
  readonly nonCompliantCOIs: number;
  readonly rejectedCOIs: number;
  readonly expiringSoon30: number;
  readonly expiringSoon60: number;
  readonly expiringSoon90: number;
  readonly expiredCOIs: number;
}

/** Compliance trend data point */
export interface ComplianceTrendPoint {
  readonly date: string;
  readonly compliancePercentage: number;
}

/** Recent activity feed item */
export interface ActivityFeedItem {
  readonly id: string;
  readonly type: 'upload' | 'approval' | 'rejection' | 'expiry_warning' | 'request_sent';
  readonly vendorName: string;
  readonly buildingName?: string;
  readonly description: string;
  readonly timestamp: string;
  readonly userId?: string;
  readonly userName?: string;
}

/** Upcoming expiration item */
export interface UpcomingExpiration {
  readonly vendorId: string;
  readonly vendorName: string;
  readonly buildingName: string;
  readonly policyType: string;
  readonly expirationDate: string;
  readonly daysRemaining: number;
}
