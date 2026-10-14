import { stageLabel } from "@/lib/stages";
import type { Stage } from "@/types";

export const stageStyle: Record<Stage, { badge: string; dot: string; bar: string }> = {
  new: { badge: "bg-stage-new-soft text-stage-new", dot: "bg-stage-new", bar: "bg-stage-new" },
  contacted: { badge: "bg-stage-contacted-soft text-stage-contacted", dot: "bg-stage-contacted", bar: "bg-stage-contacted" },
  quoted: { badge: "bg-stage-quoted-soft text-stage-quoted", dot: "bg-stage-quoted", bar: "bg-stage-quoted" },
  won: { badge: "bg-stage-won-soft text-stage-won", dot: "bg-stage-won", bar: "bg-stage-won" },
  lost: { badge: "bg-stage-lost-soft text-stage-lost", dot: "bg-stage-lost", bar: "bg-stage-lost" },
};

export default function StageBadge({ stage }: { stage: Stage }) {
  const s = stageStyle[stage] ?? stageStyle.new;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${s.badge}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {stageLabel(stage)}
    </span>
  );
}
