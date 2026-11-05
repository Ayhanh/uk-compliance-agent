import { registerJob } from 'wasp/server/jobs/core/pgBoss'
import { syncAllCompaniesJob } from "../../../../../src/compliance/syncJob"
import { syncAllCompaniesJob as _waspJobDefinition } from "wasp/server/jobs"

registerJob({
  job: _waspJobDefinition,
  jobFn: syncAllCompaniesJob,
})
