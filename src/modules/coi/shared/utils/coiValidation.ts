import type { COIPolicy, COIPolicyExpiration } from '../types/coi.types';

/**
 * Check each policy's expiration date against today's system date.
 * Returns an array of expired policy details.
 */
export function checkExpiredPolicies(
  policies: readonly COIPolicy[],
  referenceDate: Date = new Date(),
): COIPolicyExpiration[] {
  const today = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate(),
  );

  return policies.reduce<COIPolicyExpiration[]>((expired, policy) => {
    const expirationDate = new Date(policy.policyExpirationDate);
    const expirationDay = new Date(
      expirationDate.getFullYear(),
      expirationDate.getMonth(),
      expirationDate.getDate(),
    );

    if (expirationDay < today) {
      const diffMs = today.getTime() - expirationDay.getTime();
      const daysExpired = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      expired.push({
        typeOfInsurance: policy.typeOfInsurance,
        policyNumber: policy.policyNumber,
        policyEffectiveDate: policy.policyEffectiveDate,
        policyExpirationDate: policy.policyExpirationDate,
        daysExpired,
      });
    }

    return expired;
  }, []);
}

/**
 * Format an ISO date string to locale-friendly display.
 */
export function formatPolicyDate(isoDate: string): string {
  try {
    return new Date(isoDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  } catch {
    return isoDate;
  }
}

/**
 * Determine if a date is in the past.
 */
export function isDateExpired(isoDate: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(isoDate);
  target.setHours(0, 0, 0, 0);
  return target < today;
}
