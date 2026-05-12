// Supabase-backed auth + plan tracking.
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";

export type Plan = "free" | "premium";
export interface Profile {
  id: string;
  email: string;
  name: string;
  plan: Plan;
  import_count: number;
}

export const FREE_IMPORT_LIMIT = 3;

const SEED_EMAIL = "talhab@discreetize.com";
const SEED_PASSWORD = "btalha18";

let seedAttempted = false;

/** Best-effort: ensures the demo Premium account exists. Safe to call repeatedly. */
export async function ensureSeedAccount() {
  if (seedAttempted || typeof window === "undefined") return;
  seedAttempted = true;
  try {
    await supabase.auth.signUp({
      email: SEED_EMAIL,
      password: SEED_PASSWORD,
      options: {
        emailRedirectTo: `${window.location.origin}/app`,
        data: { name: "Talha B." },
      },
    });
  } catch {
    // ignore — already exists
  }
}

export async function signUp(email: string, password: string, name: string) {
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/app`,
      data: { name },
    },
  });
  if (error) throw error;
}

export async function signIn(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

export async function signOut() {
  await supabase.auth.signOut();
}

export async function getSession(): Promise<Session | null> {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id,email,name,plan,import_count")
    .eq("id", userId)
    .maybeSingle();
  if (error) {
    console.error("getProfile error", error);
    return null;
  }
  return (data as Profile) ?? null;
}

export async function bumpImportCount(): Promise<number> {
  const { data, error } = await supabase.rpc("bump_import");
  if (error) throw error;
  return data as number;
}

export async function upgradeCurrent(): Promise<void> {
  const { error } = await supabase.rpc("upgrade_to_premium");
  if (error) throw error;
}
