import type { EmailFromField } from '@wasp.sh/lib-sdk-core/node'

// PRIVATE API
export function getDefaultFromField(): EmailFromField {
  return {
    email: "me@example.com",
    name: "Open SaaS App",
  }
}
