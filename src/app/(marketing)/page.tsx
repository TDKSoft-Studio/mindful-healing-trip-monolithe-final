import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { TripCard } from "@/components/travel/trip-card";
import { listUpcomingTrips } from "@/features/trips/queries";
import { siteConfig } from "@/lib/site-config";

/**
 * Homepage (contract §12-13), built with the Phase 2 design system and
 * Phase 3 content.
 *
 * The contract calls for "une photographie immersive" in the hero - no
 * real hero photograph has been provided yet (the flyers were
 * reference-only and are not meant to be displayed on the site, contract
 * §12). Shipping a generated/stock image in its place would misrepresent
 * it as real photography (contract §45), so this stays a text-led hero
 * until a real photo is supplied. TODO_ASSET: hero photograph.
 */
export default async function HomePage() {
  const upcomingTrips = await listUpcomingTrips();

  return (
    <main id="main-content" className="flex flex-1 flex-col">
      <section className="py-24 sm:py-32">
        <Container className="flex flex-col items-center gap-6 text-center">
          <h1 className="font-heading text-foreground max-w-3xl text-4xl font-semibold sm:text-6xl">
            {siteConfig.tagline}
          </h1>
          <p className="text-muted-foreground max-w-xl text-lg">
            {siteConfig.description}
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button href="/voyages" size="lg">
              Découvrir les voyages
            </Button>
            <Button href="/contact" variant="outline" size="lg">
              Nous contacter
            </Button>
          </div>
        </Container>
      </section>

      {upcomingTrips.length > 0 ? (
        <section className="py-16 sm:py-24">
          <Container className="flex flex-col gap-10">
            <SectionHeading
              eyebrow="Prochains voyages"
              title="Les prochaines expériences à vivre"
              description="Voyages ouverts aux réservations ou bientôt annoncés."
            />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {upcomingTrips.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
            <Button href="/voyages" variant="outline" className="self-center">
              Voir tous les voyages
            </Button>
          </Container>
        </section>
      ) : null}
    </main>
  );
}
