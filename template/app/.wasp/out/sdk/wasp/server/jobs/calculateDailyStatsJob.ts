import { prisma } from '../index.js'
import type { JSONValue, JSONObject } from '../../core/serialization/index.js'
import { type JobFn, createJobDefinition } from './core/pgBoss/index.js'

const entities = {
  User: prisma.user,
  DailyStats: prisma.dailyStats,
  Logs: prisma.logs,
  PageViewSource: prisma.pageViewSource,
}

// PUBLIC API
export type CalculateDailyStatsJob<Input extends JSONObject, Output extends JSONValue | void> = JobFn<Input, Output, typeof entities>

const jobSchedule = {
  cron: "0 * * * *",
  options: {},
}

// PUBLIC API
export const calculateDailyStatsJob = createJobDefinition({
  jobName: 'calculateDailyStatsJob',
  defaultJobOptions: {},
  jobSchedule,
  entities,
})
