import { Link as WaspRouterLink, routes } from "wasp/client/router";

export function Announcement() {
  return (
    <div className="from-accent to-secondary text-primary-foreground bg-linear-to-r relative flex w-full items-center justify-center gap-3 p-3 text-center text-sm font-semibold">
      <span>14-day free trial for every company you add.</span>
      <WaspRouterLink
        to={routes.SignupRoute.to}
        className="bg-background/20 hover:bg-background/30 rounded-full px-2.5 py-1 text-xs transition-colors"
      >
        Get started →
      </WaspRouterLink>
    </div>
  );
}
