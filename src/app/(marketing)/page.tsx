import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/lib/site-config";

/**
 * Homepage hero (contract §12), built with the Phase 2 design system.
 *
 * The contract calls for "une photographie immersive" here - no real
 * hero photograph has been provided yet (the flyers were reference-only
 * and are not meant to be displayed on the site, contract §12). Shipping
 * a generated/stock image in its place would misrepresent it as real
 * photography (contract §45), so this stays a text-led hero until a real
 * photo is supplied. TODO_ASSET: hero photograph.
 *
 * The rest of the homepage (trips, destinations, testimonials...) is
 * Phase 4 - it needs real Trip/Destination data (Phase 3) to be honest
 * rather than a mock.
 */
export default function HomePage() {
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
    </main>
  );
}
