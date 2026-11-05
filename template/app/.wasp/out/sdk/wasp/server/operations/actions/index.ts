
import { prisma } from '../../index'
import {
  type UnauthenticatedOperationFor,
  createUnauthenticatedOperation,
  type AuthenticatedOperationFor,
  createAuthenticatedOperation,
} from '../wrappers'
import type { FromRegisterPath } from '../../../types/register'
import type {
  UpdateIsUserAdminById,
  AddCompany,
  TriggerCompanySync,
  CreateCompanyCheckout,
  GenerateGptResponse,
  CreateTask,
  UpdateTask,
  DeleteTask,
  GenerateCheckoutSession,
  AddFileToDb,
  CreateFileUploadUrl,
  DeleteFile,
} from './types'
import { updateIsUserAdminById as updateIsUserAdminById_ext } from "virtual:wasp/user/user/operations"
import { addCompany as addCompany_ext } from "virtual:wasp/user/compliance/operations"
import { triggerCompanySync as triggerCompanySync_ext } from "virtual:wasp/user/compliance/operations"
import { createCompanyCheckout as createCompanyCheckout_ext } from "virtual:wasp/user/compliance/operations"
import { generateGptResponse as generateGptResponse_ext } from "virtual:wasp/user/demo-ai-app/operations"
import { createTask as createTask_ext } from "virtual:wasp/user/demo-ai-app/operations"
import { updateTask as updateTask_ext } from "virtual:wasp/user/demo-ai-app/operations"
import { deleteTask as deleteTask_ext } from "virtual:wasp/user/demo-ai-app/operations"
import { generateCheckoutSession as generateCheckoutSession_ext } from "virtual:wasp/user/payment/operations"
import { addFileToDb as addFileToDb_ext } from "virtual:wasp/user/file-upload/operations"
import { createFileUploadUrl as createFileUploadUrl_ext } from "virtual:wasp/user/file-upload/operations"
import { deleteFile as deleteFile_ext } from "virtual:wasp/user/file-upload/operations"

// PRIVATE API
export type RegisteredUpdateIsUserAdminById = FromRegisterPath<['operations', 'updateIsUserAdminById'], UpdateIsUserAdminById>

// PUBLIC API
export const updateIsUserAdminById: AuthenticatedOperationFor<RegisteredUpdateIsUserAdminById> =
  createAuthenticatedOperation<RegisteredUpdateIsUserAdminById>(
    () => updateIsUserAdminById_ext,
    {
      User: prisma.user,
    },
  )

// PRIVATE API
export type RegisteredAddCompany = FromRegisterPath<['operations', 'addCompany'], AddCompany>

// PUBLIC API
export const addCompany: AuthenticatedOperationFor<RegisteredAddCompany> =
  createAuthenticatedOperation<RegisteredAddCompany>(
    () => addCompany_ext,
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
export type RegisteredTriggerCompanySync = FromRegisterPath<['operations', 'triggerCompanySync'], TriggerCompanySync>

// PUBLIC API
export const triggerCompanySync: AuthenticatedOperationFor<RegisteredTriggerCompanySync> =
  createAuthenticatedOperation<RegisteredTriggerCompanySync>(
    () => triggerCompanySync_ext,
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
export type RegisteredCreateCompanyCheckout = FromRegisterPath<['operations', 'createCompanyCheckout'], CreateCompanyCheckout>

// PUBLIC API
export const createCompanyCheckout: AuthenticatedOperationFor<RegisteredCreateCompanyCheckout> =
  createAuthenticatedOperation<RegisteredCreateCompanyCheckout>(
    () => createCompanyCheckout_ext,
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
export type RegisteredGenerateGptResponse = FromRegisterPath<['operations', 'generateGptResponse'], GenerateGptResponse>

// PUBLIC API
export const generateGptResponse: AuthenticatedOperationFor<RegisteredGenerateGptResponse> =
  createAuthenticatedOperation<RegisteredGenerateGptResponse>(
    () => generateGptResponse_ext,
    {
      User: prisma.user,
      Task: prisma.task,
      GptResponse: prisma.gptResponse,
    },
  )

// PRIVATE API
export type RegisteredCreateTask = FromRegisterPath<['operations', 'createTask'], CreateTask>

// PUBLIC API
export const createTask: AuthenticatedOperationFor<RegisteredCreateTask> =
  createAuthenticatedOperation<RegisteredCreateTask>(
    () => createTask_ext,
    {
      Task: prisma.task,
    },
  )

// PRIVATE API
export type RegisteredUpdateTask = FromRegisterPath<['operations', 'updateTask'], UpdateTask>

// PUBLIC API
export const updateTask: AuthenticatedOperationFor<RegisteredUpdateTask> =
  createAuthenticatedOperation<RegisteredUpdateTask>(
    () => updateTask_ext,
    {
      Task: prisma.task,
    },
  )

// PRIVATE API
export type RegisteredDeleteTask = FromRegisterPath<['operations', 'deleteTask'], DeleteTask>

// PUBLIC API
export const deleteTask: AuthenticatedOperationFor<RegisteredDeleteTask> =
  createAuthenticatedOperation<RegisteredDeleteTask>(
    () => deleteTask_ext,
    {
      Task: prisma.task,
    },
  )

// PRIVATE API
export type RegisteredGenerateCheckoutSession = FromRegisterPath<['operations', 'generateCheckoutSession'], GenerateCheckoutSession>

// PUBLIC API
export const generateCheckoutSession: AuthenticatedOperationFor<RegisteredGenerateCheckoutSession> =
  createAuthenticatedOperation<RegisteredGenerateCheckoutSession>(
    () => generateCheckoutSession_ext,
    {
      User: prisma.user,
    },
  )

// PRIVATE API
export type RegisteredAddFileToDb = FromRegisterPath<['operations', 'addFileToDb'], AddFileToDb>

// PUBLIC API
export const addFileToDb: AuthenticatedOperationFor<RegisteredAddFileToDb> =
  createAuthenticatedOperation<RegisteredAddFileToDb>(
    () => addFileToDb_ext,
    {
      User: prisma.user,
      File: prisma.file,
    },
  )

// PRIVATE API
export type RegisteredCreateFileUploadUrl = FromRegisterPath<['operations', 'createFileUploadUrl'], CreateFileUploadUrl>

// PUBLIC API
export const createFileUploadUrl: AuthenticatedOperationFor<RegisteredCreateFileUploadUrl> =
  createAuthenticatedOperation<RegisteredCreateFileUploadUrl>(
    () => createFileUploadUrl_ext,
    {
      User: prisma.user,
      File: prisma.file,
    },
  )

// PRIVATE API
export type RegisteredDeleteFile = FromRegisterPath<['operations', 'deleteFile'], DeleteFile>

// PUBLIC API
export const deleteFile: AuthenticatedOperationFor<RegisteredDeleteFile> =
  createAuthenticatedOperation<RegisteredDeleteFile>(
    () => deleteFile_ext,
    {
      User: prisma.user,
      File: prisma.file,
    },
  )
