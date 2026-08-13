import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import type { listPublishedTrips } from "@/features/trips/queries";
import { formatDateRange } from "@/lib/utils/format-date-range";

type Trip = Awaited<ReturnType<typeof listPublishedTrips>>[number];

/**
 * Trip summary card (contract §13/§22): destination, image, dates,
 * duration, short description, status, CTA - used on the homepage and
 * /voyages.
 */
export function TripCard({ trip }: { trip: Trip }) {
  return (
    <Card className="flex flex-col gap-4 overflow-hidden p-0">
      <div className="bg-brand-sand text-brand-brown flex aspect-[4/3] items-center justify-center">
        {trip.coverImage ? (
          <Image
            src={trip.coverImage}
            alt=""
            width={400}
            height={300}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="font-heading text-lg">{trip.destination.name}</span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6 pt-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-primary text-sm font-semibold">
            {trip.destination.name}
          </span>
          <StatusBadge status={trip.status} />
        </div>
        <h3 className="font-heading text-foreground text-xl font-semibold">
          {trip.title}
        </h3>
        <p className="text-muted-foreground text-sm">
          {formatDateRange(trip.startDate, trip.endDate)} · {trip.duration}
        </p>
        <p className="text-muted-foreground line-clamp-3 text-sm">
          {trip.shortDescription}
        </p>
        <Button
          href={`/voyages/${trip.slug}`}
          variant="outline"
          className="mt-auto"
          aria-label={`Découvrir le voyage ${trip.title}`}
        >
          Découvrir ce voyage
        </Button>
      </div>
    </Card>
  );
}
