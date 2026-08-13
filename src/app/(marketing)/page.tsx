import { prisma } from "@/lib/db/prisma";
import type { Trip } from "@prisma/client";

export default async function HomePage() {
  const upcomingTrips = await prisma.trip.findMany({
    where: {
      status: "UPCOMING",
    },
    orderBy: {
      startDate: "asc",
    },
    take: 6,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-4xl font-bold">Mindful Healing Trips</h1>
      <p className="mb-8 text-xl">Découvrez nos voyages de bien-être</p>

      <h2 className="mb-4 text-2xl font-semibold">Prochains départs</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {upcomingTrips.map((trip: Trip) => (
          <div key={trip.id} className="rounded border p-4">
            <h3 className="text-xl font-semibold">{trip.title}</h3>
            <p className="text-gray-600">{trip.duration}</p>
            <p className="mt-2">{trip.shortDescription}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
