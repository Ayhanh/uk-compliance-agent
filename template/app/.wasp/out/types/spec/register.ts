// The import ensures the module is always loaded into the bundle.
// Otherwise, module augmentation can fail if it wasn't loaded.
import "@wasp.sh/spec";

declare module "@wasp.sh/spec" {
  export interface Register {
    entities: {
      User: "User";
      ProcessedWebhookEvent: "ProcessedWebhookEvent";
      Company: "Company";
      CompanyMembership: "CompanyMembership";
      ComplianceEvent: "ComplianceEvent";
      RiskAssessment: "RiskAssessment";
      CompanyIntegrationSync: "CompanyIntegrationSync";
      CompanySubscription: "CompanySubscription";
      GptResponse: "GptResponse";
      Task: "Task";
      File: "File";
      DailyStats: "DailyStats";
      PageViewSource: "PageViewSource";
      Logs: "Logs";
      ContactFormMessage: "ContactFormMessage";
    }
  }
}
