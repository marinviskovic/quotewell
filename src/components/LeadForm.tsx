import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { createLead } from "@/lib/api";
import { notifyLeadsChanged } from "@/lib/useLeads";
import { Button, Field, inputClass } from "./ui";

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const SOURCES = ["Website form", "Google", "Referral", "Instagram", "Walk-in", "Phone"];
const empty = { name: "", company: "", email: "", phone: "", service: "", value: "", source: "Website form", follow_up: "", notes: "" };

export default function LeadForm({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const first = useRef<HTMLInputElement>(null);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [k]: e.target.value });

  useEffect(() => {
    first.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const parseValue = (v: string) => Number(v.replace(/[$,\s]/g, ""));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Add the person's name.";
    if (!EMAIL.test(form.email.trim())) e.email = "Enter a valid email, like name@example.com.";
    if (form.value && (!Number.isFinite(parseValue(form.value)) || parseValue(form.value) < 0)) e.value = "Use a number, like 1200.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    // A second click while the first save is in flight used to create a duplicate lead.
    if (saving || !validate()) return;
    setSaving(true);
    try {
      const lead = await createLead({
        name: form.name.trim(),
        company: form.company.trim() || null,
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        service: form.service.trim(),
        value: parseValue(form.value) || 0,
        stage: "new",
        source: form.source,
        follow_up: form.follow_up || null,
        notes: form.notes.trim() || null,
      });
      notifyLeadsChanged();
      onClose();
      navigate(`/app/leads/${lead.id}`);
    } catch (err) {
      setErrors({ form: (err as Error).message });
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 sm:items-center sm:p-6" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form
        onSubmit={submit}
        noValidate
        role="dialog"
        aria-modal="true"
        aria-labelledby="lead-form-title"
        className="flex max-h-[92dvh] w-full flex-col rounded-t-2xl bg-surface shadow-pop sm:max-w-lg sm:rounded-2xl"
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 id="lead-form-title" className="text-base font-semibold">New lead</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="-mr-1.5 flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-black/5">
            <X size={18} />
          </button>
        </div>
        <div className="grid flex-1 gap-4 overflow-y-auto px-5 py-5 sm:grid-cols-2">
          <Field label="Name" error={errors.name}>
            <input ref={first} className={inputClass} value={form.name} onChange={set("name")} aria-invalid={!!errors.name} autoComplete="off" />
          </Field>
          <Field label="Company" hint="Optional">
            <input className={inputClass} value={form.company} onChange={set("company")} />
          </Field>
          <Field label="Email" error={errors.email}>
            <input type="email" inputMode="email" className={inputClass} value={form.email} onChange={set("email")} aria-invalid={!!errors.email} />
          </Field>
          <Field label="Phone" hint="Optional">
            <input type="tel" className={inputClass} value={form.phone} onChange={set("phone")} />
          </Field>
          <Field label="Service">
            <input className={inputClass} placeholder="e.g. Backyard redesign" value={form.service} onChange={set("service")} />
          </Field>
          <Field label="Estimated value ($)" error={errors.value}>
            <input inputMode="decimal" className={`${inputClass} num`} placeholder="0" value={form.value} onChange={set("value")} aria-invalid={!!errors.value} />
          </Field>
          <Field label="Source">
            <select className={inputClass} value={form.source} onChange={set("source")}>
              {SOURCES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Follow up on">
            <input type="date" className={inputClass} value={form.follow_up} onChange={set("follow_up")} />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Notes" hint="Optional">
              <textarea rows={3} className={`${inputClass} h-auto py-2`} value={form.notes} onChange={set("notes")} />
            </Field>
          </div>
          {errors.form && <p role="alert" className="text-sm text-danger sm:col-span-2">{errors.form}</p>}
        </div>
        <div className="flex gap-2 border-t border-line px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:justify-end">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1 sm:flex-none">Cancel</Button>
          <Button disabled={saving} className="flex-1 sm:flex-none">{saving ? "Saving…" : "Save lead"}</Button>
        </div>
      </form>
    </div>
  );
}
