import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { bumpImportCount, FREE_IMPORT_LIMIT } from "@/lib/auth";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/app")({
  component: AppPage,
  head: () => ({
    meta: [{ title: "Discreetize · CFD Mesh Workbench" }],
  }),
});

function AppPage() {
  const navigate = useNavigate();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { session, profile, loading, reloadProfile } = useAuth();

  useEffect(() => {
    if (!loading && !session) {
      navigate({ to: "/login" });
    }
  }, [loading, session, navigate]);

  useEffect(() => {
    if (!session || !profile) return;
    const onMsg = async (ev: MessageEvent) => {
      const data = ev.data;
      if (!data || data.type !== "mm:stl-import-request") return;
      const reply = (allowed: boolean) =>
        iframeRef.current?.contentWindow?.postMessage(
          { type: "mm:stl-import-decision", id: data.id, allowed },
          "*",
        );

      if (profile.plan === "premium") {
        reply(true);
        return;
      }
      if (profile.import_count >= FREE_IMPORT_LIMIT) {
        reply(false);
        navigate({ to: "/upgrade" });
        return;
      }
      try {
        await bumpImportCount();
        await reloadProfile();
        reply(true);
      } catch (err) {
        console.error("bumpImportCount failed", err);
        reply(false);
      }
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [session, profile, navigate, reloadProfile]);

  if (loading || !session || !profile) return null;

  const remaining =
    profile.plan === "premium" ? "∞" : Math.max(0, FREE_IMPORT_LIMIT - profile.import_count);

  return (
    <div className="fixed inset-0 flex flex-col bg-background">
      <div className="flex items-center justify-between border-b border-border bg-card px-4 py-2 text-xs">
        <div className="flex items-center gap-3 font-mono">
          <a href="/" className="text-primary hover:underline">
            ← Discreetize
          </a>
          <span className="text-muted-foreground">|</span>
          <span className="text-muted-foreground">{profile.email}</span>
          <span className="rounded bg-primary/10 px-2 py-0.5 uppercase tracking-wider text-primary">
            {profile.plan}
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
