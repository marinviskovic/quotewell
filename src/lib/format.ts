const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export const formatMoney = (n: number) => money.format(Number(n) || 0);

const pad = (n: number) => String(n).padStart(2, "0");

/** Today's date in the user's own time zone, as YYYY-MM-DD. */
export const todayKey = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/**
 * `new Date("2026-10-14")` is midnight UTC, which is still Oct 13 in the US.
 * Date-only values are parsed as local calendar dates instead.
 */
export function parseDay(key: string) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export const formatDay = (key: string | null) =>
  key ? parseDay(key).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

export const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
