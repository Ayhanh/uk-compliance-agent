import { type EmailSender } from "@wasp.sh/spec";

export const emailSender: EmailSender = {
  // Alerts and auth emails are sent over SMTP. Set SMTP_HOST, SMTP_PORT, SMTP_USERNAME and SMTP_PASSWORD.
  // Switch back to "Dummy" for local development without an SMTP server (emails are only logged).
  provider: "SMTP",
  defaultFrom: {
    name: "Open SaaS App",
    // When using a real provider, e.g. SendGrid, you must use the same email address that you configured your account to send out emails with!
    email: "me@example.com",
  },
};
