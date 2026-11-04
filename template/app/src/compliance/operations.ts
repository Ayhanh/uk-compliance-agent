import { env, HttpError, type PrismaClient } from "wasp/server";
import type {
  Company,
  CompanyIntegrationSync,
  CompanySubscription,
  ComplianceEvent,
  RiskAssessment,
} from "wasp/entities";
import type {
  AddCompany,
  CreateCompanyCheckout,
  GetCompanyDetail,
  GetMyCompanies,
  TriggerCompanySync,
} from "wasp/server/operations";
import * as z from "zod";
import { ensureArgsSchemaOrThrowHttpError } from "../server/validation";
import { ExternalApiError } from "../services/apiErrors";
import { fetchCompanyProfile } from "../services/companiesHouse";
import { addTrialDays, computeAccess, type AccessState } from "./access";
import { createDodoCheckoutSession } from "./dodo";
import { syncCompany } from "./syncCompany";

const companyNumberSchema = z
  .string()
  .trim()
  .min(1, "Company number is required")
  .max(12)
  .regex(
    /^[A-Za-z0-9 ]+$/,
    "Company number may only contain letters and digits",
  );

const companyArgsSchema = z.object({ companyNumber: companyNumberSchema });

const checkoutArgsSchema = z.object({
  companyNumber: companyNumberSchema,
  plan: z.enum(["STARTER", "PRO"]),
});

const MANUAL_SYNC_MIN_INTERVAL_SECONDS = 60;

function requireUser<
  T extends { user?: { id: string; email?: string | null } },
>(context: T): NonNullable<T["user"]> {
  if (!context.user) {
    throw new HttpError(
      401,
      "Only authenticated users are allowed to perform this operation",
    );
  }
  return context.user as NonNullable<T["user"]>;
}

function normalize(companyNumber: string): string {
  return companyNumber.replace(/\s+/g, "").toUpperCase();
}

function toHttpError(error: unknown): never {
  if (error instanceof HttpError) throw error;
  if (error instanceof ExternalApiError) {
    switch (error.code) {
      case "not_found":
        throw new HttpError(404, "Company not found at Companies House");
      case "invalid_input":
        throw new HttpError(400, error.message);
      case "rate_limited":
        throw new HttpError(
          429,
          `Upstream rate limit reached. Try again${
            error.retryAfterSeconds
              ? ` in ${error.retryAfterSeconds}s`
              : " shortly"
          }.`,
        );
      default:
        console.error(error);
        throw new HttpError(
          502,
          "An upstream data provider failed. Try again later.",
        );
    }
  }
  throw error;
}

async function requireMembership(
  membershipDelegate: PrismaClient["companyMembership"],
  userId: string,
  companyNumber: string,
) {
  const membership = await membershipDelegate.findUnique({
    where: { userId_companyNumber: { userId, companyNumber } },
  });
  if (!membership) {
    throw new HttpError(404, "Company not found");
  }
  return membership;
}

export type CompanySummary = {
  companyNumber: string;
  name: string;
  registrationStatus: string;
  role: "OWNER" | "ADMIN" | "MEMBER";
  access: AccessState;
  openHighRiskCount: number;
  lastSuccessfulSyncAt: Date | null;
};

export const getMyCompanies: GetMyCompanies<void, CompanySummary[]> = async (
  _args,
  context,
) => {
  const user = requireUser(context);
  const memberships = await context.entities.CompanyMembership.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "asc" },
    include: {
      company: {
        include: {
          subscriptions: true,
          integrationSyncs: true,
          riskAssessments: {
            where: { severity: { in: ["HIGH", "CRITICAL"] } },
            select: { id: true },
          },
        },
      },
    },
  });

  return memberships.map(({ company, role }) => ({
    companyNumber: company.companyNumber,
    name: company.name,
    registrationStatus: company.registrationStatus,
    role,
    access: computeAccess({
      trialEndsAt: company.trialEndsAt,
      subscriptions: company.subscriptions,
    }),
    openHighRiskCount: company.riskAssessments.length,
    lastSuccessfulSyncAt:
      company.integrationSyncs
        .map((sync) => sync.lastSuccessfulSyncAt)
        .filter((date): date is Date => date !== null)
        .sort((a, b) => b.getTime() - a.getTime())[0] ?? null,
  }));
};

export const addCompany: AddCompany<
  { companyNumber: string },
  { companyNumber: string }
