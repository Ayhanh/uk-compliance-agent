export const TRIAL_DAYS = 14;

// Dodo subscription statuses that grant access.
const ACCESS_STATUSES = new Set(["active", "trialing"]);

export interface AccessInput {
  trialEndsAt: Date | null;
  subscriptions: {
    status: string;
    currentPeriodEnd: Date | null;
    cancelAtPeriodEnd: boolean;
  }[];
  now?: Date;
}

export type AccessState =
  | { hasAccess: true; reason: "subscription" | "trial"; until: Date | null }
  | { hasAccess: false; reason: "none" };

/**
 * Decides whether a company may use continuous monitoring and AI scans.
 * A paid subscription wins over the trial. A cancelled subscription keeps
 * access until the paid period ends.
 */
export function computeAccess({
  trialEndsAt,
  subscriptions,
  now = new Date(),
}: AccessInput): AccessState {
  for (const sub of subscriptions) {
    const periodStillRunning =
      sub.currentPeriodEnd === null || sub.currentPeriodEnd > now;
    const isActive = ACCESS_STATUSES.has(sub.status);
    const isCancelledButPaid =
      sub.status === "cancelled" &&
      sub.currentPeriodEnd !== null &&
      sub.currentPeriodEnd > now;
    if ((isActive && periodStillRunning) || isCancelledButPaid) {
      return {
        hasAccess: true,
        reason: "subscription",
        until: sub.currentPeriodEnd,
      };
    }
  }
  if (trialEndsAt && trialEndsAt > now) {
    return { hasAccess: true, reason: "trial", until: trialEndsAt };
  }
  return { hasAccess: false, reason: "none" };
}

export function addTrialDays(from: Date): Date {
  return new Date(from.getTime() + TRIAL_DAYS * 24 * 60 * 60 * 1000);
}
