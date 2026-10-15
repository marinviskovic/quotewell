import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { DEMO, supabase } from "@/integrations/supabase/client";

export type User = { id: string; email: string };

type AuthState = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (email: string, password: string) => Promise<{ error?: string; confirmEmail?: boolean }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

// The public demo account. In demo mode it is a fake session in localStorage;
// with Supabase it is a real user whose sample data resets every night.
export const DEMO_USER: User = { id: "demo-user", email: "demo@quotewell.app" };
export const DEMO_PASSWORD = "demo1234";
export const isDemoAccount = (user: User | null) => user?.email === DEMO_USER.email;
const SESSION_KEY = "quotewell-demo-session";

function readDemoSession(): User | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeDemoSession(user: User | null) {
  try {
    if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    else localStorage.removeItem(SESSION_KEY);
  } catch {
    /* private mode: session lasts until reload */
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (DEMO) {
      setUser(readDemoSession());
      setLoading(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user;
      setUser(u ? { id: u.id, email: u.email ?? "" } : null);
      setLoading(false);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user;
      setUser(u ? { id: u.id, email: u.email ?? "" } : null);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    if (DEMO) {
      if (email.trim().toLowerCase() !== DEMO_USER.email || password !== DEMO_PASSWORD) {
        return "Wrong email or password.";
      }
      writeDemoSession(DEMO_USER);
      setUser(DEMO_USER);
      return null;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error ? error.message : null;
  };

  const signUp = async (email: string, password: string) => {
    if (DEMO) return { error: "Sign-ups are off in the offline demo. Use the demo account." };
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/app` },
    });
    if (error) return { error: error.message };
    // With email confirmation off, Supabase signs the user in straight away.
    return { confirmEmail: !data.session };
  };

  const signOut = async () => {
    if (DEMO) writeDemoSession(null);
    else await supabase.auth.signOut();
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
