import { Link, useRouter } from "@tanstack/react-router";
import { signOut } from "@/lib/auth";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const router = useRouter();
  const { session, profile } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="grid h-8 w-8 place-items-center rounded-md bg-gradient-to-br from-primary to-accent shadow-glow">
            <svg viewBox="0 0 24 24" className="h-4 w-4 text-primary-foreground" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2 4 7v10l8 5 8-5V7z" />
              <path d="M4 7l8 5 8-5M12 12v10" />
            </svg>
          </div>
          <span className="font-display text-lg font-bold tracking-tight">Discreetize</span>
          <span className="ml-1 rounded border border-border/80 px-1.5 py-0.5 font-display text-[10px] text-muted-foreground">v2.0</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link to="/" hash="features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Features</Link>
          <Link to="/" hash="pipeline" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Pipeline</Link>
          <Link to="/upgrade" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Pricing</Link>
          {session && (
            <Link to="/app" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Workbench</Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {session ? (
            <>
              <span className="hidden text-xs text-muted-foreground sm:inline">
                {profile?.name ?? session.user.email} ·{" "}
                <span className={profile?.plan === "premium" ? "text-accent" : "text-primary"}>
                  {(profile?.plan ?? "free").toUpperCase()}
                </span>
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={async () => {
                  await signOut();
                  router.navigate({ to: "/" });
                }}
              >
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/login">Sign in</Link>
              </Button>
              <Button asChild size="sm" className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90">
                <Link to="/app">Launch app</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
