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
 * Idempotent: every write is an upsert keyed on slug, so re-running this
 * (task db:seed) never duplicates data or fails on a second run.
 */
import { prisma } from "../src/lib/db/prisma";

async function main() {
  const paris = await prisma.destination.upsert({
    where: { slug: "paris" },
    update: {},
    create: {
      slug: "paris",
      name: "Paris",
      country: "France",
      shortDescription:
        "La capitale française, entre élégance, culture et art de vivre.",
      description:
        "Paris incarne l'élégance et la culture à la française : musées, promenades le long de la Seine, gastronomie et architecture historique en font une destination intemporelle pour une parenthèse bien-être en pleine ville.",
      published: true,
    },
  });

  const berlin = await prisma.destination.upsert({
    where: { slug: "berlin" },
    update: {},
    create: {
      slug: "berlin",
      name: "Berlin",
      country: "Allemagne",
      shortDescription:
        "Une capitale vibrante entre histoire, nature et expériences en famille.",
      description:
        "Berlin mêle patrimoine historique, grands espaces verts et attractions familiales. Entre musées, parcs et expériences ludiques, la ville se prête particulièrement bien aux voyages en famille.",
      published: true,
    },
  });

  const reims = await prisma.destination.upsert({
    where: { slug: "reims" },
    update: {},
    create: {
      slug: "reims",
      name: "Reims",
      country: "France",
      shortDescription:
        "Au cœur de la Champagne, entre patrimoine, vignobles et dégustations.",
      description:
        "Reims et ses environs offrent un art de vivre à la française : maisons de Champagne historiques, vignobles à perte de vue, patrimoine gothique et moments de détente au rythme de la région.",
      published: true,
    },
  });

  await prisma.trip.upsert({
    where: { slug: "paris-evasion-bien-etre-elegance" },
    update: {},
    create: {
      slug: "paris-evasion-bien-etre-elegance",
      title: "Évasion, Bien-être & Élégance",
      shortDescription: "Journée bien-être et culture à Paris",
      description:
        "Une journée organisée à Paris, en bus VIP, pour une parenthèse bien-être et culturelle au départ d'Angleur.",
      destinationId: paris.id,
      startDate: new Date("2026-07-31T06:30:00+02:00"),
      endDate: new Date("2026-07-31T23:00:00+02:00"),
      duration: "1 journée",
      status: "COMPLETED", // see file header - flyer said sold out, date has passed
      experiences: ["Visite guidée de la capitale", "Excursion en bus VIP"],
      practicalInformation:
        "Départ 6h30 - Parking de la Gare d'Angleur, Rue Denis Lecocq 1, 4031 Angleur (bus VIP). Retour le soir.",
      publishedAt: new Date("2026-07-01T00:00:00Z"),
    },
  });

  await prisma.trip.upsert({
    where: { slug: "berlin-en-famille-2026" },
    update: {},
    create: {
      slug: "berlin-en-famille-2026",
      title: "Berlin en famille",
      shortDescription: "8 jours / 7 nuits en famille à Berlin",
      description:
        "Un séjour en famille à Berlin autour de dix expériences entre culture, nature et découvertes ludiques.",
      destinationId: berlin.id,
      startDate: new Date("2026-08-15T00:00:00+02:00"),
      endDate: new Date("2026-08-22T00:00:00+02:00"),
      duration: "8 jours / 7 nuits",
      status: "CLOSED", // flyer: "réservations clôturées" (see file header)
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
  });

  await prisma.trip.upsert({
    where: { slug: "reims-2026-routes-du-champagne" },
    update: {},
    create: {
      slug: "reims-2026-routes-du-champagne",
      title: "Reims 2026 - Sur les routes du Champagne",
      shortDescription:
        "Découvertes, dégustations, patrimoine et art de vivre en Champagne",
      description:
        "Une parenthèse d'exception au cœur de la Champagne : maisons de Champagne, vignobles, patrimoine de Reims et moments de détente.",
      destinationId: reims.id,
      startDate: new Date("2026-10-02T00:00:00+02:00"),
      endDate: new Date("2026-10-10T00:00:00+02:00"),
      duration: "9 jours / 8 nuits",
      // NEEDS_CONFIRMATION: no status or price is visible on this flyer
      // (unlike Paris/Berlin) - contract §11 forbids deducing it from the
      // flyer alone. UPCOMING because it's already publicly teased as a
      // "prochaine sortie" on the Berlin flyer, not a deduced booking state.
      status: "UPCOMING",
      experiences: [
        "Découverte des maisons de Champagne",
        "Balades au cœur des vignobles",
        "Patrimoine & charme de Reims",
        "Moments bien-être & art de vivre",
      ],
      publishedAt: new Date("2026-08-01T00:00:00Z"),
    },
  });

  console.log("[seed] Destinations: Paris, Berlin, Reims");
  console.log(
    "[seed] Trips: paris-evasion-bien-etre-elegance (COMPLETED), berlin-en-famille-2026 (CLOSED), reims-2026-routes-du-champagne (UPCOMING, NEEDS_CONFIRMATION)",
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
