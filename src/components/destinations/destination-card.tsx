import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { listPublishedDestinations } from "@/features/destinations/queries";

type Destination = Awaited<
  ReturnType<typeof listPublishedDestinations>
>[number];

/** Destination summary card (contract §15/§22) - used on /destinations. */
export function DestinationCard({ destination }: { destination: Destination }) {
  return (
    <Card className="flex flex-col gap-4 overflow-hidden p-0">
      <div className="bg-brand-sand text-brand-brown flex aspect-[4/3] items-center justify-center">
        {destination.heroImage ? (
          <Image
            src={destination.heroImage}
            alt=""
            width={400}
            height={300}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="font-heading text-lg">{destination.name}</span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6 pt-0">
        <span className="text-primary text-sm font-semibold">
          {destination.country}
        </span>
        <h3 className="font-heading text-foreground text-xl font-semibold">
          {destination.name}
        </h3>
        <p className="text-muted-foreground line-clamp-3 text-sm">
          {destination.shortDescription}
        </p>
        <Button
          href={`/destinations/${destination.slug}`}
          variant="outline"
          className="mt-auto"
        >
          Découvrir {destination.name}
        </Button>
      </div>
    </Card>
  );
}
