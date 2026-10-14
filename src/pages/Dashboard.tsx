import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DollarSign, Users, Trophy, CalendarClock } from "lucide-react";
import { getLeads } from "@/lib/api";
import StageBadge from "@/components/StageBadge";
import { formatDay, formatMoney, todayKey } from "@/lib/format";
import type { Lead } from "@/types";

export default function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    getLeads().then(setLeads);
  }, []);

  const pipeline = leads.filter((l) => l.stage !== "lost" && l.stage !== "won").reduce((sum, l) => sum + Number(l.value), 0);
  const won = leads.filter((l) => l.stage === "won").length;
  const today = todayKey();
  const dueToday = leads.filter((l) => l.follow_up === today).length;

  const stats = [
    { label: "Total leads", value: leads.length, icon: Users },
    { label: "Open pipeline", value: formatMoney(pipeline), icon: DollarSign },
    { label: "Won deals", value: won, icon: Trophy },
    { label: "Follow-ups today", value: dueToday, icon: CalendarClock },
  ];

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>
      <div className="mb-8 grid grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border bg-white p-5">
            <div className="mb-2 flex items-center justify-between text-sm text-slate-500">
              {s.label}
              <s.icon size={16} />
            </div>
            <div className="text-2xl font-bold">{s.value}</div>
          </div>
        ))}
      </div>
      <div className="rounded-xl border bg-white">
        <div className="border-b px-5 py-4 font-semibold">Recent leads</div>
        <table className="w-full text-sm">
          <thead className="text-left text-slate-500">
            <tr>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Service</th>
              <th className="px-5 py-3">Value</th>
              <th className="px-5 py-3">Stage</th>
              <th className="px-5 py-3">Follow-up</th>
            </tr>
          </thead>
          <tbody>
            {leads.slice(0, 6).map((l) => (
              <tr key={l.id} className="border-t">
                <td className="px-5 py-3 font-medium"><Link to={`/leads/${l.id}`}>{l.name}</Link></td>
                <td className="px-5 py-3">{l.service}</td>
                <td className="px-5 py-3">{formatMoney(l.value)}</td>
                <td className="px-5 py-3"><StageBadge stage={l.stage} /></td>
                <td className="px-5 py-3">{formatDay(l.follow_up)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
