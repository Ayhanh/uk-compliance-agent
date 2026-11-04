import * as z from "zod";

// Billing and notification settings are optional at boot so the app can start
// in development. Each feature fails with a clear error when it is used
// without its configuration.
export const complianceBillingEnvSchema = z.object({
  DODO_PAYMENTS_API_KEY: z.string().min(1).optional(),
  DODO_WEBHOOK_SECRET: z.string().min(1).optional(),
  DODO_ENVIRONMENT: z.enum(["test_mode", "live_mode"]).default("test_mode"),
  DODO_STARTER_PLAN_ID: z.string().min(1).optional(),
  DODO_PRO_PLAN_ID: z.string().min(1).optional(),
  TELEGRAM_BOT_TOKEN: z.string().min(1).optional(),
  MY_TELEGRAM_ID: z.string().min(1).optional(),
});
