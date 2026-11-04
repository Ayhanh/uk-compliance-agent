import type { SyncAllCompaniesJob } from "wasp/server/jobs";
import { syncCompany } from "./syncCompany";

/**
 * Scheduled sync of every company. Companies without an active subscription
 * or trial are skipped inside `syncCompany`. A failure in one company never
 * stops the others.
 */
export const syncAllCompaniesJob: SyncAllCompaniesJob<
  never,
  { synced: number; skipped: number; failed: number }
> = async (_args, context) => {
  const companies = await context.entities.Company.findMany({
    select: { companyNumber: true },
  });

  const totals = { synced: 0, skipped: 0, failed: 0 };
  for (const { companyNumber } of companies) {
    try {
      const result = await syncCompany(context.entities, companyNumber);
      if (result.skipped) totals.skipped += 1;
      else totals.synced += 1;
    } catch (error) {
      totals.failed += 1;
      console.error(`Scheduled sync failed for ${companyNumber}:`, error);
    }
  }
  console.info("Compliance sync finished:", totals);
  return totals;
};
