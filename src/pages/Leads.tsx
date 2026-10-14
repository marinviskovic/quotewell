import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ChevronRight, Plus, Search } from "lucide-react";
import { useLeads } from "@/lib/useLeads";
import { usePageTitle } from "@/lib/usePageTitle";
import { STAGES } from "@/lib/stages";
import { formatMoney } from "@/lib/format";
import { useOpenLeadForm } from "@/components/Layout";
import StageBadge from "@/components/StageBadge";
import FollowUpChip from "@/components/FollowUpChip";
import { Button, Card, inputClass } from "@/components/ui";
import { ErrorNote, PageSkeleton } from "@/components/states";
import type { Stage } from "@/types";

export default function Leads() {
  const { leads, error } = useLeads();
  const openForm = useOpenLeadForm();
  usePageTitle("Leads");
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const stage = (params.get("stage") ?? "all") as Stage | "all";

  if (error) return <ErrorNote message={error} />;
  if (!leads) return <PageSkeleton />;

  const q = query.trim().toLowerCase();
  const matchesQuery = leads.filter((l) => `${l.name} ${l.company ?? ""} ${l.email} ${l.service}`.toLowerCase().includes(q));
  const filtered = matchesQuery.filter((l) => stage === "all" || l.stage === stage);
  const chips = [{ id: "all" as const, label: "All", count: matchesQuery.length }, ...STAGES.map((s) => ({ ...s, count: matchesQuery.filter((l) => l.stage === s.id).length }))];

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-[28px]">Leads</h1>
          <p className="mt-0.5 text-sm text-muted">{leads.length} people and companies</p>
        </div>
        <div className="hidden sm:block"><Button onClick={openForm}><Plus size={16} /> New lead</Button></div>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative md:w-80">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, company, service" aria-label="Search leads" className={`${inputClass} pl-9`} />
        </div>
        <div className="no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4 md:mx-0 md:px-0" role="tablist" aria-label="Filter by stage">
          {chips.map((c) => (
            <button
              key={c.id}
              role="tab"
              aria-selected={stage === c.id}
              onClick={() => setParams(c.id === "all" ? {} : { stage: c.id }, { replace: true })}
              className={`flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3 text-[13px] font-medium transition-colors ${stage === c.id ? "border-ink bg-ink text-white" : "border-line-strong bg-surface text-muted hover:text-ink"}`}
            >
              {c.label}
              <span className={`num ${stage === c.id ? "text-white/60" : "text-faint"}`}>{c.count}</span>
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card className="px-6 py-14 text-center">
          <p className="font-medium">No leads match.</p>
          <p className="mt-1 text-sm text-muted">Try another search or stage.</p>
        </Card>
      ) : (
        <>
          {/* Phones: cards */}
          <ul className="space-y-2 md:hidden">
            {filtered.map((l) => (
              <li key={l.id}>
                <Link to={`/app/leads/${l.id}`} className="block rounded-xl border border-line bg-surface p-4 shadow-card active:bg-paper">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate font-medium">{l.name}</div>
                      <div className="truncate text-[13px] text-muted">{l.company ?? l.service}</div>
                    </div>
                    <StageBadge stage={l.stage} />
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <FollowUpChip date={l.follow_up} />
                    <span className="num text-sm font-semibold">{formatMoney(l.value)}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          {/* Tablet and up: table */}
          <Card className="hidden overflow-hidden md:block">
            <table className="w-full text-sm">
              <thead className="border-b border-line bg-paper/60 text-left text-xs font-medium uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-5 py-2.5 font-medium">Name</th>
                  <th className="px-3 py-2.5 font-medium">Service</th>
                  <th className="px-3 py-2.5 font-medium">Stage</th>
                  <th className="px-3 py-2.5 font-medium">Follow-up</th>
                  <th className="hidden px-3 py-2.5 font-medium lg:table-cell">Source</th>
                  <th className="px-5 py-2.5 text-right font-medium">Value</th>
                  <th className="w-8" />
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filtered.map((l) => (
                  <tr key={l.id} onClick={() => navigate(`/app/leads/${l.id}`)} className="cursor-pointer transition-colors hover:bg-paper/70">
                    <td className="px-5 py-3">
                      <Link to={`/app/leads/${l.id}`} className="font-medium hover:underline" onClick={(e) => e.stopPropagation()}>{l.name}</Link>
                      <div className="text-[13px] text-muted">{l.company ?? l.email}</div>
                    </td>
                    <td className="px-3 py-3 text-muted">{l.service}</td>
                    <td className="px-3 py-3"><StageBadge stage={l.stage} /></td>
                    <td className="px-3 py-3"><FollowUpChip date={l.follow_up} /></td>
                    <td className="hidden px-3 py-3 text-muted lg:table-cell">{l.source}</td>
                    <td className="num px-5 py-3 text-right font-medium">{formatMoney(l.value)}</td>
                    <td className="pr-4 text-faint"><ChevronRight size={16} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </>
      )}
    </div>
  );
}
