import * as z from "zod";

export const complianceServicesEnvSchema = z.object({
  COMPANIES_HOUSE_API_KEY: z.string().min(1, {
    error:
      "COMPANIES_HOUSE_API_KEY is required for Companies House integration",
  }),
  GEMINI_API_KEY: z.string().min(1, {
    error: "GEMINI_API_KEY is required for compliance analysis",
  }),
  GEMINI_MODEL: z.string().min(1).default("gemini-3.8-flash"),
  THE_GAZETTE_API_BASE_URL: z
    .string()
    .url()
    .default("https://www.thegazette.co.uk"),
});
