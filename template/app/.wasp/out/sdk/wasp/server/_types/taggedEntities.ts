// Wasp internally uses the types defined in this file for typing entity maps in
// operation contexts.
//
// We must explicitly tag all entities with their name to avoid issues with
// structural typing. See https://github.com/wasp-lang/wasp/pull/982 for details.
import type { 
  Entity, 
  EntityName,
  User,
  ProcessedWebhookEvent,
  Company,
  CompanyMembership,
  ComplianceEvent,
  RiskAssessment,
  CompanyIntegrationSync,
  CompanySubscription,
  GptResponse,
  Task,
  File,
  DailyStats,
  PageViewSource,
  Logs,
  ContactFormMessage,
} from '../../entities/index.js'

export type _User = WithName<User, "User">
export type _ProcessedWebhookEvent = WithName<ProcessedWebhookEvent, "ProcessedWebhookEvent">
export type _Company = WithName<Company, "Company">
export type _CompanyMembership = WithName<CompanyMembership, "CompanyMembership">
export type _ComplianceEvent = WithName<ComplianceEvent, "ComplianceEvent">
export type _RiskAssessment = WithName<RiskAssessment, "RiskAssessment">
export type _CompanyIntegrationSync = WithName<CompanyIntegrationSync, "CompanyIntegrationSync">
export type _CompanySubscription = WithName<CompanySubscription, "CompanySubscription">
export type _GptResponse = WithName<GptResponse, "GptResponse">
export type _Task = WithName<Task, "Task">
export type _File = WithName<File, "File">
export type _DailyStats = WithName<DailyStats, "DailyStats">
export type _PageViewSource = WithName<PageViewSource, "PageViewSource">
export type _Logs = WithName<Logs, "Logs">
export type _ContactFormMessage = WithName<ContactFormMessage, "ContactFormMessage">

export type _Entity = 
  | _User
  | _ProcessedWebhookEvent
  | _Company
  | _CompanyMembership
  | _ComplianceEvent
  | _RiskAssessment
  | _CompanyIntegrationSync
  | _CompanySubscription
  | _GptResponse
  | _Task
  | _File
  | _DailyStats
  | _PageViewSource
  | _Logs
  | _ContactFormMessage
  | never

type WithName<E extends Entity, Name extends EntityName> = 
  E & { _entityName: Name }
