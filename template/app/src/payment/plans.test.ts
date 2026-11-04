import { describe, expect, it } from "vitest";
import {
  getSubscriptionPaymentPlanIds,
  parsePaymentPlanId,
  PaymentPlanId,
  paymentPlans,
  prettyPaymentPlanName,
  SubscriptionStatus,
} from "./plans";

describe("Payment Plans Module QA Tests", () => {
  it("should have correct subscription vs credits configuration for payment plans", () => {
    expect(paymentPlans[PaymentPlanId.Hobby].effect.kind).toBe("subscription");
    expect(paymentPlans[PaymentPlanId.Pro].effect.kind).toBe("subscription");
    expect(paymentPlans[PaymentPlanId.Credits10].effect.kind).toBe("credits");
    if (paymentPlans[PaymentPlanId.Credits10].effect.kind === "credits") {
      expect(paymentPlans[PaymentPlanId.Credits10].effect.amount).toBe(10);
    }
  });

  it("should format plan names correctly", () => {
    expect(prettyPaymentPlanName(PaymentPlanId.Hobby)).toBe("Hobby");
    expect(prettyPaymentPlanName(PaymentPlanId.Pro)).toBe("Pro");
    expect(prettyPaymentPlanName(PaymentPlanId.Credits10)).toBe("10 Credits");
  });

  it("should parse valid payment plan IDs and throw on invalid ones", () => {
    expect(parsePaymentPlanId("hobby")).toBe(PaymentPlanId.Hobby);
    expect(parsePaymentPlanId("pro")).toBe(PaymentPlanId.Pro);
    expect(parsePaymentPlanId("credits10")).toBe(PaymentPlanId.Credits10);

    expect(() => parsePaymentPlanId("invalid_plan")).toThrowError(
      "Invalid PaymentPlanId: invalid_plan",
    );
  });

  it("should return only subscription plan IDs from getSubscriptionPaymentPlanIds", () => {
    const subscriptionPlanIds = getSubscriptionPaymentPlanIds();
    expect(subscriptionPlanIds).toContain(PaymentPlanId.Hobby);
    expect(subscriptionPlanIds).toContain(PaymentPlanId.Pro);
    expect(subscriptionPlanIds).not.toContain(PaymentPlanId.Credits10);
  });

  it("should verify SubscriptionStatus enum values match expected Stripe/OpenSaaS status strings", () => {
    expect(SubscriptionStatus.PastDue).toBe("past_due");
    expect(SubscriptionStatus.CancelAtPeriodEnd).toBe("cancel_at_period_end");
    expect(SubscriptionStatus.Active).toBe("active");
    expect(SubscriptionStatus.Deleted).toBe("deleted");
  });
});
