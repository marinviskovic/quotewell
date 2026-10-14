import { Link } from "react-router-dom";
import { useLeads } from "@/lib/useLeads";
import { STAGES } from "@/lib/stages";
import { formatMoney } from "@/lib/format";
import { stageStyle } from "@/components/StageBadge";
import FollowUpChip from "@/components/FollowUpChip";
import { ErrorNote, PageSkeleton } from "@/components/states";

export default function Pipeline() {
  const { leads, error } = useLeads();
  if (error) return <ErrorNote message={error} />;
  if (!leads) return <PageSkeleton />;

  const columns = STAGES.filter((s) => s.id !== "lost").map((s) => {
    const rows = leads.filter((l) => l.stage === s.id).sort((a, b) => Number(b.value) - Number(a.value));
    return { ...s, rows, total: rows.reduce((sum, l) => sum + Number(l.value), 0) };
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-[28px]">Pipeline</h1>
        <p className="mt-0.5 text-sm text-muted">Every job, from first call to booked.</p>
      </div>
      <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0">
        {columns.map((c) => (
          <section key={c.id} className="w-[82%] shrink-0 snap-start rounded-xl bg-black/[0.035] p-2 sm:w-72 lg:w-auto" aria-label={c.label}>
            <header className="flex items-center justify-between px-2 pb-2.5 pt-1.5">
              <span className="flex items-center gap-2 text-sm font-semibold">
                <span className={`h-2 w-2 rounded-full ${stageStyle[c.id].dot}`} />
                {c.label}
                <span className="font-normal text-faint">{c.rows.length}</span>
              </span>
              <span className="num text-[13px] text-muted">{formatMoney(c.total)}</span>
            </header>
            <ul className="space-y-2">
              {c.rows.map((l) => (
                <li key={l.id}>
                  <Link to={`/app/leads/${l.id}`} className="block rounded-lg border border-line bg-surface p-3 shadow-card transition-shadow hover:shadow-pop">
                    <div className="text-sm font-medium">{l.name}</div>
                    <div className="mt-0.5 truncate text-[13px] text-muted">{l.service}</div>
                    <div className="mt-2.5 flex items-center justify-between gap-2">
                      {c.id === "won" ? <span className="text-xs text-faint">{l.source}</span> : <FollowUpChip date={l.follow_up} />}
                      <span className="num text-[13px] font-semibold">{formatMoney(l.value)}</span>
                    </div>
                  </Link>
                </li>
              ))}
              {c.rows.length === 0 && <li className="rounded-lg border border-dashed border-line-strong px-3 py-6 text-center text-xs text-faint">Empty</li>}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
