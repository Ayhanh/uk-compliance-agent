import { prisma } from '../index.js'
import type { JSONValue, JSONObject } from '../../core/serialization/index.js'
import { type JobFn, createJobDefinition } from './core/pgBoss/index.js'

const entities = {
  Company: prisma.company,
  CompanyMembership: prisma.companyMembership,
  CompanySubscription: prisma.companySubscription,
  CompanyIntegrationSync: prisma.companyIntegrationSync,
  ComplianceEvent: prisma.complianceEvent,
  RiskAssessment: prisma.riskAssessment,
}

// PUBLIC API
export type SyncAllCompaniesJob<Input extends JSONObject, Output extends JSONValue | void> = JobFn<Input, Output, typeof entities>

const jobSchedule = {
  cron: "0 */6 * * *",
  options: {},
}

// PUBLIC API
export const syncAllCompaniesJob = createJobDefinition({
  jobName: 'syncAllCompaniesJob',
  defaultJobOptions: {},
  jobSchedule,
  entities,
})
