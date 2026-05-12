import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { getSession, upgradeCurrent, type User } from "@/lib/auth";

export const Route = createFileRoute("/upgrade")({
  head: () => ({
    meta: [
      { title: "Pricing — MeshMaster" },
      { name: "description", content: "Free and Premium plans for MeshMaster." },
    ],
  }),
  component: Upgrade,
});

function Upgrade() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    setUser(getSession());
  }, []);

  const onUpgrade = () => {
    if (!user) {
      router.navigate({ to: "/login" });
      return;
    }
    const u = upgradeCurrent();
    setUser(u);
    setConfirmed(true);
    window.dispatchEvent(new Event("mm-auth-change"));
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <section className="relative overflow-hidden bg-hero">
        <div className="absolute inset-0 bg-grid" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-6 py-20 text-center">
          <div className="font-display text-xs uppercase tracking-[0.2em] text-primary">
            Pricing
          </div>
          <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">
            Simple plans for serious geometry.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Start free. Upgrade when you outgrow three imports.
          </p>

          {confirmed && (
            <div className="mx-auto mt-6 max-w-md rounded-lg border border-accent/40 bg-accent/10 px-4 py-3 text-sm text-accent">
              You're on Premium. Unlimited imports unlocked.
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="grid gap-6 md:grid-cols-2">
          <PlanCard
            name="Free"
            price="$0"
            tag="For tinkering"
            features={[
              "3 STL imports total",
              "Mesh info & bounding box",
              "STL binary export",
              "Community support",
            ]}
            current={user?.plan === "free"}
          />
          <PlanCard
            name="Premium"
            price="$29"
            sub="/month"
            tag="For engineers shipping work"
            featured
            features={[
              "Unlimited STL / OBJ / PLY imports",
              "Manifold healing & repair",
              "Z-plane slicer (SVG + polylines)",
              "Curvature heatmap export",
              "STEP / OBJ / PLY export",
              "Priority email support",
            ]}
            cta={
              user?.plan === "premium" ? (
                <Button asChild className="w-full" variant="secondary">
                  <Link to="/app">Open workbench</Link>
                </Button>
              ) : (
                <Button
                  onClick={onUpgrade}
                  className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-glow hover:opacity-90"
                >
                  {user ? "Upgrade now" : "Sign in to upgrade"}
                </Button>
              )
            }
            current={user?.plan === "premium"}
          />
        </div>

        <p className="mt-10 text-center text-xs text-muted-foreground">
          Plans, limits and prices are illustrative for this demo build.
        </p>
      </section>

      <SiteFooter />
    </div>
  );
}

function PlanCard({
  name,
  price,
  sub,
  tag,
  features,
  featured,
  current,
  cta,
}: {
  name: string;
  price: string;
  sub?: string;
  tag: string;
  features: string[];
  featured?: boolean;
  current?: boolean;
  cta?: React.ReactNode;
}) {
  return (
    <div
      className={`relative rounded-2xl border p-8 shadow-card ${
        featured
          ? "border-primary/50 bg-card"
          : "border-border/70 bg-card/60"
      }`}
    >
      {featured && (
        <div className="absolute -top-3 left-8 rounded-full bg-gradient-to-r from-primary to-accent px-3 py-1 font-display text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow-glow">
          Recommended
        </div>
      )}
      {current && (
        <div className="absolute -top-3 right-8 rounded-full border border-border bg-background px-3 py-1 font-display text-[10px] uppercase tracking-wider text-muted-foreground">
          Current plan
        </div>
      )}
      <div className="font-display text-sm uppercase tracking-wider text-muted-foreground">
        {name}
      </div>
      <div className="mt-3 flex items-baseline gap-1">
        <span className="font-display text-5xl font-bold">{price}</span>
        {sub && <span className="text-sm text-muted-foreground">{sub}</span>}
      </div>
      <div className="mt-1 text-xs text-muted-foreground">{tag}</div>

      <ul className="mt-6 space-y-3 text-sm">
        {features.map((f) => (
          <li key={f} className="flex gap-2.5">
            <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <div className="mt-8">
        {cta ?? (
          <Button asChild className="w-full" variant="outline">
            <Link to="/app">Get started</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
