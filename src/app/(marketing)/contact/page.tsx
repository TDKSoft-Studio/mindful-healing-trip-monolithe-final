import type { Metadata } from "next";

import { ContactForm } from "@/components/forms/contact-form";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Link } from "@/components/ui/link";
import { listPublishedTrips } from "@/features/trips/queries";
import { siteConfig, socialLinks } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez Mindful Healing Trips par email ou WhatsApp pour toute question sur nos voyages.",
};

type SearchParams = Promise<{ voyage?: string }>;

/**
 * Contact page (contract §17). Direct contact channels alongside the
 * contact form itself - the form's `tripSlug` field is pre-filled from
 * `?voyage=` when arriving via BookingCTA's non-bookable fallback link
 * (contract §14/§22).
 */
export default async function ContactPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { voyage } = await searchParams;
  const trips = await listPublishedTrips();
  const tripOptions = trips.map((trip) => ({
    slug: trip.slug,
    title: trip.title,
  }));
  const defaultTripSlug = trips.some((trip) => trip.slug === voyage)
    ? voyage
    : undefined;

  return (
    <main id="main-content" className="flex flex-1 flex-col py-16 sm:py-24">
      <Container className="flex flex-col gap-10">
        <SectionHeading
          level={1}
          eyebrow="Contact"
          title="Nous contacter"
          description="Une question sur un voyage, une réservation ou autre chose ? Écrivez-nous directement."
        />

        <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">
          <div className="flex flex-col gap-4 text-lg">
            <p>
              Email :{" "}
              <Link href={`mailto:${siteConfig.contactEmail}`}>
                {siteConfig.contactEmail}
              </Link>
            </p>
            {socialLinks.map((social) => (
              <p key={social.platform}>
                {social.platform} :{" "}
                <Link href={social.href}>{social.label}</Link>
              </p>
            ))}
          </div>

          <ContactForm trips={tripOptions} defaultTripSlug={defaultTripSlug} />
        </div>
      </Container>
    </main>
  );
}
