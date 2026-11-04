import { createHmac, timingSafeEqual } from "node:crypto";
import { env } from "wasp/server";
import { fetchJson } from "../services/apiErrors";

export type DodoPlanKey = "STARTER" | "PRO";

const WEBHOOK_TOLERANCE_SECONDS = 5 * 60;

export function getDodoPlanId(plan: DodoPlanKey): string | undefined {
  return plan === "PRO" ? env.DODO_PRO_PLAN_ID : env.DODO_STARTER_PLAN_ID;
}

/** Reverse lookup so webhook product ids map back to a plan name. */
export function getPlanKeyByDodoProductId(
  productId: string | undefined,
): string {
  if (productId && productId === env.DODO_PRO_PLAN_ID) return "PRO";
  if (productId && productId === env.DODO_STARTER_PLAN_ID) return "STARTER";
  return productId ?? "UNKNOWN";
}

function dodoBaseUrl(): string {
  return env.DODO_ENVIRONMENT === "live_mode"
    ? "https://live.dodopayments.com"
    : "https://test.dodopayments.com";
}

interface CheckoutArgs {
  plan: DodoPlanKey;
  companyNumber: string;
  customerEmail: string;
  returnUrl: string;
}

/**
 * Creates a Dodo hosted checkout session. The company number travels in the
 * metadata so the webhook can attach the subscription to the right company.
 */
export async function createDodoCheckoutSession(
  args: CheckoutArgs,
): Promise<{ sessionId: string; checkoutUrl: string }> {
  const apiKey = env.DODO_PAYMENTS_API_KEY;
  const productId = getDodoPlanId(args.plan);
  if (!apiKey || !productId) {
    throw new Error(
      `Dodo Payments is not configured for plan ${args.plan}. Set DODO_PAYMENTS_API_KEY and the plan id.`,
    );
  }

  const data = (await fetchJson(
    "Dodo Payments",
    new URL("/checkouts", dodoBaseUrl()),
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_cart: [{ product_id: productId, quantity: 1 }],
        customer: { email: args.customerEmail },
        metadata: { companyNumber: args.companyNumber },
        return_url: args.returnUrl,
      }),
    },
  )) as { session_id?: string; checkout_url?: string | null };

  if (!data?.session_id || !data.checkout_url) {
    throw new Error("Dodo Payments returned no checkout URL");
  }
  return { sessionId: data.session_id, checkoutUrl: data.checkout_url };
}

/**
 * Verifies a Standard Webhooks signature (used by Dodo Payments).
 * Signed content is `${webhook-id}.${webhook-timestamp}.${rawBody}` with an
 * HMAC-SHA256 keyed by the base64 part of the `whsec_` secret.
 */
export function verifyDodoWebhookSignature(params: {
  rawBody: string;
  headers: Record<string, string | string[] | undefined>;
  secret: string;
  now?: Date;
}): boolean {
  const id = headerValue(params.headers["webhook-id"]);
  const timestamp = headerValue(params.headers["webhook-timestamp"]);
  const signatureHeader = headerValue(params.headers["webhook-signature"]);
  if (!id || !timestamp || !signatureHeader) return false;

  const timestampSeconds = Number(timestamp);
  const nowSeconds = Math.floor((params.now ?? new Date()).getTime() / 1000);
  if (
    !Number.isFinite(timestampSeconds) ||
    Math.abs(nowSeconds - timestampSeconds) > WEBHOOK_TOLERANCE_SECONDS
  ) {
    return false;
  }

  const key = Buffer.from(params.secret.replace(/^whsec_/, ""), "base64");
  const expected = createHmac("sha256", key)
    .update(`${id}.${timestamp}.${params.rawBody}`)
    .digest();

  return signatureHeader.split(" ").some((part) => {
    const [version, signature] = part.split(",");
    if (version !== "v1" || !signature) return false;
    const provided = Buffer.from(signature, "base64");
    return (
      provided.length === expected.length && timingSafeEqual(provided, expected)
    );
  });
}

function headerValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export interface DodoSubscriptionData {
  subscription_id: string;
  status?: string;
  product_id?: string;
  metadata?: Record<string, string> | null;
  next_billing_date?: string | null;
  previous_billing_date?: string | null;
  cancel_at_next_billing_date?: boolean;
  cancelled_at?: string | null;
}

export interface DodoWebhookEvent {
  type: string;
  data: DodoSubscriptionData;
}
