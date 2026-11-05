/**
 * This module augments SDK's `Register` type with the user project types.
 */

// The import ensures the module is always loaded into the bundle.
// Otherwise, module augmentation can fail if it wasn't loaded.
import "wasp/types"

declare module "wasp/types" {
  interface Register {
    serverEnvValidationSchema: typeof import("../../../../../src/env").serverEnvValidationSchema
    clientEnvValidationSchema: typeof import("../../../../../src/env").clientEnvValidationSchema
    emailUserSignupFields: typeof import("../../../../../src/auth/userSignupFields").getEmailUserFields
    operations: {
      'getPaginatedUsers': typeof import("../../../../../src/user/operations").getPaginatedUsers
      'getMyCompanies': typeof import("../../../../../src/compliance/operations").getMyCompanies
      'getCompanyDetail': typeof import("../../../../../src/compliance/operations").getCompanyDetail
      'getGptResponses': typeof import("../../../../../src/demo-ai-app/operations").getGptResponses
      'getAllTasksByUser': typeof import("../../../../../src/demo-ai-app/operations").getAllTasksByUser
      'getCustomerPortalUrl': typeof import("../../../../../src/payment/operations").getCustomerPortalUrl
      'getAllFilesByUser': typeof import("../../../../../src/file-upload/operations").getAllFilesByUser
      'getDownloadFileSignedURL': typeof import("../../../../../src/file-upload/operations").getDownloadFileSignedURL
      'getDailyStats': typeof import("../../../../../src/analytics/operations").getDailyStats
      'updateIsUserAdminById': typeof import("../../../../../src/user/operations").updateIsUserAdminById
      'addCompany': typeof import("../../../../../src/compliance/operations").addCompany
      'triggerCompanySync': typeof import("../../../../../src/compliance/operations").triggerCompanySync
      'createCompanyCheckout': typeof import("../../../../../src/compliance/operations").createCompanyCheckout
      'generateGptResponse': typeof import("../../../../../src/demo-ai-app/operations").generateGptResponse
      'createTask': typeof import("../../../../../src/demo-ai-app/operations").createTask
      'updateTask': typeof import("../../../../../src/demo-ai-app/operations").updateTask
      'deleteTask': typeof import("../../../../../src/demo-ai-app/operations").deleteTask
      'generateCheckoutSession': typeof import("../../../../../src/payment/operations").generateCheckoutSession
      'addFileToDb': typeof import("../../../../../src/file-upload/operations").addFileToDb
      'createFileUploadUrl': typeof import("../../../../../src/file-upload/operations").createFileUploadUrl
      'deleteFile': typeof import("../../../../../src/file-upload/operations").deleteFile
    }
    crudOverrides: {
    }
  }
}
