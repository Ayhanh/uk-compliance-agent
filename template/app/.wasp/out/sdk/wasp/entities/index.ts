import type {
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
} from "@prisma/client"

export type {
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
  Auth,
  AuthIdentity,
} from "@prisma/client"

export type Entity = 
  | User
  | ProcessedWebhookEvent
  | Company
  | CompanyMembership
  | ComplianceEvent
  | RiskAssessment
  | CompanyIntegrationSync
  | CompanySubscription
  | GptResponse
  | Task
  | File
  | DailyStats
  | PageViewSource
  | Logs
  | ContactFormMessage
  | never

export type EntityName = 
  | "User"
  | "ProcessedWebhookEvent"
  | "Company"
  | "CompanyMembership"
  | "ComplianceEvent"
  | "RiskAssessment"
  | "CompanyIntegrationSync"
  | "CompanySubscription"
  | "GptResponse"
  | "Task"
  | "File"
  | "DailyStats"
  | "PageViewSource"
  | "Logs"
  | "ContactFormMessage"
  | never
