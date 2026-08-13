import { isBookable, type TripStatus } from "@/lib/trip-status";
import { siteConfig, socialLinks } from "@/lib/site-config";

/**
 * Schema.org structured data (contract §18: "pour voyages/destinations/
 * organisation, lorsque pertinent"). Kept deliberately simple - only
 * properties backed by real, confirmed data (contract §68: never invent a
 * value to fill out a schema).
 */

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: siteConfig.name,
    url: siteConfig.siteUrl,
    logo: new URL(
      "/brand/logo-mindfultrip-historic-transparent.png",
      siteConfig.siteUrl,
    ).toString(),
    description: siteConfig.description,
    email: siteConfig.contactEmail,
    sameAs: socialLinks.map((social) => social.href),
  };
}

type TripJsonLdInput = {
  slug: string;
  title: string;
  shortDescription: string;
  startDate: Date;
  endDate: Date;
  status: TripStatus;
  price: { toString(): string } | null;
  currency: string;
};

export function tripJsonLd(trip: TripJsonLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: trip.title,
    description: trip.shortDescription,
    url: new URL(`/voyages/${trip.slug}`, siteConfig.siteUrl).toString(),
    touristType: "Leisure",
    startDate: trip.startDate.toISOString(),
    endDate: trip.endDate.toISOString(),
    provider: {
      "@type": "TravelAgency",
      name: siteConfig.name,
      url: siteConfig.siteUrl,
    },
    ...(trip.price
      ? {
          offers: {
            "@type": "Offer",
            price: trip.price.toString(),
            priceCurrency: trip.currency,
            availability: isBookable(trip.status)
              ? "https://schema.org/InStock"
              : "https://schema.org/SoldOut",
          },
        }
      : {}),
  };
}

type DestinationJsonLdInput = {
  slug: string;
  name: string;
  country: string;
  shortDescription: string;
};

export function destinationJsonLd(destination: DestinationJsonLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: destination.name,
    description: destination.shortDescription,
    url: new URL(
      `/destinations/${destination.slug}`,
      siteConfig.siteUrl,
    ).toString(),
    address: {
      "@type": "PostalAddress",
      addressCountry: destination.country,
    },
  };
}
