import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  getSession,
  getImportCount,
  bumpImportCount,
  FREE_IMPORT_LIMIT,
  type User,
} from "@/lib/auth";

export const Route = createFileRoute("/app")({
  component: AppPage,
  head: () => ({
    meta: [{ title: "MeshMaster · 3D Workbench" }],
  }),
});

function AppPage() {
  const navigate = useNavigate();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [user, setUser] = useState<User | null>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const s = getSession();
    if (!s) {
      navigate({ to: "/login" });
      return;
    }
    setUser(s);
    setCount(getImportCount(s.email));
  }, [navigate]);

  useEffect(() => {
    if (!user) return;
    const onMsg = (ev: MessageEvent) => {
      const data = ev.data;
      if (!data || data.type !== "mm:stl-import-request") return;
      const reply = (allowed: boolean) =>
        iframeRef.current?.contentWindow?.postMessage(
          { type: "mm:stl-import-decision", id: data.id, allowed },
          "*",
        );
      if (user.plan === "premium") {
        reply(true);
        return;
      }
      const current = getImportCount(user.email);
      if (current >= FREE_IMPORT_LIMIT) {
        reply(false);
        navigate({ to: "/upgrade" });
        return;
      }
      const next = bumpImportCount(user.email);
      setCount(next);
      reply(true);
      if (next >= FREE_IMPORT_LIMIT) {
        // allow this import, then redirect on next attempt
      }
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [user, navigate]);

  if (!user) return null;

  const remaining =
    user.plan === "premium" ? "∞" : Math.max(0, FREE_IMPORT_LIMIT - count);

  return (
    <div className="fixed inset-0 flex flex-col bg-background">
      <div className="flex items-center justify-between border-b border-border bg-card px-4 py-2 text-xs">
        <div className="flex items-center gap-3 font-mono">
          <a href="/" className="text-primary hover:underline">
            ← MeshMaster
          </a>
          <span className="text-muted-foreground">|</span>
          <span className="text-muted-foreground">{user.email}</span>
          <span className="rounded bg-primary/10 px-2 py-0.5 uppercase tracking-wider text-primary">
            {user.plan}
          </span>
        </div>
        <div className="font-mono text-muted-foreground">
          STL imports remaining:{" "}
          <span className="text-foreground">{remaining}</span>
        </div>
      </div>
      <iframe
        ref={iframeRef}
        src="/cfd-mesh.html"
        className="h-full w-full flex-1 border-0"
        title="CFD Mesh Workbench"
      />
    </div>
  );
}
