import { Link as WaspRouterLink, routes } from "wasp/client/router";
import { Button } from "../client/components/ui/button";
import { cn } from "../client/utils";

interface Plan {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
}

const plans: Plan[] = [
  {
    name: "Starter Plan",
    price: "£29",
    description: "For a single limited company.",
    features: [
      "1 company",
      "Companies House and Gazette monitoring every 6 hours",
      "Plain-English AI risk reports",
      "Email alerts for HIGH and CRITICAL findings",
    ],
  },
  {
    name: "Business Plan",
    price: "£49",
    description: "For directors, agencies and sellers with several companies.",
    features: [
      "Multiple companies",
      "Deeper AI analysis using your SIC codes and sector",
      "Priority Telegram alerts",
      "Email alerts for HIGH and CRITICAL findings",
      "Share companies with teammates",
    ],
    highlighted: true,
  },
];

export function PricingPage() {
  return (
    <div className="py-16 lg:mt-10">
      <div className="mx-auto max-w-3xl px-6 text-center lg:px-8">
        <h1 className="text-foreground text-4xl font-bold tracking-tight sm:text-5xl">
          Simple, <span className="text-primary">per-company</span> pricing
        </h1>
        <p className="text-muted-foreground mt-6 text-lg leading-8">
          Every company starts with a 14-day free trial. After that, choose a
          monthly plan. Cancel any time and keep access until the end of the
          paid period.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-4xl gap-8 px-6 md:grid-cols-2">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={cn(
              "bg-card flex flex-col rounded-2xl border p-8 shadow-lg",
              plan.highlighted ? "border-primary ring-primary ring-1" : "",
            )}
          >
            <h2 className="text-xl font-semibold">{plan.name}</h2>
            <p className="text-muted-foreground mt-2 text-sm">
              {plan.description}
            </p>
            <p className="mt-6">
              <span className="text-4xl font-bold">{plan.price}</span>
              <span className="text-muted-foreground text-sm"> / month</span>
            </p>
            <ul className="mt-6 flex-1 space-y-3 text-sm">
              {plan.features.map((feature) => (
                <li key={feature} className="flex gap-3">
                  <span className="text-primary" aria-hidden="true">
                    ✓
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button
              className="mt-8"
              variant={plan.highlighted ? "default" : "outline"}
              asChild
            >
              <WaspRouterLink to={routes.SignupRoute.to}>
                Start free trial
              </WaspRouterLink>
            </Button>
          </div>
        ))}
      </div>

      <p className="text-muted-foreground mx-auto mt-8 max-w-2xl px-6 text-center text-xs">
        Subscriptions are billed per company. Owners and admins subscribe from
        the company page. Findings are AI-generated guidance, not legal advice.
      </p>
      <div className="mt-6 text-center">
        <Button variant="link" asChild>
          <WaspRouterLink to={routes.CompaniesRoute.to}>
            Already have an account? Go to your companies
          </WaspRouterLink>
        </Button>
      </div>
    </div>
  );
}
