import Image from "next/image";

import { cn } from "@/lib/utils/cn";

/**
 * Foundation placeholder homepage (Phase 1).
 *
 * This proves the stack end-to-end (fonts, design tokens, image pipeline,
 * routing) without building the real design system - that's Phase 2
 * (contract §56), and the full homepage structure (hero, trips, etc.) is
 * Phase 4 (contract §58/§12).
 */
export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-24 text-center">
      <Image
        src="/brand/logo-mindfultrip-historic-transparent.png"
        alt="Mindful Healing Trips"
        width={160}
        height={160}
        priority
      />
      <h1
        className={cn("font-heading text-brand-brown text-4xl font-semibold")}
      >
        Voyagez. Respirez. Partagez.
      </h1>
      <p className="text-brand-brown/80 max-w-md">
        Des expériences pensées pour découvrir, se ressourcer et créer des
        souvenirs ensemble.
      </p>
      <p className="text-brand-brown/50 text-sm">
        Portail en construction - Phase 1 (Foundation).
      </p>
    </main>
  );
}
