import { ComplianceProvider, RiskSeverity } from "@prisma/client";
import { env, type PrismaClient } from "wasp/server";
import { computeAccess } from "./access";
import { dispatchAlert, isAlertSeverity } from "./notifications";
import { fetchCompanyProfile } from "../services/companiesHouse";
import { ExternalApiError } from "../services/apiErrors";
import { analyzeComplianceEvent } from "../services/geminiCompliance";
import { fetchGazetteNoticesForCompany } from "../services/theGazette";

export interface SyncEntities {
  Company: PrismaClient["company"];
  ComplianceEvent: PrismaClient["complianceEvent"];
  RiskAssessment: PrismaClient["riskAssessment"];
  CompanyIntegrationSync: PrismaClient["companyIntegrationSync"];
  CompanySubscription: PrismaClient["companySubscription"];
  CompanyMembership: PrismaClient["companyMembership"];
}

export interface SyncResult {
  skipped?: "no_access" | "throttled" | "not_found";
  newEvents: number;
  newAssessments: number;
  alertsSent: number;
  errors: string[];
}

// Bounds Gemini spend per sync run.
const MAX_ANALYSES_PER_RUN = 5;

/**
 * Pulls the latest Gazette notices and Companies House status for one
 * company, runs Gemini analysis on new events and alerts on HIGH/CRITICAL
 * results. Each stage isolates its own failures so one bad upstream call does
 * not abort the rest.
 */
export async function syncCompany(
  entities: SyncEntities,
  companyNumber: string,
  options: { minIntervalSeconds?: number } = {},
): Promise<SyncResult> {
  const result: SyncResult = {
    newEvents: 0,
    newAssessments: 0,
    alertsSent: 0,
    errors: [],
  };

  const company = await entities.Company.findUnique({
    where: { companyNumber },
    include: { subscriptions: true },
  });
  if (!company) return { ...result, skipped: "not_found" };

  const access = computeAccess({
    trialEndsAt: company.trialEndsAt,
    subscriptions: company.subscriptions,
  });
  if (!access.hasAccess) return { ...result, skipped: "no_access" };

  const syncKey = {
    companyNumber_provider: {
      companyNumber,
      provider: ComplianceProvider.THE_GAZETTE,
    },
  };
  const previousSync = await entities.CompanyIntegrationSync.findUnique({
    where: syncKey,
  });
  const attemptStartedAt = new Date();
  if (
    options.minIntervalSeconds &&
    previousSync?.lastAttemptedAt &&
    attemptStartedAt.getTime() - previousSync.lastAttemptedAt.getTime() <
      options.minIntervalSeconds * 1000
  ) {
    return { ...result, skipped: "throttled" };
  }
  await entities.CompanyIntegrationSync.upsert({
    where: syncKey,
    create: {
      companyNumber,
      provider: ComplianceProvider.THE_GAZETTE,
      lastAttemptedAt: attemptStartedAt,
    },
    update: { lastAttemptedAt: attemptStartedAt },
  });

  let companyName = company.name;
  let registrationStatus = company.registrationStatus;

  // Stage 1: Companies House profile; a status change becomes an event.
  try {
    const profile = await fetchCompanyProfile(companyNumber);
    companyName = profile.name;
    if (profile.registrationStatus !== company.registrationStatus) {
      registrationStatus = profile.registrationStatus;
      const created = await upsertEvent(entities, {
        provider: ComplianceProvider.COMPANIES_HOUSE,
        externalId: `${companyNumber}:status:${profile.registrationStatus}`,
        companyNumber,
        title: `Company status changed from "${company.registrationStatus}" to "${profile.registrationStatus}"`,
        sourceUrl: `https://find-and-update.company-information.service.gov.uk/company/${companyNumber}`,
        publishedAt: new Date(),
        payload: {
          previousStatus: company.registrationStatus,
          newStatus: profile.registrationStatus,
        },
        analysisText: `The Companies House status of ${profile.name} (${companyNumber}) changed from "${company.registrationStatus}" to "${profile.registrationStatus}".`,
      });
      if (created) result.newEvents += 1;
    }
    await entities.Company.update({
      where: { companyNumber },
      data: {
        name: profile.name,
        registrationStatus: profile.registrationStatus,
        sicCodes: profile.sicCodes,
        address: profile.address ?? undefined,
        incorporationDate: profile.incorporationDate,
      },
    });
  } catch (error) {
    result.errors.push(describeError("Companies House", error));
  }

  // Stage 2: Gazette notices.
  let gazetteOk = false;
  try {
    const notices = await fetchGazetteNoticesForCompany({
      companyNumber,
      companyName,
      since: previousSync?.lastSuccessfulSyncAt ?? undefined,
    });
    for (const notice of notices) {
      const created = await upsertEvent(entities, {
        provider: ComplianceProvider.THE_GAZETTE,
        externalId: notice.externalId,
        companyNumber,
        title: notice.title,
        sourceUrl: notice.sourceUrl,
        publishedAt: notice.publishedAt,
        payload: notice.payload,
        analysisText: notice.analysisText,
      });
      if (created) result.newEvents += 1;
    }
    gazetteOk = true;
  } catch (error) {
    result.errors.push(describeError("The Gazette", error));
  }

  await entities.CompanyIntegrationSync.update({
    where: syncKey,
    data: gazetteOk
      ? { lastSuccessfulSyncAt: attemptStartedAt, lastError: null }
      : { lastError: result.errors.join("; ").slice(0, 1000) || null },
  });

  // Stage 3: Gemini analysis for events without an assessment.
  const pendingEvents = await entities.ComplianceEvent.findMany({
    where: { companyNumber, riskAssessments: { none: {} } },
    orderBy: { publishedAt: "desc" },
    take: MAX_ANALYSES_PER_RUN,
  });
  for (const event of pendingEvents) {
    try {
      const analysis = await analyzeComplianceEvent(event, {
        companyNumber,
        name: companyName,
        registrationStatus,
        sicCodes: company.sicCodes,
        incorporationDate: company.incorporationDate,
      });
      await entities.RiskAssessment.create({
        data: {
          companyNumber,
          complianceEventId: event.id,
          severity: analysis.severity,
          summary: analysis.summary,
          rationale: analysis.rationale,
          recommendedActions: analysis.recommendedActions,
          modelVersion: analysis.modelVersion,
          analyzedAt: analysis.analyzedAt,
        },
      });
      result.newAssessments += 1;
    } catch (error) {
      result.errors.push(describeError("Gemini", error));
      if (error instanceof ExternalApiError && error.code === "rate_limited") {
        break;
      }
    }
  }

  // Stage 4: alerts, including earlier ones that failed to send.
  try {
    result.alertsSent = await sendPendingAlerts(entities, {
      companyNumber,
      companyName,
    });
  } catch (error) {
    result.errors.push(describeError("Notifications", error));
  }

  return result;
}

