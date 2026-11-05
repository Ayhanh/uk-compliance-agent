/**
 * Declares the virtual user modules the SDK imports.
 * 
 * The types are written as inline `import("...")` types on purpose.
 * Ambient module declarations can't reach another module through a
 * relative import statement (TS2439).
 */

declare module "virtual:wasp/user/env" {
  export const clientEnvValidationSchema: import("./client/env/schema").RegisteredClientEnvValidationSchema;
}

declare module "virtual:wasp/user/env" {
  export const serverEnvValidationSchema: import("./server/env").RegisteredServerEnvValidationSchema;
}

declare module "virtual:wasp/user/user/operations" {
  export const getPaginatedUsers: import("./server/operations/queries/index").RegisteredGetPaginatedUsers;
}

declare module "virtual:wasp/user/compliance/operations" {
  export const getMyCompanies: import("./server/operations/queries/index").RegisteredGetMyCompanies;
}

declare module "virtual:wasp/user/compliance/operations" {
  export const getCompanyDetail: import("./server/operations/queries/index").RegisteredGetCompanyDetail;
}

declare module "virtual:wasp/user/demo-ai-app/operations" {
  export const getGptResponses: import("./server/operations/queries/index").RegisteredGetGptResponses;
}

declare module "virtual:wasp/user/demo-ai-app/operations" {
  export const getAllTasksByUser: import("./server/operations/queries/index").RegisteredGetAllTasksByUser;
}

declare module "virtual:wasp/user/payment/operations" {
  export const getCustomerPortalUrl: import("./server/operations/queries/index").RegisteredGetCustomerPortalUrl;
}

declare module "virtual:wasp/user/file-upload/operations" {
  export const getAllFilesByUser: import("./server/operations/queries/index").RegisteredGetAllFilesByUser;
}

declare module "virtual:wasp/user/file-upload/operations" {
  export const getDownloadFileSignedURL: import("./server/operations/queries/index").RegisteredGetDownloadFileSignedURL;
}

declare module "virtual:wasp/user/analytics/operations" {
  export const getDailyStats: import("./server/operations/queries/index").RegisteredGetDailyStats;
}

declare module "virtual:wasp/user/user/operations" {
  export const updateIsUserAdminById: import("./server/operations/actions/index").RegisteredUpdateIsUserAdminById;
}

declare module "virtual:wasp/user/compliance/operations" {
  export const addCompany: import("./server/operations/actions/index").RegisteredAddCompany;
}

declare module "virtual:wasp/user/compliance/operations" {
  export const triggerCompanySync: import("./server/operations/actions/index").RegisteredTriggerCompanySync;
}

declare module "virtual:wasp/user/compliance/operations" {
  export const createCompanyCheckout: import("./server/operations/actions/index").RegisteredCreateCompanyCheckout;
}

declare module "virtual:wasp/user/demo-ai-app/operations" {
  export const generateGptResponse: import("./server/operations/actions/index").RegisteredGenerateGptResponse;
}

declare module "virtual:wasp/user/demo-ai-app/operations" {
  export const createTask: import("./server/operations/actions/index").RegisteredCreateTask;
}

declare module "virtual:wasp/user/demo-ai-app/operations" {
  export const updateTask: import("./server/operations/actions/index").RegisteredUpdateTask;
}

declare module "virtual:wasp/user/demo-ai-app/operations" {
  export const deleteTask: import("./server/operations/actions/index").RegisteredDeleteTask;
}

declare module "virtual:wasp/user/payment/operations" {
  export const generateCheckoutSession: import("./server/operations/actions/index").RegisteredGenerateCheckoutSession;
}

declare module "virtual:wasp/user/file-upload/operations" {
  export const addFileToDb: import("./server/operations/actions/index").RegisteredAddFileToDb;
}

declare module "virtual:wasp/user/file-upload/operations" {
  export const createFileUploadUrl: import("./server/operations/actions/index").RegisteredCreateFileUploadUrl;
}

declare module "virtual:wasp/user/file-upload/operations" {
  export const deleteFile: import("./server/operations/actions/index").RegisteredDeleteFile;
}
