import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import {
  bumpImportCount,
  FREE_IMPORT_LIMIT,
  getImportCount,
  getSession,
  type User,
} from "@/lib/auth";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [{ title: "Workbench — MeshMaster" }],
  }),
  component: Workbench,
});

interface ImportedMesh {
  name: string;
  bytes: number;
  triangles: number;
  format: "binary" | "ascii";
  bbox: [number, number, number];
  durationMs: number;
}

function parseSTL(buffer: ArrayBuffer): { triangles: number; format: "binary" | "ascii"; bbox: [number, number, number] } {
  // Detect ASCII vs binary
  const head = new TextDecoder().decode(new Uint8Array(buffer.slice(0, 5)));
  let triangles = 0;
  const min = [Infinity, Infinity, Infinity];
  const max = [-Infinity, -Infinity, -Infinity];

  if (head.trim().toLowerCase().startsWith("solid") && buffer.byteLength < 84_000_000) {
    // try ASCII
    const text = new TextDecoder().decode(buffer);
    const lines = text.split("\n");
    let isAscii = false;
    for (const line of lines) {
      const t = line.trim();
      if (t.startsWith("facet")) {
        triangles++;
        isAscii = true;
      } else if (t.startsWith("vertex")) {
        const parts = t.split(/\s+/);
        const x = parseFloat(parts[1]);
        const y = parseFloat(parts[2]);
        const z = parseFloat(parts[3]);
        if (!isNaN(x)) {
          min[0] = Math.min(min[0], x); max[0] = Math.max(max[0], x);
          min[1] = Math.min(min[1], y); max[1] = Math.max(max[1], y);
          min[2] = Math.min(min[2], z); max[2] = Math.max(max[2], z);
        }
      }
    }
    if (isAscii && triangles > 0) {
      return {
        triangles,
        format: "ascii",
        bbox: [max[0] - min[0], max[1] - min[1], max[2] - min[2]],
      };
    }
  }

  // Binary
  const dv = new DataView(buffer);
  if (buffer.byteLength < 84) throw new Error("File too small to be a valid STL");
  triangles = dv.getUint32(80, true);
  const expected = 84 + triangles * 50;
  if (expected !== buffer.byteLength) {
    // Not a strict binary STL; still try to read what we can
  }
  let off = 84;
  const tris = Math.min(triangles, Math.floor((buffer.byteLength - 84) / 50));
  for (let i = 0; i < tris; i++) {
    off += 12; // skip normal
    for (let v = 0; v < 3; v++) {
      const x = dv.getFloat32(off, true);
      const y = dv.getFloat32(off + 4, true);
      const z = dv.getFloat32(off + 8, true);
      off += 12;
      min[0] = Math.min(min[0], x); max[0] = Math.max(max[0], x);
      min[1] = Math.min(min[1], y); max[1] = Math.max(max[1], y);
      min[2] = Math.min(min[2], z); max[2] = Math.max(max[2], z);
    }
    off += 2; // attribute
  }
  return {
    triangles,
    format: "binary",
    bbox: [max[0] - min[0], max[1] - min[1], max[2] - min[2]],
  };
}

