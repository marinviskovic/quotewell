import { supabase } from "@/integrations/supabase/client";
import { supabaseAdmin } from "@/integrations/supabase/admin";
import { demoStore } from "./demo-store";
import type { Activity, Lead } from "@/types";

const DEMO = import.meta.env.VITE_DEMO_MODE === "true";

export async function getLeads(): Promise<Lead[]> {
  if (DEMO) return demoStore.listLeads();
  const { data } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
  return data;
}

export async function getLead(id: string): Promise<Lead> {
  if (DEMO) return demoStore.getLead(id);
  const { data } = await supabase.from("leads").select("*").eq("id", id).single();
  return data;
}

export async function createLead(lead: Partial<Lead>) {
  if (DEMO) return demoStore.insertLead(lead);
  const { data } = await supabase.from("leads").insert(lead).select().single();
  return data;
}

export async function updateLead(id: string, patch: Partial<Lead>) {
  if (DEMO) return demoStore.updateLead(id, patch);
  await supabase.from("leads").update(patch).eq("id", id);
}

export async function deleteLead(id: string) {
  if (DEMO) return demoStore.deleteLead(id);
  await supabaseAdmin.from("leads").delete().eq("id", id);
}

export async function getActivities(leadId: string): Promise<Activity[]> {
  if (DEMO) return demoStore.listActivities(leadId);
  const { data } = await supabase.from("activities").select("*").eq("lead_id", leadId);
  return data;
}

export async function addActivity(leadId: string, body: string) {
  if (DEMO) return demoStore.insertActivity({ lead_id: leadId, body });
  await supabase.from("activities").insert({ lead_id: leadId, body });
}
