import type {
  _User,
  _Company,
  _CompanyMembership,
  _CompanySubscription,
  _CompanyIntegrationSync,
  _ComplianceEvent,
  _RiskAssessment,
  _Task,
  _GptResponse,
  _File,
  AuthenticatedActionDefinition,
  Payload,
} from '../../_types/index.js'

// PUBLIC API
export type UpdateIsUserAdminById<Input extends Payload = never, Output extends Payload = Payload> = 
  AuthenticatedActionDefinition<
    [
      _User,
    ],
    Input,
    Output
  >

// PUBLIC API
export type AddCompany<Input extends Payload = never, Output extends Payload = Payload> = 
  AuthenticatedActionDefinition<
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
export type TriggerCompanySync<Input extends Payload = never, Output extends Payload = Payload> = 
  AuthenticatedActionDefinition<
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
export type CreateCompanyCheckout<Input extends Payload = never, Output extends Payload = Payload> = 
  AuthenticatedActionDefinition<
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
export type GenerateGptResponse<Input extends Payload = never, Output extends Payload = Payload> = 
  AuthenticatedActionDefinition<
    [
      _User,
      _Task,
      _GptResponse,
    ],
    Input,
    Output
  >

// PUBLIC API
export type CreateTask<Input extends Payload = never, Output extends Payload = Payload> = 
  AuthenticatedActionDefinition<
    [
      _Task,
    ],
    Input,
    Output
  >

// PUBLIC API
export type UpdateTask<Input extends Payload = never, Output extends Payload = Payload> = 
  AuthenticatedActionDefinition<
    [
      _Task,
    ],
    Input,
    Output
  >

// PUBLIC API
export type DeleteTask<Input extends Payload = never, Output extends Payload = Payload> = 
  AuthenticatedActionDefinition<
    [
      _Task,
    ],
    Input,
    Output
  >

// PUBLIC API
export type GenerateCheckoutSession<Input extends Payload = never, Output extends Payload = Payload> = 
  AuthenticatedActionDefinition<
    [
      _User,
    ],
    Input,
    Output
  >

// PUBLIC API
export type AddFileToDb<Input extends Payload = never, Output extends Payload = Payload> = 
  AuthenticatedActionDefinition<
    [
      _User,
      _File,
    ],
    Input,
    Output
  >

// PUBLIC API
export type CreateFileUploadUrl<Input extends Payload = never, Output extends Payload = Payload> = 
  AuthenticatedActionDefinition<
    [
      _User,
      _File,
    ],
    Input,
    Output
  >

// PUBLIC API
export type DeleteFile<Input extends Payload = never, Output extends Payload = Payload> = 
  AuthenticatedActionDefinition<
    [
      _User,
      _File,
    ],
    Input,
    Output
  >