function Workbench() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [count, setCount] = useState(0);
  const [mesh, setMesh] = useState<ImportedMesh | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const s = getSession();
    if (!s) {
      router.navigate({ to: "/login" });
      return;
    }
    setUser(s);
    setCount(getImportCount(s.email));
  }, [router]);

  if (!user) return null;

  const remaining = user.plan === "premium" ? Infinity : Math.max(0, FREE_IMPORT_LIMIT - count);

  const handleFiles = async (files: FileList | null) => {
    if (!files || !files[0]) return;
    setError("");

    // Free plan gate
    if (user.plan !== "premium" && count >= FREE_IMPORT_LIMIT) {
      router.navigate({ to: "/upgrade" });
      return;
    }

    const file = files[0];
    if (!file.name.toLowerCase().endsWith(".stl")) {
      setError("Please select an .stl file.");
      return;
    }

    setLoading(true);
    setMesh(null);
    setLog([]);

    const append = (s: string) => setLog((prev) => [...prev, s]);
    append(`$ meshmaster import ${file.name}`);
    append(`  [10%] Reading ${(file.size / 1024 / 1024).toFixed(2)} MB ...`);

    try {
      const t0 = performance.now();
      const buf = await file.arrayBuffer();
      append(`  [40%] Parsing geometry ...`);
      await new Promise((r) => setTimeout(r, 120));
      const parsed = parseSTL(buf);
      append(`  [80%] Building manifold ...`);
      await new Promise((r) => setTimeout(r, 120));
      const dt = performance.now() - t0;
      const result: ImportedMesh = {
        name: file.name,
        bytes: file.size,
        triangles: parsed.triangles,
        format: parsed.format,
        bbox: parsed.bbox,
        durationMs: dt,
      };
      setMesh(result);
      append(`  ✓ Loaded ${parsed.triangles.toLocaleString()} triangles in ${dt.toFixed(0)} ms`);

      if (user.plan !== "premium") {
        const next = bumpImportCount(user.email);
        setCount(next);
        if (next >= FREE_IMPORT_LIMIT) {
          append(`  ! Free-plan import limit reached (${FREE_IMPORT_LIMIT}/${FREE_IMPORT_LIMIT})`);
          setTimeout(() => router.navigate({ to: "/upgrade" }), 1500);
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to parse STL");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="font-display text-xs uppercase tracking-[0.2em] text-primary">
              Workbench
            </div>
            <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
              Import & inspect STL
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Drop an .stl file to load it through the MeshMaster pipeline.
            </p>
          </div>

          <div className="rounded-lg border border-border/70 bg-card px-4 py-3 text-sm shadow-card">
            <div className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">
              Plan
            </div>
            <div className="mt-0.5 flex items-center gap-3">
              <span className={user.plan === "premium" ? "font-semibold text-accent" : "font-semibold text-primary"}>
                {user.plan === "premium" ? "PREMIUM" : "FREE"}
              </span>
              {user.plan !== "premium" && (
                <span className="text-xs text-muted-foreground">
                  {count}/{FREE_IMPORT_LIMIT} imports used
                </span>
              )}
            </div>
          </div>
        </div>

        {user.plan !== "premium" && remaining <= 1 && (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-accent/40 bg-accent/10 px-4 py-3 text-sm">
            <div>
              <span className="font-semibold text-accent">
                {remaining === 0 ? "Limit reached." : "Last free import."}
              </span>{" "}
              <span className="text-muted-foreground">
                Upgrade to Premium for unlimited imports and advanced features.
              </span>
            </div>
            <Button asChild size="sm" className="bg-accent text-accent-foreground hover:opacity-90">
              <Link to="/upgrade">Upgrade</Link>
            </Button>
          </div>
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-5">
          {/* Drop zone */}
          <div className="lg:col-span-3">
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleFiles(e.dataTransfer.files);
              }}
              onClick={() => inputRef.current?.click()}
              className="group flex h-72 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/80 bg-card/50 transition-colors hover:border-primary/60 hover:bg-card"
            >
              <input
                ref={inputRef}
                type="file"
                accept=".stl"
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
              <div className="grid h-14 w-14 place-items-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                </svg>
              </div>
              <div className="mt-4 font-display text-sm">
                {loading ? "Processing..." : "Drop .stl file or click to browse"}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">Binary or ASCII · up to 200 MB</div>
            </div>

            {error && (
              <div className="mt-4 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                {error}
              </div>
            )}

            {/* Log */}
            {log.length > 0 && (
              <pre className="mt-6 overflow-x-auto rounded-lg border border-border/70 bg-card p-4 font-display text-[12px] leading-relaxed shadow-card">
                {log.map((line, i) => (
                  <div
                    key={i}
                    className={
                      line.startsWith("$")
                        ? "text-primary"
                        : line.includes("✓")
                        ? "text-accent"
                        : line.includes("!")
                        ? "text-destructive"
                        : "text-muted-foreground"
                    }
                  >
                    {line}
                  </div>
                ))}
              </pre>
            )}
          </div>

          {/* Stats */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-border/70 bg-card p-6 shadow-card">
              <div className="font-display text-xs uppercase tracking-wider text-muted-foreground">
                Mesh report
              </div>
              {mesh ? (
                <dl className="mt-4 space-y-3 text-sm">
                  <Row k="File" v={mesh.name} />
                  <Row k="Format" v={`STL ${mesh.format}`} />
                  <Row k="Size" v={`${(mesh.bytes / 1024 / 1024).toFixed(2)} MB`} />
                  <Row k="Triangles" v={mesh.triangles.toLocaleString()} />
                  <Row k="Bounds X" v={mesh.bbox[0].toFixed(3)} />
                  <Row k="Bounds Y" v={mesh.bbox[1].toFixed(3)} />
                  <Row k="Bounds Z" v={mesh.bbox[2].toFixed(3)} />
                  <Row k="Parsed in" v={`${mesh.durationMs.toFixed(0)} ms`} />
                </dl>
              ) : (
                <div className="mt-4 text-sm text-muted-foreground">
                  No mesh loaded yet. Import an STL to see vertex/face counts, bounding box and watertight status.
                </div>
              )}
            </div>

            <div className="mt-4 rounded-xl border border-border/70 bg-card p-6 shadow-card">
              <div className="font-display text-xs uppercase tracking-wider text-muted-foreground">
                Available actions
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                {["heal", "info", "slice", "curvature", "export", "step"].map((c) => (
                  <div
                    key={c}
                    className={`rounded border border-border/70 px-3 py-2 font-display ${
                      mesh ? "text-foreground" : "text-muted-foreground/60"
                    }`}
                  >
                    <span className="text-primary">$</span> {c}
                  </div>
                ))}
              </div>
              {user.plan !== "premium" && (
                <div className="mt-3 text-[11px] text-muted-foreground">
                  Slicing & curvature export require Premium.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border/40 pb-2">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="font-display text-sm">{v}</dd>
    </div>
  );
}
