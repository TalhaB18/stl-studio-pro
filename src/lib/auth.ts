// Simple client-side auth + plan tracking (demo).
// NOTE: This is a presentation-only auth layer using localStorage.
export type Plan = "free" | "premium";
export interface User {
  email: string;
  name: string;
  plan: Plan;
}

const USERS_KEY = "mm_users_v1";
const SESSION_KEY = "mm_session_v1";
const IMPORTS_KEY = "mm_import_count_v1";
export const FREE_IMPORT_LIMIT = 3;

interface StoredUser extends User {
  password: string;
}

const SEED_ACCOUNTS: StoredUser[] = [
  { email: "talhab@discreetize.com", password: "btalha18", name: "Talha B.", plan: "premium" },
  // alias for the originally-typed misspelling, just in case
  { email: "talhab@dicreetize.com",  password: "btalha18", name: "Talha B.", plan: "premium" },
];

function seed() {
  if (typeof window === "undefined") return;
  let users: StoredUser[] = [];
  try { users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]"); } catch { users = []; }
  let changed = false;
  for (const acct of SEED_ACCOUNTS) {
    const i = users.findIndex((u) => u.email.toLowerCase() === acct.email.toLowerCase());
    if (i === -1) { users.push(acct); changed = true; }
    else if (users[i].password !== acct.password || users[i].plan !== acct.plan) {
      users[i] = { ...users[i], ...acct }; changed = true;
    }
  }
  if (changed) localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function readUsers(): StoredUser[] {
  seed();
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeUsers(u: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(u));
}

export function signUp(email: string, password: string, name: string): User {
  const users = readUsers();
  if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error("An account with that email already exists.");
  }
  const u: StoredUser = { email, password, name, plan: "free" };
  users.push(u);
  writeUsers(users);
  const pub: User = { email: u.email, name: u.name, plan: u.plan };
  localStorage.setItem(SESSION_KEY, JSON.stringify(pub));
  return pub;
}

export function signIn(email: string, password: string): User {
  const users = readUsers();
  const u = users.find(
    (x) => x.email.toLowerCase() === email.toLowerCase() && x.password === password,
  );
  if (!u) throw new Error("Invalid email or password.");
  const pub: User = { email: u.email, name: u.name, plan: u.plan };
  localStorage.setItem(SESSION_KEY, JSON.stringify(pub));
  return pub;
}

export function signOut() {
  localStorage.removeItem(SESSION_KEY);
}

export function getSession(): User | null {
  if (typeof window === "undefined") return null;
  seed();
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const pub: User = JSON.parse(raw);
    // re-sync plan from users (in case upgraded)
    const users = readUsers();
    const fresh = users.find((u) => u.email === pub.email);
    if (fresh) {
      const refreshed: User = { email: fresh.email, name: fresh.name, plan: fresh.plan };
      localStorage.setItem(SESSION_KEY, JSON.stringify(refreshed));
      return refreshed;
    }
    return pub;
  } catch {
    return null;
  }
}

export function upgradeCurrent(): User | null {
  const sess = getSession();
  if (!sess) return null;
  const users = readUsers();
  const idx = users.findIndex((u) => u.email === sess.email);
  if (idx === -1) return null;
  users[idx].plan = "premium";
  writeUsers(users);
  return getSession();
}

export function getImportCount(email: string): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = JSON.parse(localStorage.getItem(IMPORTS_KEY) || "{}");
    return raw[email] || 0;
  } catch {
    return 0;
  }
}

export function bumpImportCount(email: string): number {
  const raw = JSON.parse(localStorage.getItem(IMPORTS_KEY) || "{}");
  raw[email] = (raw[email] || 0) + 1;
  localStorage.setItem(IMPORTS_KEY, JSON.stringify(raw));
  return raw[email];
}
