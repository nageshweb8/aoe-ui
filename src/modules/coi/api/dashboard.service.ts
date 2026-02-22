import type {
  ActivityFeedItem,
  COIDashboardStats,
  ComplianceTrendPoint,
  UpcomingExpiration,
} from '../dashboard/dashboard.types';

const API_BASE = process.env['NEXT_PUBLIC_API_BASE_URL']
  ? `${process.env['NEXT_PUBLIC_API_BASE_URL']}/api/coi/dashboard`
  : '/api/coi/dashboard';

/** Fetch dashboard summary statistics */
export async function getDashboardStats(): Promise<COIDashboardStats> {
  const res = await fetch(`${API_BASE}/stats`);
  if (!res.ok) {
    throw new Error(`Failed to fetch dashboard stats (${res.status})`);
  }
  return res.json();
}

/** Fetch compliance trend data */
export async function getComplianceTrend(months: number = 12): Promise<ComplianceTrendPoint[]> {
  const res = await fetch(`${API_BASE}/compliance-trend?months=${months}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch compliance trend (${res.status})`);
  }
  return res.json();
}

/** Fetch upcoming expirations */
export async function getUpcomingExpirations(days: number = 90): Promise<UpcomingExpiration[]> {
  const res = await fetch(`${API_BASE}/upcoming-expirations?days=${days}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch upcoming expirations (${res.status})`);
  }
  return res.json();
}

/** Fetch recent activity feed */
export async function getActivityFeed(limit: number = 20): Promise<ActivityFeedItem[]> {
  const res = await fetch(`${API_BASE}/activity?limit=${limit}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch activity feed (${res.status})`);
  }
  return res.json();
}
