
import { prisma } from '../../index'
import {
  type UnauthenticatedOperationFor,
  createUnauthenticatedOperation,
  type AuthenticatedOperationFor,
  createAuthenticatedOperation,
} from '../wrappers'
import type { FromRegisterPath } from '../../../types/register'
import type {
  GetPaginatedUsers,
  GetMyCompanies,
  GetCompanyDetail,
  GetGptResponses,
  GetAllTasksByUser,
  GetCustomerPortalUrl,
  GetAllFilesByUser,
  GetDownloadFileSignedURL,
  GetDailyStats,
} from './types'
import { getPaginatedUsers as getPaginatedUsers_ext } from "virtual:wasp/user/user/operations"
import { getMyCompanies as getMyCompanies_ext } from "virtual:wasp/user/compliance/operations"
import { getCompanyDetail as getCompanyDetail_ext } from "virtual:wasp/user/compliance/operations"
import { getGptResponses as getGptResponses_ext } from "virtual:wasp/user/demo-ai-app/operations"
import { getAllTasksByUser as getAllTasksByUser_ext } from "virtual:wasp/user/demo-ai-app/operations"
import { getCustomerPortalUrl as getCustomerPortalUrl_ext } from "virtual:wasp/user/payment/operations"
import { getAllFilesByUser as getAllFilesByUser_ext } from "virtual:wasp/user/file-upload/operations"
import { getDownloadFileSignedURL as getDownloadFileSignedURL_ext } from "virtual:wasp/user/file-upload/operations"
import { getDailyStats as getDailyStats_ext } from "virtual:wasp/user/analytics/operations"

// PRIVATE API
export type RegisteredGetPaginatedUsers = FromRegisterPath<['operations', 'getPaginatedUsers'], GetPaginatedUsers>

// PUBLIC API
export const getPaginatedUsers: AuthenticatedOperationFor<RegisteredGetPaginatedUsers> =
  createAuthenticatedOperation<RegisteredGetPaginatedUsers>(
    () => getPaginatedUsers_ext,
    {
      User: prisma.user,
    },
  )


// PRIVATE API
export type RegisteredGetMyCompanies = FromRegisterPath<['operations', 'getMyCompanies'], GetMyCompanies>

// PUBLIC API
export const getMyCompanies: AuthenticatedOperationFor<RegisteredGetMyCompanies> =
  createAuthenticatedOperation<RegisteredGetMyCompanies>(
    () => getMyCompanies_ext,
    {
      Company: prisma.company,
      CompanyMembership: prisma.companyMembership,
      CompanySubscription: prisma.companySubscription,
      CompanyIntegrationSync: prisma.companyIntegrationSync,
      ComplianceEvent: prisma.complianceEvent,
      RiskAssessment: prisma.riskAssessment,
    },
  )


// PRIVATE API
export type RegisteredGetCompanyDetail = FromRegisterPath<['operations', 'getCompanyDetail'], GetCompanyDetail>

// PUBLIC API
export const getCompanyDetail: AuthenticatedOperationFor<RegisteredGetCompanyDetail> =
  createAuthenticatedOperation<RegisteredGetCompanyDetail>(
    () => getCompanyDetail_ext,
    {
      Company: prisma.company,
      CompanyMembership: prisma.companyMembership,
      CompanySubscription: prisma.companySubscription,
      CompanyIntegrationSync: prisma.companyIntegrationSync,
      ComplianceEvent: prisma.complianceEvent,
      RiskAssessment: prisma.riskAssessment,
    },
  )


// PRIVATE API
export type RegisteredGetGptResponses = FromRegisterPath<['operations', 'getGptResponses'], GetGptResponses>

// PUBLIC API
export const getGptResponses: AuthenticatedOperationFor<RegisteredGetGptResponses> =
  createAuthenticatedOperation<RegisteredGetGptResponses>(
    () => getGptResponses_ext,
    {
      User: prisma.user,
      GptResponse: prisma.gptResponse,
    },
  )


// PRIVATE API
export type RegisteredGetAllTasksByUser = FromRegisterPath<['operations', 'getAllTasksByUser'], GetAllTasksByUser>

// PUBLIC API
export const getAllTasksByUser: AuthenticatedOperationFor<RegisteredGetAllTasksByUser> =
  createAuthenticatedOperation<RegisteredGetAllTasksByUser>(
    () => getAllTasksByUser_ext,
    {
      Task: prisma.task,
    },
  )


// PRIVATE API
export type RegisteredGetCustomerPortalUrl = FromRegisterPath<['operations', 'getCustomerPortalUrl'], GetCustomerPortalUrl>

// PUBLIC API
export const getCustomerPortalUrl: AuthenticatedOperationFor<RegisteredGetCustomerPortalUrl> =
  createAuthenticatedOperation<RegisteredGetCustomerPortalUrl>(
    () => getCustomerPortalUrl_ext,
    {
      User: prisma.user,
    },
  )


// PRIVATE API
export type RegisteredGetAllFilesByUser = FromRegisterPath<['operations', 'getAllFilesByUser'], GetAllFilesByUser>

// PUBLIC API
export const getAllFilesByUser: AuthenticatedOperationFor<RegisteredGetAllFilesByUser> =
  createAuthenticatedOperation<RegisteredGetAllFilesByUser>(
    () => getAllFilesByUser_ext,
    {
      User: prisma.user,
      File: prisma.file,
    },
  )


// PRIVATE API
export type RegisteredGetDownloadFileSignedURL = FromRegisterPath<['operations', 'getDownloadFileSignedURL'], GetDownloadFileSignedURL>

// PUBLIC API
export const getDownloadFileSignedURL: AuthenticatedOperationFor<RegisteredGetDownloadFileSignedURL> =
  createAuthenticatedOperation<RegisteredGetDownloadFileSignedURL>(
    () => getDownloadFileSignedURL_ext,
    {
      User: prisma.user,
      File: prisma.file,
    },
  )


// PRIVATE API
export type RegisteredGetDailyStats = FromRegisterPath<['operations', 'getDailyStats'], GetDailyStats>

// PUBLIC API
export const getDailyStats: AuthenticatedOperationFor<RegisteredGetDailyStats> =
  createAuthenticatedOperation<RegisteredGetDailyStats>(
    () => getDailyStats_ext,
    {
      User: prisma.user,
      DailyStats: prisma.dailyStats,
    },
  )

