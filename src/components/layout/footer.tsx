import Image from "next/image";

import { Container } from "@/components/ui/container";
import { Link } from "@/components/ui/link";
import {
  legalNav,
  primaryNav,
  siteConfig,
  socialLinks,
} from "@/lib/site-config";

/**
 * Site footer (contract §42): logo, short description, nav, contact,
 * social, legal, copyright - all sourced from site-config, not repeated
 * literals.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-brand-brown/10 bg-background border-t">
      <Container className="grid gap-10 py-12 sm:grid-cols-2 md:grid-cols-4">
        <div className="flex flex-col gap-3 sm:col-span-2 md:col-span-1">
          <Image
            src="/brand/logo-mindfultrip-historic-transparent.png"
            alt={siteConfig.name}
            width={56}
            height={56}
          />
          <p className="text-muted-foreground text-sm">
            {siteConfig.tagline} {siteConfig.description}
          </p>
        </div>

        <nav aria-label="Navigation du pied de page">
          <h2 className="text-foreground mb-3 text-sm font-semibold">
            Navigation
          </h2>
          <ul className="flex flex-col gap-2">
            {primaryNav.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-muted-foreground text-sm"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-foreground mb-3 text-sm font-semibold">
            Contact
          </h2>
          <ul className="text-muted-foreground flex flex-col gap-2 text-sm">
            <li>
              <Link href={`mailto:${siteConfig.contactEmail}`}>
                {siteConfig.contactEmail}
              </Link>
            </li>
            {socialLinks.map((social) => (
              <li key={social.platform}>
                <Link href={social.href}>
                  {social.platform} - {social.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-foreground mb-3 text-sm font-semibold">
            Informations légales
          </h2>
          <ul className="flex flex-col gap-2">
            {legalNav.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-muted-foreground text-sm"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <div className="border-brand-brown/10 border-t py-6">
        <Container>
          <p className="text-muted-foreground text-center text-xs">
            © {year} {siteConfig.name}. Tous droits réservés.
          </p>
        </Container>
      </div>
    </footer>
  );
}
