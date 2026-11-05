import type { ActionFor } from '@wasp.sh/lib-sdk-core/browser'
import { createAction } from "./core";
import type {
  RegisteredUpdateIsUserAdminById,
  RegisteredAddCompany,
  RegisteredTriggerCompanySync,
  RegisteredCreateCompanyCheckout,
  RegisteredGenerateGptResponse,
  RegisteredCreateTask,
  RegisteredUpdateTask,
  RegisteredDeleteTask,
  RegisteredGenerateCheckoutSession,
  RegisteredAddFileToDb,
  RegisteredCreateFileUploadUrl,
  RegisteredDeleteFile,
} from "../../../server/operations/actions/index";

// PUBLIC API
export const updateIsUserAdminById: ActionFor<RegisteredUpdateIsUserAdminById> = createAction<RegisteredUpdateIsUserAdminById>(
  "operations/update-is-user-admin-by-id",
  ["User"],
)

// PUBLIC API
export const addCompany: ActionFor<RegisteredAddCompany> = createAction<RegisteredAddCompany>(
  "operations/add-company",
  ["Company", "CompanyMembership", "CompanySubscription", "CompanyIntegrationSync", "ComplianceEvent", "RiskAssessment"],
)

// PUBLIC API
export const triggerCompanySync: ActionFor<RegisteredTriggerCompanySync> = createAction<RegisteredTriggerCompanySync>(
  "operations/trigger-company-sync",
  ["Company", "CompanyMembership", "CompanySubscription", "CompanyIntegrationSync", "ComplianceEvent", "RiskAssessment"],
)

// PUBLIC API
export const createCompanyCheckout: ActionFor<RegisteredCreateCompanyCheckout> = createAction<RegisteredCreateCompanyCheckout>(
  "operations/create-company-checkout",
  ["Company", "CompanyMembership", "CompanySubscription", "CompanyIntegrationSync", "ComplianceEvent", "RiskAssessment"],
)

// PUBLIC API
export const generateGptResponse: ActionFor<RegisteredGenerateGptResponse> = createAction<RegisteredGenerateGptResponse>(
  "operations/generate-gpt-response",
  ["User", "Task", "GptResponse"],
)

// PUBLIC API
export const createTask: ActionFor<RegisteredCreateTask> = createAction<RegisteredCreateTask>(
  "operations/create-task",
  ["Task"],
)

// PUBLIC API
export const updateTask: ActionFor<RegisteredUpdateTask> = createAction<RegisteredUpdateTask>(
  "operations/update-task",
  ["Task"],
)

// PUBLIC API
export const deleteTask: ActionFor<RegisteredDeleteTask> = createAction<RegisteredDeleteTask>(
  "operations/delete-task",
  ["Task"],
)

// PUBLIC API
export const generateCheckoutSession: ActionFor<RegisteredGenerateCheckoutSession> = createAction<RegisteredGenerateCheckoutSession>(
  "operations/generate-checkout-session",
  ["User"],
)

// PUBLIC API
export const addFileToDb: ActionFor<RegisteredAddFileToDb> = createAction<RegisteredAddFileToDb>(
  "operations/add-file-to-db",
  ["User", "File"],
)

// PUBLIC API
export const createFileUploadUrl: ActionFor<RegisteredCreateFileUploadUrl> = createAction<RegisteredCreateFileUploadUrl>(
  "operations/create-file-upload-url",
  ["User", "File"],
)

// PUBLIC API
export const deleteFile: ActionFor<RegisteredDeleteFile> = createAction<RegisteredDeleteFile>(
  "operations/delete-file",
  ["User", "File"],
)
