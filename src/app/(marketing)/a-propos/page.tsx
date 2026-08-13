import type { Metadata } from "next";

import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Mindful Healing Trips : voyage, bien-être, découverte et partage - des expériences pensées pour se ressourcer ensemble.",
};

/**
 * Positioning copy (contract §5/§6) - values and tone only, no invented
 * facts (founding date, team, numbers) since none were confirmed.
 */
export default function AProposPage() {
  return (
    <main id="main-content" className="flex flex-1 flex-col py-16 sm:py-24">
      <Container className="flex flex-col gap-10">
        <SectionHeading
          level={1}
          eyebrow="À propos"
          title="Voyage, bien-être et partage"
          description="Mindful Healing Trips n'est pas un simple tour-opérateur."
        />

        <div className="text-foreground flex max-w-3xl flex-col gap-6 text-lg">
          <p>
            Nos voyages sont pensés comme des parenthèses : l&apos;occasion de
            découvrir de nouveaux lieux, de se ressourcer et de créer des
            souvenirs ensemble, en famille ou entre proches. Chaque destination
            est choisie pour son équilibre entre culture, détente et art de
            vivre.
          </p>
          <p>
            Nous privilégions des expériences humaines et chaleureuses plutôt
            que des programmes standardisés : des découvertes culturelles, des
            moments de bien-être, et le plaisir simple de voyager ensemble.
          </p>
          <p>
            Notre approche reste accessible et rassurante, loin de l&apos;image
            d&apos;un voyage low-cost comme d&apos;un luxe ostentatoire -
            l&apos;essentiel est l&apos;expérience partagée.
          </p>
        </div>

        <div>
          <Button href="/voyages">Découvrir les voyages</Button>
        </div>
      </Container>
    </main>
  );
}
