import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import { getLeads } from "@/lib/api";
import StageBadge from "@/components/StageBadge";
import LeadForm from "@/components/LeadForm";
import type { Lead } from "@/types";

const stages = ["All", "New", "Contacted", "Quoted", "Won", "Lost"];

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState("All");
  const [open, setOpen] = useState(false);

  const load = () => getLeads().then(setLeads);
  useEffect(() => {
    load();
  }, []);

  const filtered = leads.filter(
    (l) => l.name.toLowerCase().includes(query.toLowerCase()) && (stage === "All" || l.stage === stage),
  );

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Leads</h1>
        <button onClick={() => setOpen(true)} className="flex items-center gap-2 rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white">
          <Plus size={16} /> Add lead
        </button>
      </div>
      <div className="mb-4 flex gap-3">
        <div className="relative w-80">
          <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search leads..." className="w-full rounded-md border bg-white py-2 pl-9 pr-3 text-sm" />
        </div>
        <select value={stage} onChange={(e) => setStage(e.target.value)} className="rounded-md border bg-white px-3 py-2 text-sm">
          {stages.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>
      <div className="rounded-xl border bg-white">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="text-left text-slate-500">
            <tr>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Phone</th>
              <th className="px-5 py-3">Service</th>
              <th className="px-5 py-3">Value</th>
              <th className="px-5 py-3">Stage</th>
              <th className="px-5 py-3">Source</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((l) => (
              <tr key={l.id} className="border-t hover:bg-slate-50">
                <td className="px-5 py-3 font-medium"><Link to={`/leads/${l.id}`}>{l.name}</Link></td>
                <td className="px-5 py-3">{l.email}</td>
                <td className="px-5 py-3">{l.phone}</td>
                <td className="px-5 py-3">{l.service}</td>
                <td className="px-5 py-3">${l.value}</td>
                <td className="px-5 py-3"><StageBadge stage={l.stage} /></td>
                <td className="px-5 py-3">{l.source}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="p-10 text-center text-slate-400">No leads found</div>}
      </div>
      {open && <LeadForm onClose={() => setOpen(false)} onSaved={load} />}
    </div>
  );
}
