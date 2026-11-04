import type { RiskSeverity } from "@prisma/client";
import { cn } from "../client/utils";

const SEVERITY_STYLES: Record<RiskSeverity, string> = {
  LOW: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  MEDIUM:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
  HIGH: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
  CRITICAL: "bg-red-600 text-white dark:bg-red-700",
};

export function SeverityBadge({ severity }: { severity: RiskSeverity }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        SEVERITY_STYLES[severity],
      )}
    >
      {severity}
    </span>
  );
}