> = async (rawArgs, context) => {
  const user = requireUser(context);
  const { companyNumber: rawNumber } = ensureArgsSchemaOrThrowHttpError(
    companyArgsSchema,
    rawArgs,
  );

  let profile;
  try {
    profile = await fetchCompanyProfile(normalize(rawNumber));
  } catch (error) {
    toHttpError(error);
  }

  const existing = await context.entities.Company.findUnique({
    where: { companyNumber: profile.companyNumber },
    select: { companyNumber: true },
  });
  const profileData = {
    name: profile.name,
    registrationStatus: profile.registrationStatus,
    sicCodes: profile.sicCodes,
    address: profile.address ?? undefined,
    incorporationDate: profile.incorporationDate,
  };
  if (existing) {
    await context.entities.Company.update({
      where: { companyNumber: profile.companyNumber },
      data: profileData,
    });
  } else {
    await context.entities.Company.create({
      data: {
        companyNumber: profile.companyNumber,
        ...profileData,
        trialEndsAt: addTrialDays(new Date()),
      },
    });
  }

  const hasOwner = await context.entities.CompanyMembership.findFirst({
    where: { companyNumber: profile.companyNumber, role: "OWNER" },
    select: { id: true },
  });
  await context.entities.CompanyMembership.upsert({
    where: {
      userId_companyNumber: {
        userId: user.id,
        companyNumber: profile.companyNumber,
      },
    },
    create: {
      userId: user.id,
      companyNumber: profile.companyNumber,
      role: hasOwner ? "MEMBER" : "OWNER",
    },
    update: {},
  });

  return { companyNumber: profile.companyNumber };
};

export type CompanyDetail = {
  company: Company;
  role: "OWNER" | "ADMIN" | "MEMBER";
  access: AccessState;
  subscriptions: CompanySubscription[];
  syncs: CompanyIntegrationSync[];
  events: (ComplianceEvent & { riskAssessments: RiskAssessment[] })[];
};

export const getCompanyDetail: GetCompanyDetail<
  { companyNumber: string },
  CompanyDetail
> = async (rawArgs, context) => {
  const user = requireUser(context);
  const { companyNumber: rawNumber } = ensureArgsSchemaOrThrowHttpError(
    companyArgsSchema,
    rawArgs,
  );
  const companyNumber = normalize(rawNumber);
  const membership = await requireMembership(
    context.entities.CompanyMembership,
    user.id,
    companyNumber,
  );

  const company = await context.entities.Company.findUniqueOrThrow({
    where: { companyNumber },
    include: {
      subscriptions: { orderBy: { createdAt: "desc" } },
      integrationSyncs: true,
    },
  });
  const events = await context.entities.ComplianceEvent.findMany({
    where: { companyNumber },
    orderBy: [{ publishedAt: "desc" }, { fetchedAt: "desc" }],
    take: 50,
    include: {
      riskAssessments: { orderBy: { analyzedAt: "desc" }, take: 1 },
    },
  });

  const { subscriptions, integrationSyncs, ...profile } = company;
  return {
    company: profile,
    role: membership.role,
    access: computeAccess({
      trialEndsAt: company.trialEndsAt,
      subscriptions,
    }),
    subscriptions,
    syncs: integrationSyncs,
    events,
  };
};

export const triggerCompanySync: TriggerCompanySync<
  { companyNumber: string },
  {
    newEvents: number;
    newAssessments: number;
    alertsSent: number;
    errors: string[];
  }
> = async (rawArgs, context) => {
  const user = requireUser(context);
  const { companyNumber: rawNumber } = ensureArgsSchemaOrThrowHttpError(
    companyArgsSchema,
    rawArgs,
  );
  const companyNumber = normalize(rawNumber);
  await requireMembership(
    context.entities.CompanyMembership,
    user.id,
    companyNumber,
  );

  const result = await syncCompany(context.entities, companyNumber, {
    minIntervalSeconds: MANUAL_SYNC_MIN_INTERVAL_SECONDS,
  });
  if (result.skipped === "no_access") {
    throw new HttpError(
      402,
      "An active subscription or trial is required to run compliance scans.",
    );
  }
  if (result.skipped === "throttled") {
    throw new HttpError(
      429,
      `A sync ran recently. Wait ${MANUAL_SYNC_MIN_INTERVAL_SECONDS} seconds before syncing again.`,
    );
  }
  if (result.skipped === "not_found") {
    throw new HttpError(404, "Company not found");
  }
  return result;
};

export const createCompanyCheckout: CreateCompanyCheckout<
  { companyNumber: string; plan: "STARTER" | "PRO" },
  { checkoutUrl: string }
> = async (rawArgs, context) => {
  const user = requireUser(context);
  const args = ensureArgsSchemaOrThrowHttpError(checkoutArgsSchema, rawArgs);
  const companyNumber = normalize(args.companyNumber);
  const membership = await requireMembership(
    context.entities.CompanyMembership,
    user.id,
    companyNumber,
  );
  if (membership.role === "MEMBER") {
    throw new HttpError(
      403,
      "Only company owners and admins can manage billing.",
    );
  }
  if (!user.email) {
    throw new HttpError(403, "An email address is required to subscribe.");
  }

  try {
    const session = await createDodoCheckoutSession({
      plan: args.plan,
      companyNumber,
      customerEmail: user.email,
      returnUrl: `${env.WASP_WEB_CLIENT_URL}/companies/${companyNumber}?checkout=success`,
    });
    return { checkoutUrl: session.checkoutUrl };
  } catch (error) {
    if (error instanceof ExternalApiError) toHttpError(error);
    console.error(error);
    throw new HttpError(
      500,
      "Could not start checkout. Billing may not be configured.",
    );
  }
};
