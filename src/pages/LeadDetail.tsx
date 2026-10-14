import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Trash2 } from "lucide-react";
import { addActivity, deleteLead, getActivities, getLead, updateLead } from "@/lib/api";
import StageBadge from "@/components/StageBadge";
import type { Activity, Lead } from "@/types";

export default function LeadDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState<Lead>();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [note, setNote] = useState("");

  useEffect(() => {
    getLead(id).then(setLead);
    getActivities(id).then(setActivities);
  }, []);

  if (!lead) return <div>Loading...</div>;

  return (
    <div className="max-w-3xl">
      <button onClick={() => navigate(-1)} className="mb-4 flex items-center gap-1 text-sm text-slate-500"><ArrowLeft size={16} /> Back</button>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{lead.name}</h1>
          <p className="text-slate-500">{lead.service} · ${lead.value}</p>
        </div>
        <button
          onClick={async () => {
            await deleteLead(lead.id);
            navigate("/leads");
          }}
          className="flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm text-white"
        >
          <Trash2 size={16} /> Delete
        </button>
      </div>
      <div className="mb-6 grid grid-cols-2 gap-4 rounded-xl border bg-white p-5 text-sm">
        <div><div className="text-slate-500">Email</div>{lead.email}</div>
        <div><div className="text-slate-500">Phone</div>{lead.phone}</div>
        <div><div className="text-slate-500">Stage</div>
          <select value={lead.stage} onChange={(e) => { updateLead(lead.id, { stage: e.target.value }); setLead({ ...lead, stage: e.target.value }); }} className="mt-1 rounded border px-2 py-1">
            {["New", "Contacted", "Quoted", "Won", "Lost"].map((s) => <option key={s}>{s}</option>)}
          </select>
          <span className="ml-2"><StageBadge stage={lead.stage} /></span>
        </div>
        <div><div className="text-slate-500">Follow-up</div>{lead.follow_up ? new Date(lead.follow_up).toLocaleDateString() : "-"}</div>
        <div className="col-span-2"><div className="text-slate-500">Notes</div>{lead.notes}</div>
      </div>
      <div className="rounded-xl border bg-white p-5">
        <h2 className="mb-3 font-semibold">Activity</h2>
        {activities.map((a) => (
          <div key={a.id} className="border-t py-2 text-sm">{a.body} <span className="text-slate-400">· {new Date(a.created_at).toLocaleString()}</span></div>
        ))}
        <div className="mt-3 flex gap-2">
          <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a note..." className="flex-1 rounded-md border px-3 py-2 text-sm" />
          <button onClick={() => { addActivity(lead.id, note); setNote(""); }} className="rounded-md bg-violet-600 px-4 py-2 text-sm text-white">Add</button>
        </div>
      </div>
    </div>
  );
}
