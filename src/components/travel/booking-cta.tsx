import { Button } from "@/components/ui/button";
import {
  getBookingUnavailableMessage,
  isBookable,
  type TripStatus,
} from "@/lib/trip-status";

type BookingCTAProps = {
  slug: string;
  status: TripStatus;
  bookingUrl: string | null;
  bookingMode: string | null;
};

/**
 * Booking call-to-action (contract §14/§22). Never offers a booking action
 * for a trip that isn't actually bookable (contract §9: "Ne jamais
 * afficher « Réservez maintenant » pour un voyage terminé ou clôturé") -
 * isBookable() is the single source of truth for that rule.
 */
export function BookingCTA({
  slug,
  status,
  bookingUrl,
  bookingMode,
}: BookingCTAProps) {
  if (!isBookable(status)) {
    return (
      <div className="flex flex-col items-start gap-3">
        <p className="text-muted-foreground text-sm">
          {getBookingUnavailableMessage(status)}
        </p>
        <Button href="/contact" variant="outline">
          Nous contacter
        </Button>
      </div>
    );
  }

  const isExternal = bookingUrl?.startsWith("http") ?? false;

  return (
    <div className="flex flex-col items-start gap-3">
      {bookingMode ? (
        <p className="text-muted-foreground text-sm">{bookingMode}</p>
      ) : null}
      <Button
        href={bookingUrl ?? `/contact?voyage=${slug}`}
        size="lg"
        {...(isExternal
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        Réserver ce voyage
      </Button>
    </div>
  );
}
