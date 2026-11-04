import type { AccessState } from "./access";

export function AccessBadge({ access }: { access: AccessState }) {
  if (!access.hasAccess) {
    return (
      <span className="rounded-full bg-gray-200 px-2.5 py-0.5 text-xs font-semibold text-gray-700 dark:bg-gray-700 dark:text-gray-200">
        Subscription required
      </span>
    );
  }
  const until = access.until
    ? new Date(access.until).toLocaleDateString()
    : null;
  return (
    <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
      {access.reason === "trial" ? "Trial" : "Subscribed"}
      {until ? ` · until ${until}` : ""}
    </span>
  );
}
