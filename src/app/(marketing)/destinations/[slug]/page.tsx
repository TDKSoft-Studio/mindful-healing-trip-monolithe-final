import { prisma } from "@/lib/db/prisma";
import type { Destination, Trip } from "@prisma/client";

export default async function DestinationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const destination = await prisma.destination.findUnique({
    where: { slug },
    include: { trips: true },
  });

  if (!destination) {
    return <div>Destination not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-4 text-3xl font-bold">{destination.name}</h1>
      <p className="mb-6">{destination.description}</p>

      <h2 className="mb-4 text-2xl font-semibold">Points forts</h2>
      <ul className="mb-6 list-disc pl-6">
        {destination.highlights.map((highlight: string) => (
          <li key={highlight}>{highlight}</li>
        ))}
      </ul>

      <h2 className="mb-4 text-2xl font-semibold">Voyages disponibles</h2>
      <div className="grid gap-4">
        {destination.trips.map((trip: Trip) => (
          <div key={trip.id} className="rounded border p-4">
            <h3 className="text-xl font-semibold">{trip.title}</h3>
            <p>{trip.shortDescription}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
