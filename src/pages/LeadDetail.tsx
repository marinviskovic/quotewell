import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Mail, Phone, Trash2 } from "lucide-react";
import { addActivity, deleteLead, getActivities, getLead, updateLead } from "@/lib/api";
import { notifyLeadsChanged } from "@/lib/useLeads";
import { usePageTitle } from "@/lib/usePageTitle";
import { STAGES } from "@/lib/stages";
import { formatDateTime, formatDay, formatMoney } from "@/lib/format";
import StageBadge, { stageStyle } from "@/components/StageBadge";
import FollowUpChip from "@/components/FollowUpChip";
import { Button, Card, inputClass } from "@/components/ui";
import { ErrorNote, PageSkeleton } from "@/components/states";
import type { Activity, Lead, Stage } from "@/types";

export default function LeadDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState<Lead | null | undefined>(undefined);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirming, setConfirming] = useState(false);
  usePageTitle(lead?.name ?? "Lead");

  // Re-load when the id in the URL changes, not only on first mount.
  useEffect(() => {
    setLead(undefined);
    Promise.all([getLead(id!), getActivities(id!)])
      .then(([l, a]) => {
        setLead(l);
        setActivities(a);
      })
      .catch((e: Error) => setError(e.message));
  }, [id]);

  if (error) return <ErrorNote message={error} />;
  if (lead === undefined) return <PageSkeleton />;
  if (lead === null)
    return (
      <Card className="px-6 py-14 text-center">
        <p className="font-medium">This lead doesn't exist or was deleted.</p>
        <Link to="/app/leads" className="mt-2 inline-block text-sm text-fern underline">Back to leads</Link>
      </Card>
    );

  const save = async (patch: Partial<Lead>) => {
    const previous = lead;
    setLead({ ...lead, ...patch });
    try {
      await updateLead(lead.id, patch);
      notifyLeadsChanged();
    } catch (e) {
      setLead(previous);
      setError((e as Error).message);
    }
  };

  const remove = async () => {
    setConfirming(false);
    await deleteLead(lead.id);
    notifyLeadsChanged();
    navigate("/app/leads");
  };

  const submitNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim() || saving) return;
    setSaving(true);
    try {
      const added = await addActivity(lead.id, note.trim());
      setActivities([...activities, added]);
      setNote("");
    } finally {
      setSaving(false);
    }
  };

  const details = [
    { label: "Service", value: lead.service || "—" },
    { label: "Estimated value", value: formatMoney(lead.value), num: true },
    { label: "Source", value: lead.source },
    { label: "Added", value: formatDay(lead.created_at.slice(0, 10)) },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <Link to="/app/leads" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink">
        <ArrowLeft size={16} /> Leads
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-[28px]">{lead.name}</h1>
            <StageBadge stage={lead.stage} />
          </div>
          <p className="mt-1 text-sm text-muted">{[lead.company, lead.service].filter(Boolean).join(" · ")}</p>
        </div>
        <div className="flex gap-2">
          <a href={`mailto:${lead.email}`} className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-line-strong bg-surface px-4 text-sm font-medium hover:bg-paper sm:flex-none">
            <Mail size={16} /> Email
          </a>
          {lead.phone && (
            <a href={`tel:${lead.phone.replace(/[^\d+]/g, "")}`} className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-line-strong bg-surface px-4 text-sm font-medium hover:bg-paper sm:flex-none">
              <Phone size={16} /> Call
            </a>
          )}
          <Button variant="danger" onClick={() => setConfirming(true)} aria-label={`Delete ${lead.name}`} className="w-10 px-0">
            <Trash2 size={16} />
          </Button>
        </div>
      </div>

      {confirming && (
        <div role="alertdialog" aria-label="Confirm delete" className="flex flex-col gap-3 rounded-xl border border-danger/25 bg-danger-soft p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-danger">Delete {lead.name} and their notes? This can't be undone.</p>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setConfirming(false)} className="flex-1 sm:flex-none">Keep</Button>
            <Button variant="destructive" onClick={remove} className="flex-1 sm:flex-none">Delete lead</Button>
          </div>
        </div>
      )}

      <div className="no-scrollbar -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <div className="inline-flex rounded-xl border border-line bg-surface p-1 shadow-card" role="radiogroup" aria-label="Stage">
          {STAGES.map((s) => (
            <button
              key={s.id}
              role="radio"
              aria-checked={lead.stage === s.id}
              onClick={() => save({ stage: s.id as Stage })}
              className={`flex h-8 items-center gap-1.5 rounded-lg px-3 text-[13px] font-medium transition-colors ${lead.stage === s.id ? "bg-ink text-white" : "text-muted hover:text-ink"}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${stageStyle[s.id].dot}`} />
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
        <div className="space-y-5 lg:col-span-2">
          <Card className="p-5">
            <h2 className="text-sm font-semibold">Contact</h2>
            <dl className="mt-3 space-y-2.5 text-sm">
              <div><dt className="text-xs text-muted">Email</dt><dd className="truncate">{lead.email}</dd></div>
              <div><dt className="text-xs text-muted">Phone</dt><dd>{lead.phone ?? "—"}</dd></div>
            </dl>
          </Card>
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">Next follow-up</h2>
              <FollowUpChip date={lead.follow_up} />
            </div>
            <input type="date" aria-label="Follow-up date" className={`${inputClass} mt-3`} value={lead.follow_up ?? ""} onChange={(e) => save({ follow_up: e.target.value || null })} />
          </Card>
          <Card className="p-5">
            <h2 className="text-sm font-semibold">Job</h2>
            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              {details.map((d) => (
                <div key={d.label}><dt className="text-xs text-muted">{d.label}</dt><dd className={d.num ? "num font-medium" : ""}>{d.value}</dd></div>
              ))}
            </dl>
            {lead.notes && <p className="mt-4 rounded-lg bg-paper p-3 text-sm leading-relaxed text-ink/85">{lead.notes}</p>}
          </Card>
        </div>

        <Card className="flex flex-col p-5 lg:col-span-3">
          <h2 className="text-sm font-semibold">Activity</h2>
          {activities.length === 0 ? (
            <p className="mt-3 text-sm text-muted">No notes yet. Log calls, site visits and quotes here.</p>
          ) : (
            <ol className="mt-4 space-y-4 border-l border-line pl-4">
              {activities.map((a) => (
                <li key={a.id} className="relative">
                  <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-surface bg-fern" />
                  <p className="text-sm">{a.body}</p>
                  <p className="mt-0.5 text-xs text-faint">{formatDateTime(a.created_at)}</p>
                </li>
              ))}
            </ol>
          )}
          <form onSubmit={submitNote} className="mt-auto flex gap-2 pt-5">
            <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a note, e.g. Sent quote" aria-label="New note" className={inputClass} />
            <Button disabled={!note.trim() || saving}>Add</Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
