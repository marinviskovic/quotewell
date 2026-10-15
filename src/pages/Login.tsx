import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { DEMO_PASSWORD, DEMO_USER, useAuth } from "@/auth/AuthProvider";
import { DEMO } from "@/integrations/supabase/client";
import { usePageTitle } from "@/lib/usePageTitle";
import { Button, Field, Wordmark, inputClass } from "@/components/ui";

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
  usePageTitle("Sign in");
  const from = (location.state as { from?: string } | null)?.from ?? "/app";

  if (user) return <Navigate to={from} replace />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setBusy(true);
    if (mode === "signin") {
      const err = await signIn(email, password);
      setBusy(false);
      if (err) return setError(err);
    } else {
      const res = await signUp(email, password);
      setBusy(false);
      if (res.error) return setError(res.error);
      if (res.confirmEmail) return setInfo("Check your inbox to confirm your email, then sign in.");
    }
    navigate(from, { replace: true });
  };

  return (
    <div className="flex min-h-dvh flex-col bg-paper px-4">
      <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-12">
        <Link to="/" className="self-start"><Wordmark /></Link>
        <h1 className="mt-8 text-[28px] font-semibold tracking-tight">{mode === "signin" ? "Sign in" : "Create your account"}</h1>
        <p className="mt-1 text-sm text-muted">{mode === "signin" ? "Your leads, follow-ups and quotes." : "Free while you set it up. No card needed."}</p>
        {mode === "signin" && (
          <div className="mt-5 flex items-center justify-between gap-3 rounded-lg border border-marigold/50 bg-marigold-soft/60 px-3 py-2 text-[13px] text-[#6b4800]">
            {email === DEMO_USER.email ? (
              <span>Demo account filled in. Press <b>Sign in</b> to look around.</span>
            ) : (
              <>
                <span>Just looking? Use the shared demo account.</span>
                <button type="button" onClick={() => { setEmail(DEMO_USER.email); setPassword(DEMO_PASSWORD); }} className="shrink-0 font-semibold underline underline-offset-2">
                  Fill it in
                </button>
              </>
            )}
          </div>
        )}
        <form onSubmit={submit} className="mt-5 space-y-4">
          <Field label="Email">
            <input className={inputClass} type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </Field>
          <Field label="Password">
            <input className={inputClass} type="password" required minLength={8} autoComplete={mode === "signin" ? "current-password" : "new-password"} value={password} onChange={(e) => setPassword(e.target.value)} />
          </Field>
          {error && <p role="alert" className="text-sm text-danger">{error}</p>}
          {info && <p className="text-sm text-stage-won">{info}</p>}
          <Button disabled={busy} className="w-full">{busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}</Button>
        </form>
        <button type="button" onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="mt-5 text-sm text-muted hover:text-ink">
          {mode === "signin" ? "New here? Create an account" : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}
