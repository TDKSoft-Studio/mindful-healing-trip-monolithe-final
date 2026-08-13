import { describe, expect, it } from "vitest";

import {
  destinationJsonLd,
  organizationJsonLd,
  tripJsonLd,
} from "@/lib/seo/json-ld";
import { siteConfig } from "@/lib/site-config";

describe("organizationJsonLd", () => {
  it("describes the business with contract-confirmed fields only", () => {
    const data = organizationJsonLd();

    expect(data["@type"]).toBe("TravelAgency");
    expect(data.name).toBe(siteConfig.name);
    expect(data.email).toBe(siteConfig.contactEmail);
    // Facebook is deliberately absent from socialLinks (only the page name
    // is known, not a URL - contract §10/§68) - sameAs must reflect that.
    expect(data.sameAs.some((url) => url.includes("facebook.com"))).toBe(false);
  });
});

describe("tripJsonLd", () => {
  const baseTrip = {
    slug: "reims-2026",
    title: "Reims 2026",
    shortDescription: "Sur les routes du Champagne",
    startDate: new Date("2026-10-02"),
    endDate: new Date("2026-10-10"),
    status: "UPCOMING" as const,
    currency: "EUR",
  };

  it("omits offers entirely when the price is unconfirmed", () => {
    const data = tripJsonLd({ ...baseTrip, price: null });
    expect(data).not.toHaveProperty("offers");
  });

  it("includes offers with availability when a price is confirmed", () => {
    const data = tripJsonLd({
      ...baseTrip,
      status: "OPEN",
      price: { toString: () => "450" },
    });

    expect(data.offers).toEqual({
      "@type": "Offer",
      price: "450",
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
    });
  });

  it("marks a non-bookable status as sold out rather than in stock", () => {
    const data = tripJsonLd({
      ...baseTrip,
      status: "SOLD_OUT",
      price: { toString: () => "450" },
    });

    expect(data.offers?.availability).toBe("https://schema.org/SoldOut");
  });
});

describe("destinationJsonLd", () => {
  it("builds a TouristDestination with the confirmed country", () => {
    const data = destinationJsonLd({
      slug: "reims",
      name: "Reims",
      country: "France",
      shortDescription: "Champagne et patrimoine.",
    });

    expect(data["@type"]).toBe("TouristDestination");
    expect(data.address).toEqual({
      "@type": "PostalAddress",
      addressCountry: "France",
    });
  });
});
