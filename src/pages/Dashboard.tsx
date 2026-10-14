import { Link } from "react-router-dom";
import { ArrowUpRight, Plus } from "lucide-react";
import { useLeads } from "@/lib/useLeads";
import { daysFromToday, formatMoney, parseDay, todayKey } from "@/lib/format";
import { STAGES } from "@/lib/stages";
import { useOpenLeadForm } from "@/components/Layout";
import StageBadge, { stageStyle } from "@/components/StageBadge";
import FollowUpChip from "@/components/FollowUpChip";
import { Button, Card } from "@/components/ui";
import { ErrorNote, PageSkeleton } from "@/components/states";

export default function Dashboard() {
  const { leads, error } = useLeads();
  const openForm = useOpenLeadForm();
  if (error) return <ErrorNote message={error} />;
  if (!leads) return <PageSkeleton />;

  const open = leads.filter((l) => l.stage !== "won" && l.stage !== "lost");
  const pipeline = open.reduce((sum, l) => sum + Number(l.value), 0);
  const recent = (iso: string) => Date.now() - new Date(iso).getTime() < 30 * 86_400_000;
  const wonRecent = leads.filter((l) => l.stage === "won" && recent(l.created_at));
  const closed = leads.filter((l) => l.stage === "won" || l.stage === "lost");
  const winRate = closed.length ? Math.round((leads.filter((l) => l.stage === "won").length / closed.length) * 100) : 0;
  const followUps = open
    .filter((l) => l.follow_up && daysFromToday(l.follow_up) <= 3)
    .sort((a, b) => a.follow_up!.localeCompare(b.follow_up!));
  const dueNow = followUps.filter((l) => daysFromToday(l.follow_up!) <= 0).length;
  const byStage = STAGES.filter((s) => s.id !== "lost").map((s) => {
    const rows = leads.filter((l) => l.stage === s.id);
    return { ...s, count: rows.length, value: rows.reduce((sum, l) => sum + Number(l.value), 0) };
  });
  const maxStage = Math.max(...byStage.map((s) => s.value), 1);
  const newest = [...leads].sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, 5);

  const stats = [
    { label: "Open pipeline", value: formatMoney(pipeline), sub: `${open.length} open leads` },
    { label: "Due today", value: String(dueNow), sub: dueNow === 1 ? "follow-up to make" : "follow-ups to make", highlight: dueNow > 0 },
    { label: "Won, last 30 days", value: formatMoney(wonRecent.reduce((s, l) => s + Number(l.value), 0)), sub: `${wonRecent.length} jobs booked` },
    { label: "Win rate", value: `${winRate}%`, sub: `of ${closed.length} closed leads` },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted">{parseDay(todayKey()).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
          <h1 className="mt-0.5 text-2xl font-semibold tracking-tight sm:text-[28px]">Good to see you, Fernway</h1>
        </div>
        <div className="hidden sm:block"><Button onClick={openForm}><Plus size={16} /> New lead</Button></div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {stats.map((s) => (
          <Card key={s.label} className={`p-4 sm:p-5 ${s.highlight ? "border-marigold/60 bg-marigold-soft/50" : ""}`}>
            <div className="text-[13px] text-muted">{s.label}</div>
            <div className="num mt-1.5 text-[22px] font-semibold tracking-tight sm:text-[26px]">{s.value}</div>
            <div className="mt-0.5 text-xs text-faint">{s.sub}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between px-5 pb-2 pt-4">
            <h2 className="font-semibold">Follow-ups</h2>
            <span className="text-xs text-muted">Overdue and next 3 days</span>
          </div>
          {followUps.length === 0 ? (
            <p className="px-5 pb-6 pt-2 text-sm text-muted">Nothing due. Nice.</p>
          ) : (
            <ul className="divide-y divide-line">
              {followUps.map((l) => (
                <li key={l.id}>
                  <Link to={`/app/leads/${l.id}`} className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-paper/70">
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">{l.name}{l.company && <span className="font-normal text-muted"> · {l.company}</span>}</div>
                      <div className="truncate text-[13px] text-muted">{l.service}</div>
                    </div>
                    <div className="hidden sm:block"><StageBadge stage={l.stage} /></div>
                    <FollowUpChip date={l.follow_up} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Pipeline by stage</h2>
            <Link to="/app/pipeline" className="flex items-center gap-0.5 text-[13px] text-fern hover:underline">Board <ArrowUpRight size={14} /></Link>
          </div>
          <ul className="mt-4 space-y-4">
            {byStage.map((s) => (
              <li key={s.id}>
                <div className="mb-1.5 flex items-baseline justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${stageStyle[s.id].dot}`} />
                    {s.label} <span className="text-faint">{s.count}</span>
                  </span>
                  <span className="num font-medium">{formatMoney(s.value)}</span>
                </div>
                <div className="h-1.5 rounded-full bg-paper">
                  <div className={`h-1.5 rounded-full ${stageStyle[s.id].bar}`} style={{ width: `${Math.max(3, (s.value / maxStage) * 100)}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between px-5 pb-2 pt-4">
          <h2 className="font-semibold">Recently added</h2>
          <Link to="/app/leads" className="text-[13px] text-fern hover:underline">All leads</Link>
        </div>
        <ul className="divide-y divide-line">
          {newest.map((l) => (
            <li key={l.id}>
              <Link to={`/app/leads/${l.id}`} className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-paper/70">
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{l.name}</div>
                  <div className="truncate text-[13px] text-muted">{l.service} · {l.source}</div>
                </div>
                <span className="num text-sm font-medium">{formatMoney(l.value)}</span>
                <StageBadge stage={l.stage} />
              </Link>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
