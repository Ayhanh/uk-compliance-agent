import { prisma } from 'wasp/server'

import { getCompanyDetail } from "../../../../../src/compliance/operations"


export default async function (args, context) {
  return (getCompanyDetail as any)(args, {
    ...context,
    entities: {
      Company: prisma.company,
      CompanyMembership: prisma.companyMembership,
      CompanySubscription: prisma.companySubscription,
      CompanyIntegrationSync: prisma.companyIntegrationSync,
      ComplianceEvent: prisma.complianceEvent,
      RiskAssessment: prisma.riskAssessment,
    },
  })
}
