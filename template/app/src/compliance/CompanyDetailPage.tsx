import {
  createCompanyCheckout,
  getCompanyDetail,
  triggerCompanySync,
  useQuery,
} from "wasp/client/operations";
import { Link, routes } from "wasp/client/router";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useParams, useSearchParams } from "react-router";
import { Button } from "../client/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../client/components/ui/card";
import { toast } from "../client/hooks/use-toast";
import { AccessBadge } from "./AccessBadge";
import { SeverityBadge } from "./SeverityBadge";

function safeHttpUrl(url: string | null): string | null {
  return url && /^https?:\/\//i.test(url) ? url : null;
}

export function CompanyDetailPage() {
  const { companyNumber = "" } = useParams();
  const [searchParams] = useSearchParams();
  const { data, isLoading, error } = useQuery(getCompanyDetail, {
    companyNumber,
  });
  const [isSyncing, setIsSyncing] = useState(false);
  const [onlyHighRisk, setOnlyHighRisk] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState<string | null>(null);

  if (isLoading) {
    return <Loader2 className="mx-auto mt-20 h-6 w-6 animate-spin" />;
  }
  if (error || !data) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-10">
        <p className="text-destructive">
          {error?.message ?? "Company not found"}
        </p>
        <Link
          to={routes.CompaniesRoute.to}
          className="text-primary mt-4 inline-block underline"
        >
          Back to companies
        </Link>
      </div>
    );
  }

  const { company, access, events, syncs, role } = data;
  const canManageBilling = role !== "MEMBER";
  const severityCounts = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
  for (const event of events) {
    const severity = event.riskAssessments[0]?.severity;
    if (severity) severityCounts[severity] += 1;
  }
  const visibleEvents = onlyHighRisk
    ? events.filter((event) => {
        const severity = event.riskAssessments[0]?.severity;
        return severity === "HIGH" || severity === "CRITICAL";
      })
    : events;
  const lastSync = syncs
    .map((s) => s.lastSuccessfulSyncAt)
    .filter((d): d is Date => d !== null)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0];
  const syncError = syncs.find((s) => s.lastError)?.lastError;
  const address = company.address as Record<string, string> | null;

  async function handleSync() {
    setIsSyncing(true);
    try {
      const result = await triggerCompanySync({ companyNumber });
      toast({
        title: "Sync complete",
        description: `${result.newEvents} new events, ${
          result.newAssessments
        } new AI assessments${
          result.errors.length ? ` (${result.errors.length} warnings)` : ""
        }.`,
      });
    } catch (err) {
      toast({
        title: "Sync failed",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  }

  async function handleCheckout(plan: "STARTER" | "PRO") {
    setIsCheckingOut(plan);
    try {
      const { checkoutUrl } = await createCompanyCheckout({
        companyNumber,
        plan,
      });
      window.location.assign(checkoutUrl);
    } catch (err) {
      toast({
        title: "Could not start checkout",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      });
      setIsCheckingOut(null);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-6 py-10 lg:px-8">
      <Link
        to={routes.CompaniesRoute.to}
        className="text-muted-foreground text-sm underline"
      >
        ← All companies
      </Link>

      {searchParams.get("checkout") === "success" && (
        <p className="rounded-md bg-green-100 p-3 text-sm text-green-800">
          Thanks! Your subscription will activate as soon as the payment is
          confirmed.
        </p>
      )}

      <Card>
        <CardHeader className="flex flex-row items-start justify-between space-y-0">
          <div>
            <CardTitle className="text-2xl">{company.name}</CardTitle>
            <p className="text-muted-foreground text-sm">
              No. {company.companyNumber} · {company.registrationStatus}
              {company.incorporationDate &&
                ` · incorporated ${new Date(
                  company.incorporationDate,
                ).toLocaleDateString()}`}
            </p>
          </div>
          <AccessBadge access={access} />
        </CardHeader>
        <CardContent className="text-sm">
          {address && (
            <p>{Object.values(address).filter(Boolean).join(", ")}</p>
          )}
          {company.sicCodes.length > 0 && (
            <p className="text-muted-foreground mt-1">
              SIC codes: {company.sicCodes.join(", ")}
            </p>
          )}
        </CardContent>
      </Card>

      {!access.hasAccess && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="text-lg">
              Subscribe to resume monitoring
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>
              Continuous monitoring and AI risk scans need an active
              subscription or trial.
            </p>
            {canManageBilling ? (
              <div className="flex gap-3">
                <Button
                  onClick={() => handleCheckout("STARTER")}
                  disabled={isCheckingOut !== null}
                >
                  {isCheckingOut === "STARTER"
                    ? "Redirecting…"
                    : "Starter – £29/month"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleCheckout("PRO")}
                  disabled={isCheckingOut !== null}
                >
                  {isCheckingOut === "PRO"
                    ? "Redirecting…"
                    : "Business – £49/month"}
                </Button>
              </div>
            ) : (
              <p className="text-muted-foreground">
                Ask a company owner or admin to subscribe.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Compliance events</h2>
          <p className="text-muted-foreground text-sm">
            Last successful sync:{" "}
            {lastSync ? new Date(lastSync).toLocaleString() : "never"}
          </p>
          {syncError && (
            <p className="text-destructive text-sm">Last error: {syncError}</p>
          )}
        </div>
        <Button onClick={handleSync} disabled={isSyncing || !access.hasAccess}>
          {isSyncing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Syncing…
            </>
          ) : (
            "Sync now"
          )}
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {(["CRITICAL", "HIGH", "MEDIUM", "LOW"] as const).map((level) => (
          <div
            key={level}
            className="bg-card border-border rounded-lg border p-3 text-center"
          >
            <p className="text-2xl font-bold">{severityCounts[level]}</p>
            <SeverityBadge severity={level} />
          </div>
        ))}
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={onlyHighRisk}
          onChange={(e) => setOnlyHighRisk(e.target.checked)}
        />
        Show only HIGH and CRITICAL
      </label>

      {events.length === 0 && (
        <p className="text-muted-foreground text-sm">
          No events yet. Run a sync to fetch Gazette notices and Companies House
          changes.
        </p>
      )}

      {visibleEvents.map((event) => {
        const assessment = event.riskAssessments[0];
        const url = safeHttpUrl(event.sourceUrl);
        return (
          <Card key={event.id}>
            <CardHeader className="space-y-2">
              <div className="flex items-start justify-between gap-4">
                <CardTitle className="text-base">{event.title}</CardTitle>
                {assessment ? (
                  <SeverityBadge severity={assessment.severity} />
                ) : (
                  <span className="text-muted-foreground text-xs">
                    Awaiting analysis
                  </span>
                )}
              </div>
              <p className="text-muted-foreground text-xs">
                {event.provider === "THE_GAZETTE"
                  ? "The Gazette"
                  : "Companies House"}
                {event.publishedAt &&
                  ` · ${new Date(event.publishedAt).toLocaleDateString()}`}
                {url && (
                  <>
                    {" · "}
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      Official notice
                    </a>
                  </>
                )}
              </p>
            </CardHeader>
            {assessment && (
              <CardContent className="space-y-3 text-sm">
                <p className="font-medium">{assessment.summary}</p>
                <p className="text-muted-foreground">{assessment.rationale}</p>
                {assessment.recommendedActions.length > 0 && (
                  <div>
                    <p className="font-medium">Recommended actions</p>
                    <ol className="list-decimal space-y-1 pl-5">
                      {assessment.recommendedActions.map((action, i) => (
                        <li key={i}>{action}</li>
                      ))}
                    </ol>
                  </div>
                )}
                <p className="text-muted-foreground text-xs">
                  AI-generated guidance, not legal advice. Model:{" "}
                  {assessment.modelVersion}
                </p>
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
}
