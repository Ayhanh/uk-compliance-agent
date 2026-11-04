import { routes } from "wasp/client/router";
import type { NavigationItem } from "./NavBar";

export const marketingNavigationItems: NavigationItem[] = [
  { name: "How it works", to: "/#how-it-works" },
  { name: "Features", to: "/#features" },
  { name: "Pricing", to: routes.PricingPageRoute.to },
] as const;

export const demoNavigationitems: NavigationItem[] = [
  { name: "Companies", to: routes.CompaniesRoute.to },
  { name: "Pricing", to: routes.PricingPageRoute.to },
  { name: "Account", to: routes.AccountRoute.to },
] as const;
