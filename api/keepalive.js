// Called once a day by the Vercel cron in vercel.json. Supabase pauses a free project after
// a week without traffic, which would break the public demo; one signed-in read keeps it awake.
// The demo account is public (it is on the sign-in page) and only sees its own sample leads.
const DEMO_EMAIL = "demo@quotewell.app";
const DEMO_PASSWORD = "demo1234";

export async function GET(request) {
  // Vercel sends CRON_SECRET as a bearer token when it is set; without it the ping stays public.
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ ok: false }, { status: 401 });
  }

  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) return Response.json({ ok: false, error: "Supabase is not configured" }, { status: 500 });
  const headers = { apikey: key, "Content-Type": "application/json" };

  const signIn = await fetch(`${url}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers,
    body: JSON.stringify({ email: DEMO_EMAIL, password: DEMO_PASSWORD }),
  });
  if (!signIn.ok) return Response.json({ ok: false, step: "sign-in", status: signIn.status }, { status: 502 });
  const { access_token } = await signIn.json();

  const leads = await fetch(`${url}/rest/v1/leads?select=id&limit=1`, {
    headers: { ...headers, Authorization: `Bearer ${access_token}` },
  });
  if (!leads.ok) return Response.json({ ok: false, step: "read", status: leads.status }, { status: 502 });

  return Response.json({ ok: true, checkedAt: new Date().toISOString() });
}
