import { getRouteObjects } from "wasp/client/app/router";
import { initializeQueryClient } from "@wasp.sh/lib-sdk-core/browser";

import { createAuthRequiredPage } from "wasp/client/app"

import { App as App_ext } from "./src/client/App"



const routesMapping = {
  LandingPageRoute: {
    lazy: async () => {
      const Component = await import("./src/landing-page/LandingPage").then(m => m.LandingPage);

      return {
        Component:
          Component,
      }
    },
  },
  NotFoundRoute: {
    lazy: async () => {
      const Component = await import("./src/client/components/NotFoundPage").then(m => m.NotFoundPage);

      return {
        Component:
          Component,
      }
    },
  },
  LoginRoute: {
    lazy: async () => {
      const Component = await import("./src/auth/LoginPage").then(m => m.LoginPage);

      return {
        Component:
          Component,
      }
    },
  },
  SignupRoute: {
    lazy: async () => {
      const Component = await import("./src/auth/SignupPage").then(m => m.SignupPage);

      return {
        Component:
          Component,
      }
    },
  },
  RequestPasswordResetRoute: {
    lazy: async () => {
      const Component = await import("./src/auth/email-and-pass/RequestPasswordResetPage").then(m => m.RequestPasswordResetPage);

      return {
        Component:
          Component,
      }
    },
  },
  PasswordResetRoute: {
    lazy: async () => {
      const Component = await import("./src/auth/email-and-pass/PasswordResetPage").then(m => m.PasswordResetPage);

      return {
        Component:
          Component,
      }
    },
  },
  EmailVerificationRoute: {
    lazy: async () => {
      const Component = await import("./src/auth/email-and-pass/EmailVerificationPage").then(m => m.EmailVerificationPage);

      return {
        Component:
          Component,
      }
    },
  },
  AccountRoute: {
    lazy: async () => {
      const Component = await import("./src/user/AccountPage").then(m => m.AccountPage);

      return {
        Component:
          createAuthRequiredPage(Component),
      }
    },
  },
  CompaniesRoute: {
    lazy: async () => {
      const Component = await import("./src/compliance/CompaniesPage").then(m => m.CompaniesPage);

      return {
        Component:
          createAuthRequiredPage(Component),
      }
    },
  },
  CompanyDetailRoute: {
    lazy: async () => {
      const Component = await import("./src/compliance/CompanyDetailPage").then(m => m.CompanyDetailPage);

      return {
        Component:
          createAuthRequiredPage(Component),
      }
    },
  },
  DemoAppRoute: {
    lazy: async () => {
      const Component = await import("./src/demo-ai-app/DemoAppPage").then(m => m.DemoAppPage);

      return {
        Component:
          createAuthRequiredPage(Component),
      }
    },
  },
  PricingPageRoute: {
    lazy: async () => {
      const Component = await import("./src/payment/PricingPage").then(m => m.PricingPage);

      return {
        Component:
          Component,
      }
    },
  },
  CheckoutResultRoute: {
    lazy: async () => {
      const Component = await import("./src/payment/CheckoutResultPage").then(m => m.CheckoutResultPage);

      return {
        Component:
          createAuthRequiredPage(Component),
      }
    },
  },
  FileUploadRoute: {
    lazy: async () => {
      const Component = await import("./src/file-upload/FileUploadPage").then(m => m.FileUploadPage);

      return {
        Component:
          createAuthRequiredPage(Component),
      }
    },
  },
  AdminRoute: {
    lazy: async () => {
      const Component = await import("./src/admin/dashboards/analytics/AnalyticsDashboardPage").then(m => m.AnalyticsDashboardPage);

      return {
        Component:
          createAuthRequiredPage(Component),
      }
    },
  },
  AdminUsersRoute: {
    lazy: async () => {
      const Component = await import("./src/admin/dashboards/users/UsersDashboardPage").then(m => m.UsersDashboardPage);

      return {
        Component:
          createAuthRequiredPage(Component),
      }
    },
  },
  AdminSettingsRoute: {
    lazy: async () => {
      const Component = await import("./src/admin/elements/settings/SettingsPage").then(m => m.SettingsPage);

      return {
        Component:
          createAuthRequiredPage(Component),
      }
    },
  },
  AdminCalendarRoute: {
    lazy: async () => {
      const Component = await import("./src/admin/elements/calendar/CalendarPage").then(m => m.CalendarPage);

      return {
        Component:
          createAuthRequiredPage(Component),
      }
    },
  },
  AdminUIButtonsRoute: {
    lazy: async () => {
      const Component = await import("./src/admin/elements/ui-elements/ButtonsPage").then(m => m.ButtonsPage);

      return {
        Component:
          createAuthRequiredPage(Component),
      }
    },
  },
  AdminMessagesRoute: {
    lazy: async () => {
      const Component = await import("./src/admin/dashboards/messages/MessagesPage").then(m => m.MessagesPage);

      return {
        Component:
          createAuthRequiredPage(Component),
      }
    },
  },
} as const;


initializeQueryClient()

const rootElement =
  // We don't really need to wrap the app in a div nor name it "root", but we
  // keep it for backwards compatibility with older Wasp versions.
  <div id="root">
    <App_ext />
  </div>

export const routeObjects = getRouteObjects({
  routesMapping,
  rootElement,
})
