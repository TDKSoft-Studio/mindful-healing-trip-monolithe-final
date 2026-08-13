import { prisma } from "@/lib/db/prisma";
import type { Trip } from "@prisma/client";

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ voyage?: string }>;
}) {
  const { voyage } = await searchParams;
  const trips = await prisma.trip.findMany();

  const tripOptions = trips.map((trip: Trip) => ({
    value: trip.slug,
    label: trip.title,
  }));

  const defaultTripSlug = trips.some((trip: Trip) => trip.slug === voyage)
    ? voyage
    : undefined;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Contactez-nous</h1>
      <p className="mb-8">
        Pour toute question, n'hésitez pas à nous contacter.
      </p>
    </div>
  );
}
