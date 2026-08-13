import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Link } from "@/components/ui/link";
import { MobileNavigation } from "@/components/navigation/mobile-navigation";
import { primaryCta, primaryNav, siteConfig } from "@/lib/site-config";

/**
 * Site header (contract §16/§22): logo, desktop nav, primary CTA, mobile
 * menu. Sticky - a small, genuine UX win here (booking CTA stays reachable
 * while reading a long trip page), not added by default everywhere.
 */
export function Header() {
  return (
    <header className="border-brand-brown/10 bg-background/95 sticky top-0 z-40 border-b backdrop-blur">
      <Container className="relative flex h-20 items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 no-underline"
          aria-label={`${siteConfig.name} - accueil`}
        >
          <Image
            src="/brand/logo-mindfultrip-historic-transparent.png"
            alt=""
            width={48}
            height={48}
            priority
          />
          <span className="font-heading text-foreground text-lg font-semibold">
            {siteConfig.name}
          </span>
        </Link>

        <nav aria-label="Navigation principale" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {primaryNav.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-foreground hover:text-primary text-sm font-semibold no-underline"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden md:block">
          <Button href={primaryCta.href} size="md">
            {primaryCta.label}
          </Button>
        </div>

        <MobileNavigation links={primaryNav} cta={primaryCta} />
      </Container>
    </header>
  );
}
