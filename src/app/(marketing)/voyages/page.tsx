import type { Metadata } from "next";

import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { TripCard } from "@/components/travel/trip-card";
import { listPublishedTrips } from "@/features/trips/queries";

export const metadata: Metadata = {
  title: "Nos voyages",
  description:
    "Découvrez tous les voyages Mindful Healing Trips : destinations, dates et statuts de réservation.",
};

export default async function VoyagesPage() {
  const trips = await listPublishedTrips();

  return (
    <main id="main-content" className="flex flex-1 flex-col py-16 sm:py-24">
      <Container className="flex flex-col gap-10">
        <SectionHeading
          level={1}
          eyebrow="Voyages"
          title="Nos voyages"
          description="Voyages à venir, en cours de réservation, ou déjà vécus ensemble."
        />
        {trips.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {trips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">
            Aucun voyage disponible pour le moment.
          </p>
        )}
      </Container>
    </main>
  );
}
