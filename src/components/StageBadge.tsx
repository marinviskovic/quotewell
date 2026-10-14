const colors: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-amber-100 text-amber-700",
  quoted: "bg-violet-100 text-violet-700",
  won: "bg-green-100 text-green-700",
  lost: "bg-slate-100 text-slate-600",
};

export default function StageBadge({ stage }: { stage: string }) {
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${colors[stage]}`}>{stage}</span>;
}
