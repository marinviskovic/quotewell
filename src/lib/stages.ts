import type { Stage } from "@/types";

export const STAGES: { id: Stage; label: string }[] = [
  { id: "new", label: "New" },
  { id: "contacted", label: "Contacted" },
  { id: "quoted", label: "Quoted" },
  { id: "won", label: "Won" },
  { id: "lost", label: "Lost" },
];

export const stageLabel = (id: Stage) => STAGES.find((s) => s.id === id)?.label ?? id;
