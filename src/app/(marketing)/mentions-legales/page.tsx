import type { Metadata } from "next";

import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

export const metadata: Metadata = {
  title: "Mentions légales",
  robots: { index: false },
};

/**
 * Placeholder (contract §37): "Ne jamais inventer les textes juridiques
 * définitifs. Créer des placeholders clairement identifiés si les textes
 * officiels ne sont pas fournis." None of this legal/company information
 * has been confirmed - do not fill it in without it being provided.
 */
export default function MentionsLegalesPage() {
  return (
    <main id="main-content" className="flex flex-1 flex-col py-16 sm:py-24">
      <Container className="flex flex-col gap-6">
        <SectionHeading title="Mentions légales" />
        <div className="border-brand-brown/20 bg-brand-sand/40 rounded-xl border p-6">
          <p className="text-foreground font-semibold">
            TODO_CONTENT_CONFIRMATION
          </p>
          <p className="text-foreground mt-2">
            Cette page nécessite les informations légales officielles avant mise
            en production :
          </p>
          <ul className="text-foreground mt-2 list-disc pl-5">
            <li>Raison sociale et forme juridique</li>
            <li>Adresse du siège social</li>
            <li>Numéro d&apos;entreprise / SIRET</li>
            <li>Directeur de la publication</li>
            <li>Hébergeur du site (nom, adresse, contact)</li>
          </ul>
        </div>
      </Container>
    </main>
  );
}
