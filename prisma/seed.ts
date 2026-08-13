/**
 * Development database seed - Phase 3 (Content/Data).
 *
 * Content sourced from docs/ENGINEERING_DISCOVERY.md (section 9), which
 * records exactly what is confirmed on the official flyers vs what is
 * still unknown. Nothing below is invented (contract §10/§68):
 * - Prices are omitted (null) everywhere - none were confirmed.
 * - Reims's status is genuinely unknown (no status/price on that flyer) -
 *   seeded as UPCOMING because it's already publicly teased on the Berlin
 *   flyer's "prochaines sorties", but this MUST be confirmed with the
 *   commanditaire before go-live. NEEDS_CONFIRMATION.
 * - Paris's flyer literally says "complet / sold out", but the trip date
 *   (31/07/2026) has passed relative to the project's current date
 *   (13/08/2026) - contract §11 explicitly says a past trip must be
 *   treated as historical/completed, so it's seeded COMPLETED, not
 *   SOLD_OUT.
 * - Berlin's flyer says "réservations clôturées" and the trip (15-22 août
 *   2026) hasn't happened yet as of the project's current date - seeded
 *   CLOSED, matching the flyer, not COMPLETED (that would be inventing
 *   an outcome that hasn't happened).
 *
 * Dates are stored as UTC midnight for the calendar day (e.g.
 * "2026-08-15", not a local-time instant) - these are calendar dates a
 * visitor reads ("du 15 au 22 août"), not precise timestamps, so there's
 * no timezone conversion to get wrong when formatting them.
 *
 * Idempotent AND re-runnable: every upsert's `update` mirrors `create`, so
 * running this again after editing content below converges the DB to
 * match - it's not just "insert once and never touch again".
 */
import { prisma } from "../src/lib/db/prisma";

async function main() {
  const destinations = [
    {
      slug: "paris",
      name: "Paris",
      country: "France",
      shortDescription:
        "La capitale française, entre élégance, culture et art de vivre.",
      description:
        "Paris incarne l'élégance et la culture à la française : musées, promenades le long de la Seine, gastronomie et architecture historique en font une destination intemporelle pour une parenthèse bien-être en pleine ville.",
      published: true,
    },
    {
      slug: "berlin",
      name: "Berlin",
      country: "Allemagne",
      shortDescription:
        "Une capitale vibrante entre histoire, nature et expériences en famille.",
      description:
        "Berlin mêle patrimoine historique, grands espaces verts et attractions familiales. Entre musées, parcs et expériences ludiques, la ville se prête particulièrement bien aux voyages en famille.",
      published: true,
    },
    {
      slug: "reims",
      name: "Reims",
      country: "France",
      shortDescription:
        "Au cœur de la Champagne, entre patrimoine, vignobles et dégustations.",
      description:
        "Reims et ses environs offrent un art de vivre à la française : maisons de Champagne historiques, vignobles à perte de vue, patrimoine gothique et moments de détente au rythme de la région.",
      published: true,
    },
  ];

  const destinationIds: Record<string, string> = {};
  for (const destination of destinations) {
    const { slug, ...data } = destination;
    const row = await prisma.destination.upsert({
      where: { slug },
      update: data,
      create: { slug, ...data },
    });
    destinationIds[slug] = row.id;
  }

  const trips = [
    {
      slug: "paris-evasion-bien-etre-elegance",
      title: "Évasion, Bien-être & Élégance",
      shortDescription: "Journée bien-être et culture à Paris",
      description:
        "Une journée organisée à Paris, en bus VIP, pour une parenthèse bien-être et culturelle au départ d'Angleur.",
      destinationSlug: "paris",
      startDate: new Date("2026-07-31"),
      endDate: new Date("2026-07-31"),
      duration: "1 journée",
      status: "COMPLETED" as const, // see file header - flyer said sold out, date has passed
      experiences: ["Visite guidée de la capitale", "Excursion en bus VIP"],
      practicalInformation:
        "Départ 6h30 - Parking de la Gare d'Angleur, Rue Denis Lecocq 1, 4031 Angleur (bus VIP). Retour le soir.",
      publishedAt: new Date("2026-07-01T00:00:00Z"),
    },
    {
      slug: "berlin-en-famille-2026",
      title: "Berlin en famille",
      shortDescription: "8 jours / 7 nuits en famille à Berlin",
      description:
        "Un séjour en famille à Berlin autour de dix expériences entre culture, nature et découvertes ludiques.",
      destinationSlug: "berlin",
      startDate: new Date("2026-08-15"),
      endDate: new Date("2026-08-22"),
      duration: "8 jours / 7 nuits",
      status: "CLOSED" as const, // flyer: "réservations clôturées" (see file header)
      experiences: [
        "Berlin en panorama - découverte de la ville + panorama 360°",
        "Porte de Brandebourg + Parc Tiergarten",
        "East Side Gallery + croisière sur la Spree",
        "Musée d'Histoire naturelle",
        "Musée allemand de la Technique",
        "LEGOLAND Discovery Centre",
        "Tierpark Berlin",
        "Jardin botanique & serres tropicales",
        "Tropical Islands",
        "Tempelhofer Feld",
      ],
      publishedAt: new Date("2026-06-01T00:00:00Z"),
    },
    {
      slug: "reims-2026-routes-du-champagne",
      title: "Reims 2026 - Sur les routes du Champagne",
      shortDescription:
        "Découvertes, dégustations, patrimoine et art de vivre en Champagne",
      description:
        "Une parenthèse d'exception au cœur de la Champagne : maisons de Champagne, vignobles, patrimoine de Reims et moments de détente.",
      destinationSlug: "reims",
      startDate: new Date("2026-10-02"),
      endDate: new Date("2026-10-10"),
      duration: "9 jours / 8 nuits",
      // NEEDS_CONFIRMATION: no status or price is visible on this flyer
      // (unlike Paris/Berlin) - contract §11 forbids deducing it from the
      // flyer alone. UPCOMING because it's already publicly teased as a
      // "prochaine sortie" on the Berlin flyer, not a deduced booking state.
      status: "UPCOMING" as const,
      experiences: [
        "Découverte des maisons de Champagne",
        "Balades au cœur des vignobles",
        "Patrimoine & charme de Reims",
        "Moments bien-être & art de vivre",
      ],
      publishedAt: new Date("2026-08-01T00:00:00Z"),
    },
  ];

  for (const trip of trips) {
    const { slug, destinationSlug, ...rest } = trip;
    const data = { ...rest, destinationId: destinationIds[destinationSlug] };
    await prisma.trip.upsert({
      where: { slug },
      update: data,
      create: { slug, ...data },
    });
  }

  console.log(
    `[seed] Destinations: ${destinations.map((d) => d.slug).join(", ")}`,
  );
  console.log(
    `[seed] Trips: ${trips.map((t) => `${t.slug} (${t.status})`).join(", ")}`,
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error("[seed] Failed:", error);
    await prisma.$disconnect();
    process.exit(1);
  });
