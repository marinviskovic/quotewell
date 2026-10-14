import { AlertTriangle } from "lucide-react";

export function PageSkeleton() {
  return (
    <div className="animate-pulse space-y-4" aria-busy="true" aria-label="Loading">
      <div className="h-8 w-56 rounded-lg bg-line/70" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => <div key={i} className="h-24 rounded-xl bg-line/50" />)}
      </div>
      <div className="h-64 rounded-xl bg-line/40" />
    </div>
  );
}

export function ErrorNote({ message }: { message: string }) {
  return (
    <div role="alert" className="flex items-start gap-3 rounded-xl border border-danger/20 bg-danger-soft p-4 text-sm text-danger">
      <AlertTriangle size={18} className="mt-0.5 shrink-0" />
      <div>
        <div className="font-medium">Couldn't load your data.</div>
        <div className="mt-0.5 opacity-80">{message}</div>
      </div>
    </div>
  );
}
