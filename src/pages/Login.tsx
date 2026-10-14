import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { DEMO_PASSWORD, DEMO_USER, useAuth } from "@/auth/AuthProvider";
import { DEMO } from "@/integrations/supabase/client";

export default function Login() {
  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState(DEMO ? DEMO_USER.email : "");
  const [password, setPassword] = useState(DEMO ? DEMO_PASSWORD : "");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const from = (location.state as { from?: string } | null)?.from ?? "/";

  if (user) return <Navigate to={from} replace />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setBusy(true);
    const err = mode === "signin" ? await signIn(email, password) : await signUp(email, password);
    setBusy(false);
    if (err) return setError(err);
    if (mode === "signup") return setInfo("Check your inbox to confirm your email, then sign in.");
    navigate(from, { replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-violet-50 to-fuchsia-50">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-2xl bg-white p-8 shadow-lg">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white">
            <Sparkles size={16} />
          </div>
          <span className="text-lg font-bold">QuoteWell</span>
        </div>
        <h1 className="text-2xl font-bold">{mode === "signin" ? "Welcome back" : "Create your account"}</h1>
        <input className="w-full rounded-md border px-3 py-2 text-sm" type="email" required autoComplete="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full rounded-md border px-3 py-2 text-sm" type="password" required minLength={8} autoComplete={mode === "signin" ? "current-password" : "new-password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
        {info && <p className="text-sm text-green-700">{info}</p>}
        <button disabled={busy} className="w-full rounded-md bg-violet-600 py-2 text-sm font-medium text-white disabled:opacity-60">
          {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Sign up"}
        </button>
        <button type="button" onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="w-full text-sm text-slate-500">
          {mode === "signin" ? "No account yet? Sign up" : "Already have an account? Sign in"}
        </button>
      </form>
    </div>
  );
}
