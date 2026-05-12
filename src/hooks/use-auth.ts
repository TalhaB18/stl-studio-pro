import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { getProfile, type Profile } from "@/lib/auth";

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const refreshProfile = async (s: Session | null) => {
      if (!s) {
        if (mounted) setProfile(null);
        return;
      }
      const p = await getProfile(s.user.id);
      if (mounted) setProfile(p);
    };

    const { data: sub } = supabase.auth.onAuthStateChange((_evt, s) => {
      if (!mounted) return;
      setSession(s);
      // defer Supabase calls to avoid deadlocks per Supabase guidance
      setTimeout(() => refreshProfile(s), 0);
    });

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      refreshProfile(data.session).finally(() => mounted && setLoading(false));
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const reloadProfile = async () => {
    if (!session) return;
    const p = await getProfile(session.user.id);
    setProfile(p);
  };

  return { session, profile, loading, reloadProfile };
}
