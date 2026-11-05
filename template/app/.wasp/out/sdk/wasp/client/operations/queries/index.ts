import type { QueryFor } from '@wasp.sh/lib-sdk-core/browser'
import { createQuery } from "./core";
import type {
  RegisteredGetPaginatedUsers,
  RegisteredGetMyCompanies,
  RegisteredGetCompanyDetail,
  RegisteredGetGptResponses,
  RegisteredGetAllTasksByUser,
  RegisteredGetCustomerPortalUrl,
  RegisteredGetAllFilesByUser,
  RegisteredGetDownloadFileSignedURL,
  RegisteredGetDailyStats,
} from "../../../server/operations/queries/index";

// PUBLIC API
export const getPaginatedUsers: QueryFor<RegisteredGetPaginatedUsers> = createQuery<RegisteredGetPaginatedUsers>(
  "operations/get-paginated-users",
  ["User"],
)

// PUBLIC API
export const getMyCompanies: QueryFor<RegisteredGetMyCompanies> = createQuery<RegisteredGetMyCompanies>(
  "operations/get-my-companies",
  ["Company", "CompanyMembership", "CompanySubscription", "CompanyIntegrationSync", "ComplianceEvent", "RiskAssessment"],
)

// PUBLIC API
export const getCompanyDetail: QueryFor<RegisteredGetCompanyDetail> = createQuery<RegisteredGetCompanyDetail>(
  "operations/get-company-detail",
  ["Company", "CompanyMembership", "CompanySubscription", "CompanyIntegrationSync", "ComplianceEvent", "RiskAssessment"],
)

// PUBLIC API
export const getGptResponses: QueryFor<RegisteredGetGptResponses> = createQuery<RegisteredGetGptResponses>(
  "operations/get-gpt-responses",
  ["User", "GptResponse"],
)

// PUBLIC API
export const getAllTasksByUser: QueryFor<RegisteredGetAllTasksByUser> = createQuery<RegisteredGetAllTasksByUser>(
  "operations/get-all-tasks-by-user",
  ["Task"],
)

// PUBLIC API
export const getCustomerPortalUrl: QueryFor<RegisteredGetCustomerPortalUrl> = createQuery<RegisteredGetCustomerPortalUrl>(
  "operations/get-customer-portal-url",
  ["User"],
)

// PUBLIC API
export const getAllFilesByUser: QueryFor<RegisteredGetAllFilesByUser> = createQuery<RegisteredGetAllFilesByUser>(
  "operations/get-all-files-by-user",
  ["User", "File"],
)

// PUBLIC API
export const getDownloadFileSignedURL: QueryFor<RegisteredGetDownloadFileSignedURL> = createQuery<RegisteredGetDownloadFileSignedURL>(
  "operations/get-download-file-signed-url",
  ["User", "File"],
)

// PUBLIC API
export const getDailyStats: QueryFor<RegisteredGetDailyStats> = createQuery<RegisteredGetDailyStats>(
  "operations/get-daily-stats",
  ["User", "DailyStats"],
)
