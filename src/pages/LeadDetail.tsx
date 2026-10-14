import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Trash2 } from "lucide-react";
import { addActivity, deleteLead, getActivities, getLead, updateLead } from "@/lib/api";
import StageBadge from "@/components/StageBadge";
import { STAGES } from "@/lib/stages";
import { formatDateTime, formatDay, formatMoney } from "@/lib/format";
import type { Activity, Lead, Stage } from "@/types";

export default function LeadDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState<Lead | null | undefined>(undefined);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [note, setNote] = useState("");

  // Re-load when the id in the URL changes, not only on first mount.
  useEffect(() => {
    setLead(undefined);
    getLead(id!).then(setLead);
    getActivities(id!).then(setActivities);
  }, [id]);

  if (lead === undefined) return <div>Loading...</div>;
  if (lead === null)
    return (
      <div>
        <p className="mb-2">This lead doesn't exist or was deleted.</p>
        <Link to="/leads" className="text-violet-700 underline">Back to leads</Link>
      </div>
    );

  const changeStage = async (stage: Stage) => {
    const previous = lead.stage;
    setLead({ ...lead, stage });
    try {
      await updateLead(lead.id, { stage });
    } catch {
      setLead({ ...lead, stage: previous });
    }
  };

  const remove = async () => {
    if (!window.confirm(`Delete ${lead.name}? This also deletes their notes.`)) return;
    await deleteLead(lead.id);
    navigate("/leads");
  };

  const submitNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) return;
    const added = await addActivity(lead.id, note.trim());
    setActivities([...activities, added]);
    setNote("");
  };

  return (
    <div className="max-w-3xl">
      <button onClick={() => navigate(-1)} className="mb-4 flex items-center gap-1 text-sm text-slate-500"><ArrowLeft size={16} /> Back</button>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{lead.name}</h1>
          <p className="text-slate-500">{lead.service} · {formatMoney(lead.value)}</p>
        </div>
        <button onClick={remove} className="flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm text-white">
          <Trash2 size={16} /> Delete
        </button>
      </div>
      <div className="mb-6 grid grid-cols-2 gap-4 rounded-xl border bg-white p-5 text-sm">
        <div><div className="text-slate-500">Email</div>{lead.email}</div>
        <div><div className="text-slate-500">Phone</div>{lead.phone ?? "—"}</div>
        <div><div className="text-slate-500">Stage</div>
          <select value={lead.stage} onChange={(e) => changeStage(e.target.value as Stage)} className="mt-1 rounded border px-2 py-1">
            {STAGES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
          <span className="ml-2"><StageBadge stage={lead.stage} /></span>
        </div>
        <div><div className="text-slate-500">Follow-up</div>{formatDay(lead.follow_up)}</div>
        <div className="col-span-2"><div className="text-slate-500">Notes</div>{lead.notes}</div>
      </div>
      <div className="rounded-xl border bg-white p-5">
        <h2 className="mb-3 font-semibold">Activity</h2>
        {activities.map((a) => (
          <div key={a.id} className="border-t py-2 text-sm">{a.body} <span className="text-slate-400">· {formatDateTime(a.created_at)}</span></div>
        ))}
        <form onSubmit={submitNote} className="mt-3 flex gap-2">
          <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a note..." className="flex-1 rounded-md border px-3 py-2 text-sm" />
          <button disabled={!note.trim()} className="rounded-md bg-violet-600 px-4 py-2 text-sm text-white disabled:opacity-50">Add</button>
        </form>
      </div>
    </div>
  );
}
