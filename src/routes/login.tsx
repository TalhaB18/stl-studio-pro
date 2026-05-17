import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { signIn, signUp, ensureSeedAccount } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Discreetize" },
      { name: "description", content: "Sign in to your Discreetize account." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    ensureSeedAccount();
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "in") await signIn(email, password);
      else await signUp(email, password, name || email.split("@")[0]);
      router.navigate({ to: "/app" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-hero">
      <div className="absolute inset-0 bg-grid" aria-hidden />

      <div className="relative mx-auto grid min-h-screen max-w-7xl grid-cols-1 lg:grid-cols-2">
        {/* Left: brand panel */}
        <div className="hidden flex-col justify-between p-12 lg:flex">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-md bg-gradient-to-br from-primary to-accent shadow-glow">
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-primary-foreground" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2 4 7v10l8 5 8-5V7z" />
                <path d="M4 7l8 5 8-5M12 12v10" />
              </svg>
            </div>
            <span className="font-display text-lg font-bold">Discreetize</span>
          </Link>

          <div>
            <blockquote className="font-display text-2xl leading-snug">
              "We replaced a 40-minute Python pipeline with{" "}
              <span className="text-gradient">a 12-second discreetize</span> command.
              That's it. That's the review."
            </blockquote>
            <div className="mt-6 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-card font-display text-sm font-bold text-primary">
                EK
              </div>
              <div>
                <div className="text-sm font-semibold">Erin Kowalski</div>
                <div className="text-xs text-muted-foreground">Lead CFD Engineer · Halix Aero</div>
              </div>
            </div>
          </div>

          <div className="font-display text-[11px] text-muted-foreground">
            © 2026 Discreetize · Built for engineers
          </div>
        </div>

        {/* Right: form */}
        <div className="flex items-center justify-center px-6 py-16 lg:p-12">
          <div className="w-full max-w-sm">
            <Link to="/" className="mb-8 inline-flex items-center gap-2.5 lg:hidden">
              <div className="grid h-9 w-9 place-items-center rounded-md bg-gradient-to-br from-primary to-accent shadow-glow">
                <svg viewBox="0 0 24 24" className="h-4 w-4 text-primary-foreground" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2 4 7v10l8 5 8-5V7z" />
                </svg>
              </div>
              <span className="font-display text-lg font-bold">Discreetize</span>
            </Link>

            <h1 className="font-display text-3xl font-bold">
              {mode === "in" ? "Welcome back." : "Create your account."}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {mode === "in"
                ? "Sign in to access your workbench."
                : "Three free STL imports to get you started."}
            </p>

            <form onSubmit={submit} className="mt-8 space-y-4">
              {mode === "up" && (
                <div className="space-y-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ada Lovelace"
                  />
                </div>
              )}
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-glow hover:opacity-90"
              >
                {loading ? "..." : mode === "in" ? "Sign in" : "Create account"}
              </Button>
            </form>

            <div className="mt-6 text-center text-xs text-muted-foreground">
              {mode === "in" ? (
                <>
                  Don't have an account?{" "}
                  <button
                    onClick={() => {
                      setMode("up");
                      setError("");
                    }}
                    className="font-medium text-primary hover:underline"
                  >
                    Create one
                  </button>
                </>
              ) : (
                <>
                  Already have one?{" "}
                  <button
                    onClick={() => {
                      setMode("in");
                      setError("");
                    }}
                    className="font-medium text-primary hover:underline"
                  >
                    Sign in
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
