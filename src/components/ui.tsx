import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
const variants: Record<Variant, string> = {
  primary: "bg-fern text-white hover:bg-fern-hover shadow-card",
  secondary: "bg-surface text-ink border border-line-strong hover:bg-paper",
  ghost: "text-muted hover:bg-black/5 hover:text-ink",
  danger: "bg-surface text-danger border border-line-strong hover:bg-danger-soft",
};

export function Button({ variant = "primary", className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={`inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-55 [&_svg]:shrink-0 ${variants[variant]} ${className}`}
      {...props}
    />
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-xl border border-line bg-surface shadow-card ${className}`}>{children}</div>;
}

export function Field({ label, error, children, hint }: { label: string; error?: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-medium text-ink">{label}</span>
      {children}
      {error ? <span className="mt-1 block text-xs text-danger">{error}</span> : hint ? <span className="mt-1 block text-xs text-faint">{hint}</span> : null}
    </label>
  );
}

export const inputClass =
  "h-10 w-full rounded-lg border border-line-strong bg-surface px-3 text-[15px] text-ink placeholder:text-faint transition-colors focus:border-fern focus:outline-none focus:ring-2 focus:ring-fern/15 aria-[invalid=true]:border-danger sm:text-sm";

export function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="#1e4d3a" />
      <path d="M16 7.5c-4.7 0-8.5 3.6-8.5 8.2 0 4.5 3.8 8.1 8.5 8.1 1.3 0 2.5-.3 3.6-.8l2.9 2.3.1-3.6a8 8 0 0 0 1.9-6c0-4.6-3.8-8.2-8.5-8.2Z" fill="#f6f5f1" />
      <path d="M12.2 16.2l2.6 2.5 5-5.3" fill="none" stroke="#1e4d3a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Wordmark() {
  return (
    <span className="flex items-center gap-2">
      <Logo />
      <span className="text-[17px] font-semibold tracking-tight">QuoteWell</span>
    </span>
  );
}
