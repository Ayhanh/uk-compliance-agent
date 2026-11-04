import { Link as WaspRouterLink, routes } from "wasp/client/router";
import { Button } from "../../client/components/ui/button";
import { SeverityBadge } from "../../compliance/SeverityBadge";

export function Hero() {
  return (
    <div className="relative w-full pt-14">
      <div className="md:p-24">
        <div className="max-w-8xl mx-auto px-6 lg:px-8">
          <div className="lg:mb-18 mx-auto max-w-3xl text-center">
            <p className="text-primary text-sm font-semibold uppercase tracking-wider">
              For UK limited companies
            </p>
            <h1 className="text-foreground mt-3 text-5xl font-bold sm:text-6xl">
              Know about compliance risks{" "}
              <span className="text-gradient-primary">before they hurt</span>
            </h1>
            <p className="text-muted-foreground mx-auto mt-6 max-w-2xl text-lg leading-8">
              Enter your Companies House number. We watch The Gazette and your
              company record, explain every notice in plain English with AI, and
              alert you straight away when something serious appears.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button size="lg" variant="default" asChild>
                <WaspRouterLink to={routes.SignupRoute.to}>
                  Start free trial <span aria-hidden="true">→</span>
                </WaspRouterLink>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <WaspRouterLink to={routes.PricingPageRoute.to}>
                  How pricing works
                </WaspRouterLink>
              </Button>
            </div>
          </div>
          <SampleAlert />
        </div>
      </div>
    </div>
  );
}

// Static illustration of what a finding looks like in the product.
function SampleAlert() {
  return (
    <div className="mx-auto mt-14 max-w-2xl">
      <div className="bg-card border-border rounded-xl border p-6 text-left shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-semibold">Petition to wind up the company</p>
            <p className="text-muted-foreground text-xs">
              The Gazette · Example Trading Ltd (01234567)
            </p>
          </div>
          <SeverityBadge severity="CRITICAL" />
        </div>
        <p className="mt-4 text-sm">
          A creditor has petitioned the court to wind up your company. A hearing
          date has been set.
        </p>
        <p className="mt-4 text-sm font-medium">Recommended actions</p>
        <ol className="text-muted-foreground mt-1 list-decimal space-y-1 pl-5 text-sm">
          <li>Contact the petitioning creditor to discuss payment.</li>
          <li>Speak to a licensed insolvency practitioner this week.</li>
          <li>Do not move company assets before the hearing.</li>
        </ol>
        <p className="text-muted-foreground mt-4 text-xs">
          Illustrative example. AI-generated guidance, not legal advice.
        </p>
      </div>
    </div>
  );
}
