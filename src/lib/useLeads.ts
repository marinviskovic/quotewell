import { useCallback, useEffect, useState } from "react";
import { getLeads } from "./api";
import type { Lead } from "@/types";

const EVENT = "quotewell:leads-changed";
export const notifyLeadsChanged = () => window.dispatchEvent(new Event(EVENT));

export function useLeads() {
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(() => {
    getLeads()
      .then((rows) => {
        setLeads(rows);
        setError(null);
      })
      .catch((e: Error) => setError(e.message));
  }, []);

  useEffect(() => {
    reload();
    window.addEventListener(EVENT, reload);
    return () => window.removeEventListener(EVENT, reload);
  }, [reload]);

  return { leads, error, reload };
}
