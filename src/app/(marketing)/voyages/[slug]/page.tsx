import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BookingCTA } from "@/components/travel/booking-cta";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Container } from "@/components/ui/container";
import { StatusBadge } from "@/components/ui/status-badge";
import { ImageGallery } from "@/components/shared/image-gallery";
import { JsonLd } from "@/components/shared/json-ld";
import { getPublishedTripBySlug } from "@/features/trips/queries";
import { tripJsonLd } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/site-config";
import { formatDateRange } from "@/lib/utils/format-date-range";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const trip = await getPublishedTripBySlug(slug);
  if (!trip) return {};

  return buildMetadata({
    title: trip.seoTitle ?? trip.title,
    description: trip.seoDescription ?? trip.shortDescription,
    path: `/voyages/${trip.slug}`,
    image: trip.coverImage ?? undefined,
  });
}

export default async function TripPage({ params }: { params: Params }) {
  const { slug } = await params;
  const trip = await getPublishedTripBySlug(slug);

  if (!trip) {
    notFound();
  }

  const contactInfo = trip.contactInformation ?? siteConfig.contactEmail;

  return (
    <main id="main-content" className="flex flex-1 flex-col py-16 sm:py-24">
      <JsonLd data={tripJsonLd(trip)} />
      <Container className="flex flex-col gap-10">
        <Breadcrumb
          items={[
            { label: "Accueil", href: "/" },
            { label: "Nos voyages", href: "/voyages" },
            { label: trip.title },
          ]}
        />

        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-primary text-sm font-semibold">
              {trip.destination.name}
            </span>
            <StatusBadge status={trip.status} />
          </div>
          <h1 className="font-heading text-foreground text-4xl font-semibold sm:text-5xl">
            {trip.title}
          </h1>
          <p className="text-muted-foreground text-lg">
            {formatDateRange(trip.startDate, trip.endDate)} · {trip.duration}
          </p>
        </div>

        <p className="text-foreground max-w-3xl text-lg">{trip.description}</p>

        <ImageGallery images={trip.gallery} label={trip.title} />

        {trip.experiences.length > 0 ? (
          <section className="flex flex-col gap-4">
            <h2 className="font-heading text-foreground text-2xl font-semibold">
              Expériences
            </h2>
            <ul className="grid gap-2 sm:grid-cols-2">
              {trip.experiences.map((experience) => (
                <li key={experience} className="text-foreground">
                  {experience}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {trip.highlights.length > 0 ? (
          <section className="flex flex-col gap-4">
            <h2 className="font-heading text-foreground text-2xl font-semibold">
              Points forts
            </h2>
            <ul className="grid gap-2 sm:grid-cols-2">
              {trip.highlights.map((highlight) => (
                <li key={highlight} className="text-foreground">
                  {highlight}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {trip.practicalInformation ? (
          <section className="flex flex-col gap-4">
            <h2 className="font-heading text-foreground text-2xl font-semibold">
              Informations pratiques
            </h2>
            <p className="text-foreground">{trip.practicalInformation}</p>
          </section>
        ) : null}

        {trip.included.length > 0 || trip.excluded.length > 0 ? (
          <section className="grid gap-6 sm:grid-cols-2">
            {trip.included.length > 0 ? (
              <div>
                <h2 className="font-heading text-foreground mb-3 text-xl font-semibold">
                  Inclus
                </h2>
                <ul className="text-foreground flex flex-col gap-1">
                  {trip.included.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {trip.excluded.length > 0 ? (
              <div>
                <h2 className="font-heading text-foreground mb-3 text-xl font-semibold">
                  Exclus
                </h2>
                <ul className="text-foreground flex flex-col gap-1">
                  {trip.excluded.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </section>
        ) : null}

        {trip.price ? (
          <p className="text-foreground text-2xl font-semibold">
            À partir de {trip.price.toString()} {trip.currency}
          </p>
        ) : null}

        <div className="border-brand-brown/10 flex flex-col gap-2 border-t pt-8">
          <BookingCTA
            slug={trip.slug}
            status={trip.status}
            bookingUrl={trip.bookingUrl}
            bookingMode={trip.bookingMode}
          />
          <p className="text-muted-foreground text-sm">
            Une question ? Contactez-nous : {contactInfo}
          </p>
        </div>
      </Container>
    </main>
  );
}
