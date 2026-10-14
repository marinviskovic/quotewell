import { DEMO, supabase } from "@/integrations/supabase/client";
import { demoStore } from "./demo-store";
import type { Activity, Lead } from "@/types";

// Supabase returns errors instead of throwing. The old code ignored them,
// so a failed request looked like an empty list.
function unwrap<T>({ data, error }: { data: T; error: { message: string } | null }): T {
  if (error) throw new Error(error.message);
  return data;
}

export async function getLeads(): Promise<Lead[]> {
  if (DEMO) return demoStore.listLeads();
  return unwrap(await supabase.from("leads").select("*").order("created_at", { ascending: false }));
}

export async function getLead(id: string): Promise<Lead | null> {
  if (DEMO) return demoStore.getLead(id);
  return unwrap(await supabase.from("leads").select("*").eq("id", id).maybeSingle());
}

export type NewLead = Omit<Lead, "id" | "created_at" | "owner_id">;

export async function createLead(lead: NewLead): Promise<Lead> {
  if (DEMO) return demoStore.insertLead(lead);
  return unwrap(await supabase.from("leads").insert(lead).select().single());
}

export async function updateLead(id: string, patch: Partial<NewLead>) {
  if (DEMO) return demoStore.updateLead(id, patch);
  unwrap(await supabase.from("leads").update(patch).eq("id", id));
}

export async function deleteLead(id: string) {
  if (DEMO) return demoStore.deleteLead(id);
  unwrap(await supabase.from("leads").delete().eq("id", id));
}

export async function getActivities(leadId: string): Promise<Activity[]> {
  if (DEMO) return demoStore.listActivities(leadId);
  return unwrap(await supabase.from("activities").select("*").eq("lead_id", leadId).order("created_at"));
}

export async function addActivity(leadId: string, body: string): Promise<Activity> {
  if (DEMO) return demoStore.insertActivity({ lead_id: leadId, body });
  return unwrap(await supabase.from("activities").insert({ lead_id: leadId, body }).select().single());
}
