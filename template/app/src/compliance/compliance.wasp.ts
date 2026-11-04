import { action, api, job, page, query, route, type Spec } from "@wasp.sh/spec";

import { CompaniesPage } from "./CompaniesPage" with { type: "ref" };
import { CompanyDetailPage } from "./CompanyDetailPage" with { type: "ref" };
import {
  dodoMiddlewareConfigFn,
  dodoWebhook,
} from "./dodoWebhook" with { type: "ref" };
import {
  addCompany,
  createCompanyCheckout,
  getCompanyDetail,
  getMyCompanies,
  triggerCompanySync,
} from "./operations" with { type: "ref" };
import { syncAllCompaniesJob } from "./syncJob" with { type: "ref" };

const companyEntities = [
  "Company",
  "CompanyMembership",
  "CompanySubscription",
  "CompanyIntegrationSync",
  "ComplianceEvent",
  "RiskAssessment",
] as const;

export const complianceSpec: Spec = [
  route(
    "CompaniesRoute",
    "/companies",
    page(CompaniesPage, { authRequired: true }),
  ),
  route(
    "CompanyDetailRoute",
    "/companies/:companyNumber",
    page(CompanyDetailPage, { authRequired: true }),
  ),

  query(getMyCompanies, { entities: [...companyEntities] }),
  query(getCompanyDetail, { entities: [...companyEntities] }),
  action(addCompany, { entities: [...companyEntities] }),
  action(triggerCompanySync, { entities: [...companyEntities] }),
  action(createCompanyCheckout, { entities: [...companyEntities] }),

  api("POST", "/dodo-webhook", dodoWebhook, {
    entities: ["Company", "CompanySubscription", "ProcessedWebhookEvent"],
    middlewareConfigFn: dodoMiddlewareConfigFn,
  }),

  job(syncAllCompaniesJob, {
    executor: "PgBoss",
    schedule: { cron: "0 */6 * * *" }, // Every 6 hours.
    entities: [...companyEntities],
  }),
];
