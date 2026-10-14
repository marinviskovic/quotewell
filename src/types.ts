export type Lead = {
  id: string;
  created_at: string;
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  service: string;
  value: string;
  stage: string;
  source: string;
  follow_up: string | null;
  notes: string | null;
};

export type Activity = {
  id: string;
  lead_id: string;
  body: string;
  created_at: string;
};