async function upsertEvent(
  entities: SyncEntities,
  data: {
    provider: ComplianceProvider;
    externalId: string;
    companyNumber: string;
    title: string;
    sourceUrl: string | null;
    publishedAt: Date | null;
    payload: unknown;
    analysisText: string;
  },
): Promise<boolean> {
  const existing = await entities.ComplianceEvent.findUnique({
    where: {
      provider_externalId: {
        provider: data.provider,
        externalId: data.externalId,
      },
    },
    select: { id: true },
  });
  if (existing) return false;
  await entities.ComplianceEvent.create({
    data: { ...data, payload: data.payload as object },
  });
  return true;
}

async function sendPendingAlerts(
  entities: SyncEntities,
  company: { companyNumber: string; companyName: string },
): Promise<number> {
  const pending = await entities.RiskAssessment.findMany({
    where: {
      companyNumber: company.companyNumber,
      notifiedAt: null,
      severity: { in: [RiskSeverity.HIGH, RiskSeverity.CRITICAL] },
    },
    include: { complianceEvent: true },
    orderBy: { analyzedAt: "asc" },
  });
  if (pending.length === 0) return 0;

  const members = await entities.CompanyMembership.findMany({
    where: { companyNumber: company.companyNumber },
    include: { user: { select: { email: true } } },
  });
  const recipients = members
    .map((member) => member.user.email)
    .filter((email): email is string => Boolean(email));

  let sent = 0;
  for (const assessment of pending) {
    if (!isAlertSeverity(assessment.severity)) continue;
    const delivered = await dispatchAlert(recipients, {
      companyNumber: company.companyNumber,
      companyName: company.companyName,
      severity: assessment.severity,
      eventTitle: assessment.complianceEvent.title,
      summary: assessment.summary,
      recommendedActions: assessment.recommendedActions,
      sourceUrl: assessment.complianceEvent.sourceUrl,
      dashboardUrl: `${env.WASP_WEB_CLIENT_URL}/companies/${company.companyNumber}`,
    });
    if (delivered) {
      await entities.RiskAssessment.update({
        where: { id: assessment.id },
        data: { notifiedAt: new Date() },
      });
      sent += 1;
    }
  }
  return sent;
}

function describeError(stage: string, error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Sync stage "${stage}" failed:`, error);
  return message.startsWith(stage) ? message : `${stage}: ${message}`;
}
