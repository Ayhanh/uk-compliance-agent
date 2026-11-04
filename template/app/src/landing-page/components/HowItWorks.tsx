import { BellRing, Building2, FileSearch, ShieldCheck } from "lucide-react";
import { SectionTitle } from "./SectionTitle";

const steps = [
  {
    icon: Building2,
    title: "1. Add your company",
    text: "Enter your Companies House number. We pull your profile, status and SIC codes.",
  },
  {
    icon: FileSearch,
    title: "2. We monitor",
    text: "The Gazette and your Companies House record are checked regularly for notices that mention you.",
  },
  {
    icon: ShieldCheck,
    title: "3. AI explains the risk",
    text: "Each notice gets a severity rating, a plain-English summary and step-by-step actions.",
  },
  {
    icon: BellRing,
    title: "4. Get alerted",
    text: "HIGH and CRITICAL findings are sent to you by email and Telegram.",
  },
];

export function HowItWorks() {
  return (
    <section
      className="mx-auto my-16 max-w-7xl px-6 md:my-24 lg:px-8"
      id="how-it-works"
    >
      <SectionTitle
        title="How it works"
        description="From company number to actionable guidance in minutes."
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map(({ icon: Icon, title, text }) => (
          <div
            key={title}
            className="bg-card border-border rounded-xl border p-6"
          >
            <Icon className="text-primary h-7 w-7" aria-hidden="true" />
            <h3 className="mt-4 font-semibold">{title}</h3>
            <p className="text-muted-foreground mt-2 text-sm leading-6">
              {text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
