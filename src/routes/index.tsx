import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AnimatedMesh } from "@/components/AnimatedMesh";
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

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

function Stat({ value, label, delay = 0 }: { value: string; label: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay }}
    >
      <div className="font-display text-3xl font-bold text-gradient">{value}</div>
      <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
    </motion.div>
  );
}

function Feature({
  title,
  desc,
  icon,
  i,
}: {
  title: string;
  desc: string;
  icon: React.ReactNode;
  i: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: i * 0.07 }}
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-xl border border-border/70 bg-card p-6 shadow-card transition-colors hover:border-primary/50"
    >
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden
      />
      <div className="mb-4 grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
        {icon}
      </div>
      <h3 className="font-display text-base font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
    </motion.div>
  );
}

function Landing() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const meshY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const meshScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* HERO */}
      <section ref={heroRef} className="relative overflow-hidden bg-hero">
        <div className="absolute inset-0 bg-grid" aria-hidden />

        {/* floating gradient orbs */}
        <motion.div
          className="pointer-events-none absolute -left-40 top-20 h-[420px] w-[420px] rounded-full bg-primary/20 blur-[120px]"
          animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden
        />
        <motion.div
          className="pointer-events-none absolute -right-40 top-60 h-[480px] w-[480px] rounded-full bg-accent/20 blur-[140px]"
          animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden
        />

        <div className="relative mx-auto max-w-7xl px-6 pt-20 pb-28 sm:pt-28 sm:pb-36">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
            <motion.div style={{ y: textY }} initial="hidden" animate="show">
              <motion.div
                variants={fadeUp}
                className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/60 px-3 py-1 font-display text-[11px] tracking-wide text-muted-foreground backdrop-blur"
              >
                <motion.span
                  className="h-1.5 w-1.5 rounded-full bg-primary shadow-glow"
                  animate={{ opacity: [1, 0.3, 1], scale: [1, 1.4, 1] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                />
                v2.0 — CFD-grade mesh pipeline, now native
              </motion.div>
              <motion.h1
                variants={fadeUp}
                transition={{ delay: 0.08, duration: 0.7 }}
                className="mt-6 font-display text-5xl font-bold leading-[1.05] sm:text-6xl md:text-7xl"
              >
                Mesh processing
                <br />
                at <span className="text-gradient">C++ speed.</span>
              </motion.h1>
              <motion.p
                variants={fadeUp}
                transition={{ delay: 0.16, duration: 0.7 }}
                className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
              >
                Heal broken STLs, slice geometry, run curvature analysis and export
                to STL/OBJ/PLY/STEP — all from a single, blistering-fast engine
                engineers actually trust.
              </motion.p>
              <motion.div
                variants={fadeUp}
                transition={{ delay: 0.24, duration: 0.7 }}
                className="mt-10 flex flex-wrap items-center gap-3"
              >
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-glow transition-transform hover:scale-105 hover:opacity-95"
                >
                  <Link to="/app">Try the workbench →</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="hover:bg-card">
                  <Link to="/upgrade">See pricing</Link>
                </Button>
              </motion.div>
              <motion.div
                variants={fadeUp}
                transition={{ delay: 0.32, duration: 0.7 }}
                className="mt-4 font-display text-[11px] text-muted-foreground"
              >
                No card required · 3 free imports
              </motion.div>
            </motion.div>

            {/* animated 3D mesh */}
            <motion.div
              style={{ y: meshY, scale: meshScale }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative mx-auto aspect-square w-full max-w-[440px]"
            >
              <AnimatedMesh />
            </motion.div>
          </div>

          {/* terminal preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="mx-auto mt-20 max-w-3xl overflow-hidden rounded-xl border border-border/70 bg-card shadow-card"
          >
            <div className="flex items-center gap-2 border-b border-border/70 px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-accent/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-primary/70" />
              <span className="ml-3 font-display text-[11px] text-muted-foreground">
                ~/projects · meshmaster
              </span>
            </div>
            <TypedTerminal />
          </motion.div>

          <div className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-8 sm:grid-cols-4">
            <Stat value="218ms" label="Heal · 1.2M faces" />
            <Stat value="14×" label="vs. Python tools" delay={0.1} />
            <Stat value="5" label="Export formats" delay={0.2} />
            <Stat value="0" label="GC pauses" delay={0.3} />
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <section className="relative border-y border-border/60 bg-card/30 py-6 overflow-hidden">
        <div className="flex gap-12 whitespace-nowrap animate-[marquee_30s_linear_infinite]">
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="flex shrink-0 items-center gap-12 pr-12 font-display text-sm text-muted-foreground">
              {["STL", "OBJ", "PLY", "STEP", "BVH ACCEL", "ZERO-COPY", "MULTI-THREADED", "CFD-READY", "MANIFOLD", "WATERTIGHT"].map((t) => (
                <span key={t} className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  {t}
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="relative border-t border-border/60 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-2xl text-center"
          >
            <div className="font-display text-xs uppercase tracking-[0.2em] text-primary">
              Capabilities
            </div>
            <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
              The full mesh pipeline, in one binary.
            </h2>
          </motion.div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { t: "STL / CAD import", d: "Stream gigabyte STL, OBJ and PLY into a unified surface manifold with progress callbacks.", p: "M12 2 4 7v10l8 5 8-5V7z" },
              { t: "Manifold healing", d: "Merge duplicate vertices, fix winding, fill holes — turn broken scans into watertight geometry.", p: "M9 12h6M12 9v6M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" },
              { t: "Z-plane slicer", d: "Generate clean polyline contours and SVG cross-sections at any height. CNC and 3D-print ready.", p: "M3 12h18M3 6h18M3 18h18" },
              { t: "Curvature analysis", d: "Per-vertex mean curvature heatmaps exported as colored PLY for inspection and CFD prep.", p: "M4 17l6-6 4 4 6-8" },
              { t: "Multi-format export", d: "STL binary, STL ASCII, OBJ, PLY and STEP from a single export interface.", p: "M4 4h16v6H4zM4 14h16v6H4z" },
              { t: "Native C++ engine", d: "BVH acceleration, zero-copy buffers, multi-threaded — milliseconds where Python takes minutes.", p: "M13 2 3 14h7l-1 8 10-12h-7l1-8z" },
            ].map((f, i) => (
              <Feature key={f.t} i={i} title={f.t} desc={f.d} icon={<Icon path={f.p} />} />
            ))}
          </div>
        </div>
      </section>

      {/* PIPELINE */}
      <section id="pipeline" className="relative border-t border-border/60 bg-card/30 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7 }}
            >
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
                <Button asChild className="bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-glow transition-transform hover:scale-105">
                  <Link to="/app">Open the workbench →</Link>
                </Button>
              </div>
            </motion.div>

            <ol className="space-y-4">
              {[
                ["import", "Load STL / OBJ / PLY into a SurfaceManifold."],
                ["heal", "Merge duplicate verts, repair non-manifold edges."],
                ["info", "Vertex/face count, watertightness, boundary report."],
                ["curvature", "Mean-curvature heatmap as colored PLY."],
                ["slice", "Z-plane cross-sections as SVG + polyline TXT."],
                ["export", "Write to STL / OBJ / PLY / STEP."],
              ].map(([cmd, desc], i) => (
                <motion.li
                  key={cmd}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  whileHover={{ x: 4, borderColor: "oklch(0.82 0.16 195 / 0.6)" }}
                  className="flex gap-4 rounded-lg border border-border/60 bg-background/40 p-4 transition-colors"
                >
                  <span className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-md bg-primary/10 font-display text-xs font-bold text-primary ring-1 ring-primary/20">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <div className="font-display text-sm">
                      <span className="text-primary">$</span> meshmaster {cmd}
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">{desc}</div>
                  </div>
                </motion.li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative border-t border-border/60 py-24">
        <motion.div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[100px]"
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 6, repeat: Infinity }}
          aria-hidden
        />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative mx-auto max-w-4xl px-6 text-center"
        >
          <h2 className="font-display text-3xl font-bold sm:text-5xl">
            Stop fighting your mesh tools.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Three free imports. Upgrade when you're ready. No credit card to start.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-glow transition-transform hover:scale-105">
              <Link to="/login">Get started free</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/upgrade">Compare plans</Link>
            </Button>
          </div>
        </motion.div>
      </section>

      <SiteFooter />
    </div>
  );
}

function TypedTerminal() {
  const lines = [
    { d: 250, text: "$ meshmaster heal turbine.stl -o fixed.stl", cls: "" },
    { d: 600, text: "  [25%] Loading STL ... 1,284,902 faces", cls: "text-muted-foreground" },
    { d: 900, text: "  [60%] Merging duplicate verts", cls: "text-muted-foreground" },
    { d: 1200, text: "  [85%] Repairing manifold edges", cls: "text-muted-foreground" },
    { d: 1500, text: "  Watertight: YES", cls: "text-accent" },
    { d: 1800, text: "  ✓ Saved: fixed.stl  (218 ms)", cls: "text-primary" },
  ];
  return (
    <pre className="overflow-x-auto p-5 text-left font-display text-[12.5px] leading-relaxed">
      {lines.map((l, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: l.d / 1000, duration: 0.3 }}
          className={l.cls}
        >
          {l.text}
        </motion.div>
      ))}
    </pre>
  );
}

function Icon({ path }: { path: string }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={path} />
    </svg>
  );
}
