import { useState } from "react";
import { createLead } from "@/lib/api";

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export default function LeadForm({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", value: "", source: "Website form", follow_up: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!EMAIL.test(form.email.trim())) e.email = "Enter a valid email.";
    const value = Number(form.value.replace(/[$,\s]/g, ""));
    if (form.value && (!Number.isFinite(value) || value < 0)) e.value = "Value must be a number, like 1200.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    // A second click while the first save is in flight used to create a duplicate lead.
    if (saving || !validate()) return;
    setSaving(true);
    try {
      await createLead({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        company: null,
        service: form.service.trim(),
        value: Number(form.value.replace(/[$,\s]/g, "")) || 0,
        stage: "new",
        source: form.source,
        follow_up: form.follow_up || null,
        notes: null,
      });
      onSaved();
      onClose();
    } catch (err) {
      setErrors({ form: (err as Error).message });
      setSaving(false);
    }
  };

  const field = (k: keyof typeof form, placeholder: string, type = "text") => (
    <div>
      <input type={type} className="w-full rounded-md border px-3 py-2 text-sm" placeholder={placeholder} value={form[k]} onChange={set(k)} aria-invalid={!!errors[k]} />
      {errors[k] && <p className="mt-1 text-xs text-red-600">{errors[k]}</p>}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <form onSubmit={submit} noValidate className="w-[480px] space-y-3 rounded-xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold">Add lead</h2>
        {field("name", "Name")}
        {field("email", "Email", "email")}
        {field("phone", "Phone", "tel")}
        {field("service", "Service")}
        {field("value", "Value ($)")}
        {field("follow_up", "Follow-up", "date")}
        {errors.form && <p className="text-sm text-red-600">{errors.form}</p>}
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="rounded-md border px-4 py-2 text-sm">Cancel</button>
          <button disabled={saving} className="rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">{saving ? "Saving…" : "Save lead"}</button>
        </div>
      </form>
    </div>
  );
}
