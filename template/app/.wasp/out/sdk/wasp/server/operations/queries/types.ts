
import type {
  _User,
  _Company,
  _CompanyMembership,
  _CompanySubscription,
  _CompanyIntegrationSync,
  _ComplianceEvent,
  _RiskAssessment,
  _GptResponse,
  _Task,
  _File,
  _DailyStats,
  AuthenticatedQueryDefinition,
  Payload,
} from '../../_types/index.js'

// PUBLIC API
export type GetPaginatedUsers<Input extends Payload = never, Output extends Payload = Payload> = 
  AuthenticatedQueryDefinition<
    [
      _User,
    ],
    Input,
    Output
  >

// PUBLIC API
export type GetMyCompanies<Input extends Payload = never, Output extends Payload = Payload> = 
  AuthenticatedQueryDefinition<
    [
      _Company,
      _CompanyMembership,
      _CompanySubscription,
      _CompanyIntegrationSync,
      _ComplianceEvent,
      _RiskAssessment,
    ],
    Input,
    Output
  >

// PUBLIC API
export type GetCompanyDetail<Input extends Payload = never, Output extends Payload = Payload> = 
  AuthenticatedQueryDefinition<
    [
      _Company,
      _CompanyMembership,
      _CompanySubscription,
      _CompanyIntegrationSync,
      _ComplianceEvent,
      _RiskAssessment,
    ],
    Input,
    Output
  >

// PUBLIC API
export type GetGptResponses<Input extends Payload = never, Output extends Payload = Payload> = 
  AuthenticatedQueryDefinition<
    [
      _User,
      _GptResponse,
    ],
    Input,
    Output
  >

// PUBLIC API
export type GetAllTasksByUser<Input extends Payload = never, Output extends Payload = Payload> = 
  AuthenticatedQueryDefinition<
    [
      _Task,
    ],
    Input,
    Output
  >

// PUBLIC API
export type GetCustomerPortalUrl<Input extends Payload = never, Output extends Payload = Payload> = 
  AuthenticatedQueryDefinition<
    [
      _User,
    ],
    Input,
    Output
  >

// PUBLIC API
export type GetAllFilesByUser<Input extends Payload = never, Output extends Payload = Payload> = 
  AuthenticatedQueryDefinition<
    [
      _User,
      _File,
    ],
    Input,
    Output
  >

// PUBLIC API
export type GetDownloadFileSignedURL<Input extends Payload = never, Output extends Payload = Payload> = 
  AuthenticatedQueryDefinition<
    [
      _User,
      _File,
    ],
    Input,
    Output
  >

// PUBLIC API
export type GetDailyStats<Input extends Payload = never, Output extends Payload = Payload> = 
  AuthenticatedQueryDefinition<
    [
      _User,
      _DailyStats,
    ],
    Input,
    Output
  >

