import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils/cn";

/**
 * Generic content container (contract §22). TripCard/DestinationCard
 * (Phase 4) will build on top of this once real Trip/Destination data
 * exists - no point shaping those now around guessed data.
 */
export function Card({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn(
        "border-brand-brown/10 rounded-2xl border bg-white/60 p-6 shadow-sm",
        className,
      )}
      {...props}
    />
  );
}
