// Local stand-in for the Supabase tables so the app runs without a backend.
import { seedActivities, seedLeads } from "./seed";
import type { Activity, Lead } from "@/types";

const KEY = "quotewell-demo-v1";
type Db = { leads: Lead[]; activities: Activity[] };

function load(): Db {
  const raw = localStorage.getItem(KEY);
  if (raw) return JSON.parse(raw);
  const db = { leads: seedLeads, activities: seedActivities } as Db;
  localStorage.setItem(KEY, JSON.stringify(db));
  return db;
}
const save = (db: Db) => localStorage.setItem(KEY, JSON.stringify(db));
const wait = () => new Promise((r) => setTimeout(r, 400));

export const demoStore = {
  async listLeads() {
    await wait();
    return load().leads;
  },
  async getLead(id: string) {
    await wait();
    return load().leads.find((l) => l.id == id);
  },
  async insertLead(lead: Partial<Lead>) {
    await wait();
    const db = load();
    const row = { ...lead, id: crypto.randomUUID(), created_at: new Date().toISOString() } as Lead;
    db.leads.unshift(row);
    save(db);
    return row;
  },
  async updateLead(id: string, patch: Partial<Lead>) {
    await wait();
    const db = load();
    db.leads = db.leads.map((l) => (l.id == id ? { ...l, ...patch } : l));
    save(db);
  },
  async deleteLead(id: string) {
    await wait();
    const db = load();
    db.leads = db.leads.filter((l) => l.id != id);
    save(db);
  },
  async listActivities(leadId: string) {
    await wait();
    return load().activities.filter((a) => a.lead_id == leadId);
  },
  async insertActivity(a: Partial<Activity>) {
    await wait();
    const db = load();
    db.activities.push({ ...a, id: crypto.randomUUID(), created_at: new Date().toISOString() } as Activity);
    save(db);
  },
};
