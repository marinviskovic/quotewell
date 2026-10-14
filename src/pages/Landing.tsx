import { Link } from "react-router-dom";
import { ArrowRight, BellRing, Columns3, ShieldCheck } from "lucide-react";
import { Wordmark } from "@/components/ui";
import { usePageTitle } from "@/lib/usePageTitle";

const features = [
  {
    icon: BellRing,
    title: "Follow-ups you won't forget",
    body: "Every lead gets a next date. Each morning QuoteWell shows who to call, who's overdue and who's waiting on a quote.",
  },
  {
    icon: Columns3,
    title: "A pipeline you can read in a glance",
    body: "New, contacted, quoted, won. See what each stage is worth and which big jobs are still open.",
  },
  {
    icon: ShieldCheck,
    title: "Your customer list stays yours",
    body: "Each account only ever sees its own leads, enforced in the database, not just hidden in the app.",
  },
];

const rows = [
  { name: "Elena Novak", job: "Office courtyard", tag: "Overdue", tone: "bg-danger-soft text-danger", value: "$5,600" },
  { name: "Maria Gonzalez", job: "Backyard redesign", tag: "Today", tone: "bg-marigold-soft text-[#7a5200]", value: "$4,800" },
  { name: "Priya Raman", job: "Drip irrigation", tag: "Today", tone: "bg-marigold-soft text-[#7a5200]", value: "$1,200" },
  { name: "Daniel Okafor", job: "Monthly maintenance", tag: "Tomorrow", tone: "bg-paper text-ink", value: "$650" },
];

export default function Landing() {
  usePageTitle("");
  return (
    <div className="min-h-dvh bg-paper text-ink">
      <header className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" aria-label="QuoteWell home"><Wordmark /></Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link to="/login" className="flex h-9 items-center rounded-lg px-3 text-sm font-medium text-muted hover:text-ink">Sign in</Link>
          <Link to="/login" className="flex h-9 items-center rounded-lg bg-ink px-3.5 text-sm font-medium text-white hover:bg-ink/85">Try the demo</Link>
        </nav>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-16 pt-10 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pb-24 lg:pt-20">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface px-3 py-1 text-xs font-medium text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-stage-won" /> For landscapers, cleaners and small crews
            </p>
            <h1 className="mt-5 text-[40px] font-semibold leading-[1.04] tracking-[-0.03em] sm:text-[56px]">
              Every lead and follow-up, in <span className="font-display text-[1.12em] font-normal italic tracking-normal text-fern">one calm place.</span>
            </h1>
            <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-muted">
              QuoteWell is a simple CRM for small service businesses. See who to call today, what you've quoted and what's booked, on your laptop or your phone in the truck.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/login" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-fern px-6 text-[15px] font-medium text-white shadow-card hover:bg-fern-hover">
                Open the live demo <ArrowRight size={17} />
              </Link>
              <a href="#features" className="inline-flex h-12 items-center justify-center rounded-xl border border-line-strong bg-surface px-6 text-[15px] font-medium hover:bg-paper">
                See what it does
              </a>
            </div>
          </div>

          <div className="relative" aria-hidden="true">
            <div className="absolute -inset-6 -z-0 rounded-[32px] bg-[radial-gradient(60%_60%_at_70%_30%,#e4eee8,transparent)]" />
            <div className="relative rounded-2xl border border-line bg-surface p-4 shadow-pop sm:p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-muted">Wednesday</div>
                  <div className="text-[15px] font-semibold">Follow-ups</div>
                </div>
                <div className="rounded-lg bg-marigold-soft px-2.5 py-1 text-xs font-medium text-[#7a5200]">3 due today</div>
              </div>
              <ul className="mt-3 divide-y divide-line">
                {rows.map((r) => (
                  <li key={r.name} className="flex items-center gap-3 py-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-paper text-xs font-semibold text-muted">
                      {r.name.split(" ").map((p) => p[0]).join("")}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">{r.name}</div>
                      <div className="truncate text-xs text-muted">{r.job}</div>
                    </div>
                    <span className={`rounded-md px-1.5 py-0.5 text-[11px] font-medium ${r.tone}`}>{r.tag}</span>
                    <span className="num w-14 text-right text-sm font-semibold">{r.value}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-2 grid grid-cols-3 gap-2 border-t border-line pt-4 text-center">
                <div><div className="num text-lg font-semibold">$53.7k</div><div className="text-[11px] text-muted">open pipeline</div></div>
                <div><div className="num text-lg font-semibold">8</div><div className="text-[11px] text-muted">open leads</div></div>
                <div><div className="num text-lg font-semibold">75%</div><div className="text-[11px] text-muted">win rate</div></div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="border-t border-line bg-surface/60">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
            <h2 className="max-w-xl text-[28px] font-semibold leading-tight tracking-tight sm:text-[34px]">
              Built for the owner who answers the phone <span className="font-display font-normal italic text-fern">and</span> does the job.
            </h2>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {features.map((f) => (
                <article key={f.title} className="rounded-2xl border border-line bg-surface p-6 shadow-card">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-fern-soft text-fern"><f.icon size={20} /></span>
                  <h3 className="mt-4 text-[17px] font-semibold">{f.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted">{f.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-fern px-6 py-10 text-white sm:px-10 md:flex-row md:items-center">
            <div>
              <h2 className="text-[26px] font-semibold tracking-tight sm:text-[30px]">See it with real-looking data.</h2>
              <p className="mt-2 max-w-lg text-white/75">The demo is a full account for Fernway Landscaping, a made-up crew in Portland. Click around, add a lead, move a job to won.</p>
            </div>
            <Link to="/login" className="inline-flex h-12 shrink-0 items-center gap-2 rounded-xl bg-white px-6 text-[15px] font-medium text-fern hover:bg-paper">
              Open the live demo <ArrowRight size={17} />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span>QuoteWell is a concept product. Names and data in the demo are made up.</span>
          <span>Rescued and launched by Webradiona</span>
        </div>
      </footer>
    </div>
  );
}
