import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { ImageGallery } from "@/components/shared/image-gallery";
import { TripCard } from "@/components/travel/trip-card";
import { getPublishedDestinationBySlug } from "@/features/destinations/queries";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const destination = await getPublishedDestinationBySlug(slug);
  if (!destination) return {};

  return {
    title: destination.seoTitle ?? destination.name,
    description: destination.seoDescription ?? destination.shortDescription,
  };
}

export default async function DestinationPage({ params }: { params: Params }) {
  const { slug } = await params;
  const destination = await getPublishedDestinationBySlug(slug);

  if (!destination) {
    notFound();
  }

  return (
    <main id="main-content" className="flex flex-1 flex-col py-16 sm:py-24">
      <Container className="flex flex-col gap-10">
        <Breadcrumb
          items={[
            { label: "Accueil", href: "/" },
            { label: "Destinations", href: "/destinations" },
            { label: destination.name },
          ]}
        />

        <div className="flex flex-col gap-4">
          <span className="text-primary text-sm font-semibold">
            {destination.country}
          </span>
          <h1 className="font-heading text-foreground text-4xl font-semibold sm:text-5xl">
            {destination.name}
          </h1>
          <p className="text-foreground max-w-3xl text-lg">
            {destination.description}
          </p>
        </div>

        <ImageGallery images={destination.gallery} label={destination.name} />

        {destination.highlights.length > 0 ? (
          <section className="flex flex-col gap-4">
            <h2 className="font-heading text-foreground text-2xl font-semibold">
              Points forts
            </h2>
            <ul className="grid gap-2 sm:grid-cols-2">
              {destination.highlights.map((highlight) => (
                <li key={highlight} className="text-foreground">
                  {highlight}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {destination.practicalInformation ? (
          <section className="flex flex-col gap-4">
            <h2 className="font-heading text-foreground text-2xl font-semibold">
              Informations pratiques
            </h2>
            <p className="text-foreground">
              {destination.practicalInformation}
            </p>
          </section>
        ) : null}

        <section className="flex flex-col gap-6">
          <SectionHeading title={`Voyages à ${destination.name}`} />
          {destination.trips.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {destination.trips.map((trip) => (
                <TripCard key={trip.id} trip={{ ...trip, destination }} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">
              Aucun voyage disponible actuellement pour cette destination.
            </p>
          )}
        </section>
      </Container>
    </main>
  );
}
