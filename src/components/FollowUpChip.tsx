import { CalendarClock } from "lucide-react";
import { followUpLabel } from "@/lib/format";

const tones = {
  overdue: "bg-danger-soft text-danger",
  today: "bg-marigold-soft text-[#7a5200]",
  soon: "bg-paper text-ink",
  later: "bg-paper text-muted",
  none: "text-faint",
};

export default function FollowUpChip({ date }: { date: string | null }) {
  const { text, tone } = followUpLabel(date);
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-1.5 py-0.5 text-xs font-medium ${tones[tone]}`}>
      <CalendarClock size={13} strokeWidth={2} />
      {text}
    </span>
  );
}
