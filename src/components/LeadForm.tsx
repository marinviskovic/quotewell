import { useState } from "react";
import { createLead } from "@/lib/api";

export default function LeadForm({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", value: "", source: "Website form", follow_up: "" });
  const set = (k: string) => (e: any) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e: any) => {
    e.preventDefault();
    await createLead({ ...form, stage: "New" });
    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <form onSubmit={submit} className="w-[480px] space-y-3 rounded-xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold">Add lead</h2>
        <input className="w-full rounded-md border px-3 py-2 text-sm" placeholder="Name" value={form.name} onChange={set("name")} />
        <input className="w-full rounded-md border px-3 py-2 text-sm" placeholder="Email" value={form.email} onChange={set("email")} />
        <input className="w-full rounded-md border px-3 py-2 text-sm" placeholder="Phone" value={form.phone} onChange={set("phone")} />
        <input className="w-full rounded-md border px-3 py-2 text-sm" placeholder="Service" value={form.service} onChange={set("service")} />
        <input className="w-full rounded-md border px-3 py-2 text-sm" placeholder="Value ($)" value={form.value} onChange={set("value")} />
        <input type="date" className="w-full rounded-md border px-3 py-2 text-sm" value={form.follow_up} onChange={set("follow_up")} />
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="rounded-md border px-4 py-2 text-sm">Cancel</button>
          <button className="rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white">Save lead</button>
        </div>
      </form>
    </div>
  );
}
