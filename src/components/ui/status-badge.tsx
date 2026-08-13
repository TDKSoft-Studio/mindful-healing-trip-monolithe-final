import { Badge } from "@/components/ui/badge";
import { getTripStatusLabel, type TripStatus } from "@/lib/trip-status";

const STATUS_TONE: Record<
  TripStatus,
  "neutral" | "primary" | "accent" | "strong"
> = {
  DRAFT: "neutral",
  UPCOMING: "neutral",
  OPEN: "primary",
  LIMITED: "accent",
  SOLD_OUT: "strong",
  CLOSED: "strong",
  COMPLETED: "neutral",
  CANCELLED: "neutral",
};

/**
 * Trip status badge (contract §13/§22). The label text is always the
 * primary signal - tone/color is a reinforcement, never the only way to
 * tell statuses apart (contract §13: "compréhensibles sans dépendre
 * uniquement de la couleur").
 */
export function StatusBadge({ status }: { status: TripStatus }) {
  return <Badge tone={STATUS_TONE[status]}>{getTripStatusLabel(status)}</Badge>;
}
