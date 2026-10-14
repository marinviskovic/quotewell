export type Stage = "new" | "contacted" | "quoted" | "won" | "lost";

export type Lead = {
  id: string;
  created_at: string;
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  service: string;
  value: number;
  stage: Stage;
  source: string;
  /** Calendar date, YYYY-MM-DD. Not a timestamp. */
  follow_up: string | null;
  notes: string | null;
  owner_id?: string;
};

export type Activity = {
  id: string;
  lead_id: string;
  body: string;
  created_at: string;
  owner_id?: string;
};
