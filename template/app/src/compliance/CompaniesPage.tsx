import { addCompany, getMyCompanies, useQuery } from "wasp/client/operations";
import { Link, routes } from "wasp/client/router";

import { Loader2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "../client/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../client/components/ui/card";
import { Input } from "../client/components/ui/input";
import { Label } from "../client/components/ui/label";
import { toast } from "../client/hooks/use-toast";
import { AccessBadge } from "./AccessBadge";

export function CompaniesPage() {
  const { data: companies, isLoading, error } = useQuery(getMyCompanies);

  return (
    <div className="mx-auto max-w-4xl px-6 py-10 lg:px-8">
      <h1 className="text-foreground text-3xl font-bold tracking-tight">
        Your companies
      </h1>
      <p className="text-muted-foreground mt-2">
        Add your UK limited company by its Companies House number to start
        monitoring it for compliance and insolvency risks.
      </p>

      <AddCompanyForm />

      <div className="mt-8 space-y-4">
        {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
        {error && (
          <p className="text-destructive text-sm">
            Could not load companies: {error.message}
          </p>
        )}
        {companies?.length === 0 && (
          <p className="text-muted-foreground text-sm">
            No companies yet. Add one above.
          </p>
        )}
        {companies?.map((company) => (
          <Link
            key={company.companyNumber}
            to={routes.CompanyDetailRoute.to}
            params={{ companyNumber: company.companyNumber }}
            className="block"
          >
            <Card className="hover:bg-muted/40 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle className="text-lg">{company.name}</CardTitle>
                  <p className="text-muted-foreground text-sm">
                    No. {company.companyNumber} · {company.registrationStatus}
                  </p>
                </div>
                <AccessBadge access={company.access} />
              </CardHeader>
              <CardContent className="text-muted-foreground flex gap-6 text-sm">
                <span>
                  {company.openHighRiskCount} high/critical{" "}
                  {company.openHighRiskCount === 1 ? "finding" : "findings"}
                </span>
                <span>
                  Last sync:{" "}
                  {company.lastSuccessfulSyncAt
                    ? new Date(company.lastSuccessfulSyncAt).toLocaleString()
                    : "never"}
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

function AddCompanyForm() {
  const [companyNumber, setCompanyNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const added = await addCompany({ companyNumber });
      setCompanyNumber("");
      toast({
        title: "Company added",
        description: `Monitoring started for ${added.companyNumber}. Open it and run a sync.`,
      });
    } catch (err) {
      toast({
        title: "Could not add company",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="mt-6">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="flex items-end gap-3">
          <div className="flex-1 space-y-2">
            <Label htmlFor="companyNumber">Companies House number</Label>
            <Input
              id="companyNumber"
              placeholder="e.g. 00445790"
              value={companyNumber}
              onChange={(e) => setCompanyNumber(e.target.value)}
              maxLength={12}
              required
            />
          </div>
          <Button
            type="submit"
            disabled={isSubmitting || !companyNumber.trim()}
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Add company"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
