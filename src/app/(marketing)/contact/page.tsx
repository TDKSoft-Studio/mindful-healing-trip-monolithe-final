import type { Metadata } from "next";

import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Link } from "@/components/ui/link";
import { siteConfig, socialLinks } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez Mindful Healing Trips par email ou WhatsApp pour toute question sur nos voyages.",
};

/**
 * Contact page (contract §17, Phase 4 scope: the page itself). The actual
 * contact form (validation, anti-spam, email delivery) is Phase 5 - this
 * intentionally does not ship a non-functional <form> in the meantime,
 * only the direct contact channels that already work today.
 */
export default function ContactPage() {
  return (
    <main id="main-content" className="flex flex-1 flex-col py-16 sm:py-24">
      <Container className="flex flex-col gap-10">
        <SectionHeading
          level={1}
          eyebrow="Contact"
          title="Nous contacter"
          description="Une question sur un voyage, une réservation ou autre chose ? Écrivez-nous directement."
        />

        <div className="flex flex-col gap-4 text-lg">
          <p>
            Email :{" "}
            <Link href={`mailto:${siteConfig.contactEmail}`}>
              {siteConfig.contactEmail}
            </Link>
          </p>
          {socialLinks.map((social) => (
            <p key={social.platform}>
              {social.platform} : <Link href={social.href}>{social.label}</Link>
            </p>
          ))}
        </div>
      </Container>
    </main>
  );
}
