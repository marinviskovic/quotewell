import { useEffect } from "react";

export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = title ? `${title} · QuoteWell` : "QuoteWell · Simple CRM for small service businesses";
  }, [title]);
}
