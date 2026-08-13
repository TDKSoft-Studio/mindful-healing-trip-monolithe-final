import type { Metadata } from "next";

import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  robots: { index: false },
};

/**
 * Placeholder (contract §37): "Ne jamais inventer les textes juridiques
 * définitifs." RGPD-compliant text needs the actual data practices
 * (what's collected, retention, processors, cookie policy) confirmed
 * before it can be written - not guessed.
 */
export default function PolitiqueConfidentialitePage() {
  return (
    <main id="main-content" className="flex flex-1 flex-col py-16 sm:py-24">
      <Container className="flex flex-col gap-6">
        <SectionHeading title="Politique de confidentialité" />
        <div className="border-brand-brown/20 bg-brand-sand/40 rounded-xl border p-6">
          <p className="text-foreground font-semibold">
            TODO_CONTENT_CONFIRMATION
          </p>
          <p className="text-foreground mt-2">
            Cette page nécessite une politique de confidentialité conforme RGPD
            avant mise en production, notamment :
          </p>
          <ul className="text-foreground mt-2 list-disc pl-5">
            <li>Données collectées (formulaire de contact, cookies)</li>
            <li>Finalités et base légale du traitement</li>
            <li>Durée de conservation</li>
            <li>Sous-traitants / hébergement des données</li>
            <li>Droits des personnes (accès, rectification, suppression)</li>
            <li>Contact du responsable de traitement</li>
          </ul>
        </div>
      </Container>
    </main>
  );
}
