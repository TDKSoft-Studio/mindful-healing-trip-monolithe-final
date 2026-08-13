import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { DestinationCard } from "@/components/destinations/destination-card";
import { listPublishedDestinations } from "@/features/destinations/queries";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Destinations",
  description:
    "Découvrez les destinations Mindful Healing Trips : Paris, Berlin, Reims et bien d'autres à venir.",
  path: "/destinations",
});

export default async function DestinationsPage() {
  const destinations = await listPublishedDestinations();

  return (
    <main id="main-content" className="flex flex-1 flex-col py-16 sm:py-24">
      <Container className="flex flex-col gap-10">
        <SectionHeading
          level={1}
          eyebrow="Destinations"
          title="Nos destinations"
          description="Chaque destination est pensée pour découvrir, se ressourcer et créer des souvenirs."
        />
        {destinations.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {destinations.map((destination) => (
              <DestinationCard key={destination.id} destination={destination} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">
            Aucune destination disponible pour le moment.
          </p>
        )}
      </Container>
    </main>
  );
}
