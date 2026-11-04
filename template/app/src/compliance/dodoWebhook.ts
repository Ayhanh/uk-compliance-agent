import express from "express";
import { env, type MiddlewareConfigFn } from "wasp/server";
import type { DodoWebhook } from "wasp/server/api";
import { UnhandledWebhookEventError } from "../payment/errors";
import { processWebhookEventOnce } from "../payment/processedWebhookEvent";
import {
  getPlanKeyByDodoProductId,
  verifyDodoWebhookSignature,
  type DodoWebhookEvent,
} from "./dodo";

/** Signature verification needs the unparsed request body. */
export const dodoMiddlewareConfigFn: MiddlewareConfigFn = (config) => {
  config.delete("express.json");
  config.set("express.raw", express.raw({ type: "application/json" }));
  return config;
};

const STATUS_BY_EVENT_TYPE: Record<string, string> = {
  "subscription.active": "active",
  "subscription.renewed": "active",
  "subscription.plan_changed": "active",
  "subscription.updated": "active",
  "subscription.on_hold": "on_hold",
  "subscription.failed": "failed",
  "subscription.cancelled": "cancelled",
  "subscription.expired": "expired",
};

export const dodoWebhook: DodoWebhook = async (request, response, context) => {
  const secret = env.DODO_WEBHOOK_SECRET;
  if (!secret) {
    console.error("DODO_WEBHOOK_SECRET is not configured");
    return response.status(500).json({ error: "Webhook not configured" });
  }

  const rawBody = Buffer.isBuffer(request.body)
    ? request.body.toString("utf8")
    : "";
  if (
    !verifyDodoWebhookSignature({ rawBody, headers: request.headers, secret })
  ) {
    return response.status(400).json({ error: "Invalid signature" });
  }

  try {
    const event = JSON.parse(rawBody) as DodoWebhookEvent;
    const webhookId = request.headers["webhook-id"];
    if (typeof webhookId !== "string") {
      return response.status(400).json({ error: "Missing webhook-id" });
    }

    await processWebhookEventOnce(
      { paymentProcessorEventId: webhookId, eventType: event.type },
      context.entities.ProcessedWebhookEvent,
      () => handleDodoEvent(event, context.entities),
    );
    return response.status(200).json({ received: true });
  } catch (error) {
    if (error instanceof UnhandledWebhookEventError) {
      // Must be 2XX, otherwise Dodo keeps retrying events we do not handle.
      return response.status(200).json({ error: error.message });
    }
    console.error("Dodo webhook error: ", error);
    return response.status(400).json({
      error: error instanceof Error ? error.message : "Webhook failed",
    });
  }
};

async function handleDodoEvent(
  event: DodoWebhookEvent,
  entities: Parameters<DodoWebhook>[2]["entities"],
): Promise<void> {
  const status = STATUS_BY_EVENT_TYPE[event.type];
  if (!status) {
    throw new UnhandledWebhookEventError(event.type);
  }

  const sub = event.data;
  const companyNumber = sub.metadata?.companyNumber;
  if (!companyNumber) {
    throw new Error(
      `Dodo subscription ${sub.subscription_id} has no companyNumber metadata`,
    );
  }

  const company = await entities.Company.findUnique({
    where: { companyNumber },
    select: { companyNumber: true },
  });
  if (!company) {
    throw new Error(`Unknown company ${companyNumber} in Dodo webhook`);
  }

  const fields = {
    companyNumber,
    plan: getPlanKeyByDodoProductId(sub.product_id),
    status,
    currentPeriodStart: toDate(sub.previous_billing_date),
    currentPeriodEnd: toDate(sub.next_billing_date),
    cancelAtPeriodEnd: sub.cancel_at_next_billing_date ?? false,
    cancelledAt:
      status === "cancelled"
        ? toDate(sub.cancelled_at) ?? new Date()
        : toDate(sub.cancelled_at),
  };

  await entities.CompanySubscription.upsert({
    where: { dodoSubscriptionId: sub.subscription_id },
    create: { dodoSubscriptionId: sub.subscription_id, ...fields },
    update: fields,
  });
}

function toDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}
