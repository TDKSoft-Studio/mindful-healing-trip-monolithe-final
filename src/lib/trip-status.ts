/**
 * Trip status domain logic (contract §9/§13).
 *
 * This is defined ahead of the Prisma `Trip` model (Phase 3) because the
 * contract fully specifies the enum and its display rules already, and
 * StatusBadge (Phase 2 design system, contract §22) needs it. Phase 3's
 * Prisma schema must define `TripStatus` with these exact values so the two
 * stay in sync.
 */
export const TRIP_STATUSES = [
  "DRAFT",
  "UPCOMING",
  "OPEN",
  "LIMITED",
  "SOLD_OUT",
  "CLOSED",
  "COMPLETED",
  "CANCELLED",
] as const;

export type TripStatus = (typeof TRIP_STATUSES)[number];

const STATUS_LABELS: Record<TripStatus, string> = {
  DRAFT: "Brouillon",
  UPCOMING: "À venir",
  OPEN: "Réservations ouvertes",
  LIMITED: "Dernières places",
  SOLD_OUT: "Complet",
  CLOSED: "Réservations clôturées",
  COMPLETED: "Terminé",
  CANCELLED: "Annulé",
};

/** Visitor-facing label for a trip status (contract §13). */
export function getTripStatusLabel(status: TripStatus): string {
  return STATUS_LABELS[status];
}

/**
 * Whether a booking CTA should be shown for this status.
 *
 * Contract §9: "Ne jamais afficher « Réservez maintenant » pour un voyage
 * terminé ou clôturé." - only OPEN and LIMITED trips are actively bookable.
 */
export function isBookable(status: TripStatus): boolean {
  return status === "OPEN" || status === "LIMITED";
}

const NOT_BOOKABLE_MESSAGES: Partial<Record<TripStatus, string>> = {
  UPCOMING: "Les réservations ne sont pas encore ouvertes pour ce voyage.",
  SOLD_OUT: "Ce voyage est complet.",
  CLOSED: "Les réservations pour ce voyage sont clôturées.",
  COMPLETED: "Ce voyage est terminé.",
  CANCELLED: "Ce voyage a été annulé.",
};

/**
 * Explains *why* booking isn't available, matching the actual status -
 * "no longer open" would be wrong for a trip that was never open yet
 * (UPCOMING). Only meaningful when `!isBookable(status)`.
 */
export function getBookingUnavailableMessage(status: TripStatus): string {
  return (
    NOT_BOOKABLE_MESSAGES[status] ??
    "Ce voyage n'est pas ouvert à la réservation."
  );
}
