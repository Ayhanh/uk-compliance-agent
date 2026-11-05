import { registerJob } from 'wasp/server/jobs/core/pgBoss'
import { calculateDailyStatsJob } from "../../../../../src/analytics/stats"
import { calculateDailyStatsJob as _waspJobDefinition } from "wasp/server/jobs"

registerJob({
  job: _waspJobDefinition,
  jobFn: calculateDailyStatsJob,
})
