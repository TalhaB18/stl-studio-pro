import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-6 py-10 sm:flex-row sm:items-center">
        <div>
          <div className="font-display text-sm font-bold">Discreetize</div>
          <p className="mt-1 text-xs text-muted-foreground">
            High-performance 3D mesh processing. Built in C++.
          </p>
        </div>
        <div className="flex flex-wrap gap-6 text-xs text-muted-foreground">
          <Link to="/upgrade" className="hover:text-foreground">Pricing</Link>
          <Link to="/login" className="hover:text-foreground">Sign in</Link>
          <a href="#" className="hover:text-foreground">Docs</a>
          <a href="#" className="hover:text-foreground">GitHub</a>
        </div>
        <div className="font-display text-[10px] text-muted-foreground">© 2026 Discreetize</div>
      </div>
    </footer>
  );
}
