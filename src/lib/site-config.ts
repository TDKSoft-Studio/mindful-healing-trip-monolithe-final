/**
 * Central site configuration (contract §42: contact/nav info must come from
 * one place, not be repeated ad hoc across components).
 *
 * Every value here is either an env var (site URL, contact email - see
 * .env.example) or a literal fact confirmed from the official flyers
 * (docs/ENGINEERING_DISCOVERY.md section 9). Nothing here is invented -
 * see the NEEDS_CONFIRMATION note below for the one item deliberately
 * left out.
 */

export const siteConfig = {
  name: "Mindful Healing Trips",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  contactEmail:
    process.env.CONTACT_EMAIL ?? "info-healingtrip@nextgen-care.org",
  tagline: "Voyagez. Respirez. Partagez.",
  description:
    "Des expériences pensées pour découvrir, se ressourcer et créer des souvenirs ensemble.",
} as const;

export type NavLink = { label: string; href: string };

/** Desktop + mobile primary navigation (contract §16). */
export const primaryNav: NavLink[] = [
  { label: "Accueil", href: "/" },
  { label: "Nos voyages", href: "/voyages" },
  { label: "Destinations", href: "/destinations" },
  { label: "À propos", href: "/a-propos" },
  { label: "Contact", href: "/contact" },
];

/** Primary CTA used in the header and hero (contract §16). */
export const primaryCta: NavLink = {
  label: "Découvrir les voyages",
  href: "/voyages",
};

/** Footer legal links (contract §41/§42). */
export const legalNav: NavLink[] = [
  { label: "Mentions légales", href: "/mentions-legales" },
  { label: "Politique de confidentialité", href: "/politique-confidentialite" },
];

/**
 * Contact channels confirmed on the official flyers (WhatsApp number is
 * identical on both the Paris and Berlin flyers). Facebook is deliberately
 * NOT included: only the page's display name ("Mindful Healing Trip") is
 * known, not a URL/slug - guessing one would violate the contract's rule
 * against inventing information (§10/§68). Add it once confirmed.
 */
export const socialLinks = [
  {
    platform: "Instagram",
    label: "@mindful.healingtrip",
    href: "https://instagram.com/mindful.healingtrip",
  },
  {
    platform: "WhatsApp",
    label: "+32 460 960 294",
    href: "https://wa.me/32460960294",
  },
] as const;
