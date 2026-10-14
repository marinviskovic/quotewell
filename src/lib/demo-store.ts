// Local stand-in for the Supabase tables so the app runs without a backend.
// Rows are scoped to the signed-in demo user, the same way the RLS policies scope them in Supabase.
import { seedActivities, seedLeads } from "./seed";
import type { Activity, Lead } from "@/types";

const KEY = "quotewell-demo-v2";
type Db = { leads: Lead[]; activities: Activity[] };
let memory: Db | null = null;

function owner(): string {
  try {
    return JSON.parse(localStorage.getItem("quotewell-demo-session") ?? "null")?.id ?? "";
  } catch {
    return "demo-user";
  }
}

function load(): Db {
  if (memory) return memory;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return (memory = JSON.parse(raw));
  } catch {
    /* storage blocked: fall through to fresh sample data */
  }
  memory = {
    leads: seedLeads.map((l) => ({ ...l, owner_id: "demo-user" })) as Lead[],
    activities: seedActivities.map((a) => ({ ...a, owner_id: "demo-user" })) as Activity[],
  };
  save(memory);
  return memory;
}

function save(db: Db) {
  memory = db;
  try {
    localStorage.setItem(KEY, JSON.stringify(db));
  } catch {
    /* keep it in memory only */
  }
}

const wait = () => new Promise((r) => setTimeout(r, 250));
const mine = <T extends { owner_id?: string }>(rows: T[]) => rows.filter((r) => r.owner_id === owner());

export const demoStore = {
  async listLeads() {
    await wait();
    return mine(load().leads);
  },
  async getLead(id: string) {
    await wait();
    return mine(load().leads).find((l) => l.id === id) ?? null;
  },
  async insertLead(lead: Partial<Lead>) {
    await wait();
    const db = load();
    const row = { ...lead, id: crypto.randomUUID(), created_at: new Date().toISOString(), owner_id: owner() } as Lead;
    save({ ...db, leads: [row, ...db.leads] });
    return row;
  },
  async updateLead(id: string, patch: Partial<Lead>) {
    await wait();
    const db = load();
    save({ ...db, leads: db.leads.map((l) => (l.id === id && l.owner_id === owner() ? { ...l, ...patch } : l)) });
  },
  async deleteLead(id: string) {
    await wait();
    const db = load();
    save({
      leads: db.leads.filter((l) => !(l.id === id && l.owner_id === owner())),
      activities: db.activities.filter((a) => !(a.lead_id === id && a.owner_id === owner())),
    });
  },
  async listActivities(leadId: string) {
    await wait();
    return mine(load().activities).filter((a) => a.lead_id === leadId);
  },
  async insertActivity(a: Partial<Activity>) {
    await wait();
    const db = load();
    const row = { ...a, id: crypto.randomUUID(), created_at: new Date().toISOString(), owner_id: owner() } as Activity;
    save({ ...db, activities: [...db.activities, row] });
    return row;
  },
};
