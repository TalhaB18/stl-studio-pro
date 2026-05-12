import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MeshMaster — High-performance 3D mesh processing in C++" },
      {
        name: "description",
        content:
          "Heal, slice, analyze and export STL/CAD meshes at native speed. The CFD-grade mesh toolkit engineers ship with.",
      },
      { property: "og:title", content: "MeshMaster — 3D mesh processing in C++" },
      {
        property: "og:description",
        content: "STL healing, slicing, curvature analysis & export. Built in C++ for engineers.",
      },
    ],
  }),
  component: Landing,
});

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-display text-3xl font-bold text-gradient">{value}</div>
      <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}

function Feature({
  title,
  desc,
  icon,
}: {
  title: string;
  desc: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border/70 bg-card p-6 shadow-card transition-colors hover:border-primary/50">
      <div className="mb-4 grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="font-display text-base font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
    </div>
  );
}

function Landing() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* HERO */}
      <section className="relative overflow-hidden bg-hero">
        <div className="absolute inset-0 bg-grid" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-6 pt-20 pb-28 sm:pt-28 sm:pb-36">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/60 px-3 py-1 font-display text-[11px] tracking-wide text-muted-foreground backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-glow" />
              v2.0 — CFD-grade mesh pipeline, now native
            </div>
            <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] sm:text-6xl md:text-7xl">
              Mesh processing
              <br />
              at <span className="text-gradient">C++ speed.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Heal broken STLs, slice geometry, run curvature analysis and export to
              STL/OBJ/PLY/STEP — all from a single, blistering-fast engine engineers
              actually trust.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-glow hover:opacity-90"
              >
                <Link to="/app">Try the workbench →</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/upgrade">See pricing</Link>
              </Button>
            </div>
            <div className="mt-4 font-display text-[11px] text-muted-foreground">
              No card required · 3 free imports
            </div>
          </div>

          {/* terminal preview */}
          <div className="mx-auto mt-20 max-w-3xl overflow-hidden rounded-xl border border-border/70 bg-card shadow-card">
            <div className="flex items-center gap-2 border-b border-border/70 px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-accent/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-primary/70" />
              <span className="ml-3 font-display text-[11px] text-muted-foreground">
                ~/projects · meshmaster
              </span>
            </div>
            <pre className="overflow-x-auto p-5 text-left font-display text-[12.5px] leading-relaxed">
              <span className="text-muted-foreground">$</span>{" "}
              <span className="text-primary">meshmaster</span> heal turbine.stl -o fixed.stl
              {"\n"}
              <span className="text-muted-foreground">  [25%] Loading STL ... 1,284,902 faces</span>
              {"\n"}
              <span className="text-muted-foreground">  [60%] Merging duplicate verts</span>
              {"\n"}
              <span className="text-muted-foreground">  [85%] Repairing manifold edges</span>
              {"\n"}
              <span className="text-accent">  Watertight: YES</span>
              {"\n"}
              <span className="text-primary">  ✓ Saved: fixed.stl  (218 ms)</span>
            </pre>
          </div>

          <div className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-8 sm:grid-cols-4">
            <Stat value="218ms" label="Heal · 1.2M faces" />
            <Stat value="14×" label="vs. Python tools" />
            <Stat value="5" label="Export formats" />
            <Stat value="0" label="GC pauses" />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="relative border-t border-border/60 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <div className="font-display text-xs uppercase tracking-[0.2em] text-primary">
              Capabilities
            </div>
            <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
              The full mesh pipeline, in one binary.
            </h2>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <Feature
              icon={<Icon path="M12 2 4 7v10l8 5 8-5V7z" />}
              title="STL / CAD import"
              desc="Stream gigabyte STL, OBJ and PLY into a unified surface manifold with progress callbacks."
            />
            <Feature
              icon={<Icon path="M9 12h6M12 9v6M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />}
              title="Manifold healing"
              desc="Merge duplicate vertices, fix winding, fill holes — turn broken scans into watertight geometry."
            />
            <Feature
              icon={<Icon path="M3 12h18M3 6h18M3 18h18" />}
              title="Z-plane slicer"
              desc="Generate clean polyline contours and SVG cross-sections at any height. CNC and 3D-print ready."
            />
            <Feature
              icon={<Icon path="M4 17l6-6 4 4 6-8" />}
              title="Curvature analysis"
              desc="Per-vertex mean curvature heatmaps exported as colored PLY for inspection and CFD prep."
            />
            <Feature
              icon={<Icon path="M4 4h16v6H4zM4 14h16v6H4z" />}
              title="Multi-format export"
              desc="STL binary, STL ASCII, OBJ, PLY and STEP from a single export interface."
            />
            <Feature
              icon={<Icon path="M13 2 3 14h7l-1 8 10-12h-7l1-8z" />}
              title="Native C++ engine"
              desc="BVH acceleration, zero-copy buffers, multi-threaded — milliseconds where Python takes minutes."
            />
          </div>
        </div>
      </section>

      {/* PIPELINE */}
      <section id="pipeline" className="relative border-t border-border/60 bg-card/30 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="font-display text-xs uppercase tracking-[0.2em] text-primary">
                Pipeline
              </div>
              <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
                From raw scan to simulation-ready mesh — without leaving the terminal.
              </h2>
              <p className="mt-5 text-muted-foreground">
                MeshMaster mirrors the workflow real engineering teams run: import, repair,
                analyze, slice, export. Composable commands, scriptable pipelines, predictable performance.
              </p>
              <div className="mt-8">
                <Button asChild className="bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-glow hover:opacity-90">
                  <Link to="/app">Open the workbench →</Link>
                </Button>
              </div>
            </div>

            <ol className="space-y-4">
              {[
                ["import", "Load STL / OBJ / PLY into a SurfaceManifold."],
                ["heal", "Merge duplicate verts, repair non-manifold edges."],
                ["info", "Vertex/face count, watertightness, boundary report."],
                ["curvature", "Mean-curvature heatmap as colored PLY."],
                ["slice", "Z-plane cross-sections as SVG + polyline TXT."],
                ["export", "Write to STL / OBJ / PLY / STEP."],
              ].map(([cmd, desc], i) => (
                <li
                  key={cmd}
                  className="flex gap-4 rounded-lg border border-border/60 bg-background/40 p-4"
                >
                  <span className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-md bg-primary/10 font-display text-xs font-bold text-primary">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <div className="font-display text-sm">
                      <span className="text-primary">$</span> meshmaster {cmd}
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">{desc}</div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative border-t border-border/60 py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="font-display text-3xl font-bold sm:text-5xl">
            Stop fighting your mesh tools.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Three free imports. Upgrade when you're ready. No credit card to start.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-glow hover:opacity-90">
              <Link to="/login">Get started free</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/upgrade">Compare plans</Link>
            </Button>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function Icon({ path }: { path: string }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={path} />
    </svg>
  );
}
