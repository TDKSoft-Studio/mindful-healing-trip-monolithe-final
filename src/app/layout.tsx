import type { Metadata } from "next";
import { Lora, Montserrat } from "next/font/google";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { JsonLd } from "@/components/shared/json-ld";
import { organizationJsonLd } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/site-config";

import "./globals.css";

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

/**
 * This IS the homepage's resolved metadata (contract §18): `/` has no
 * metadata export of its own, so Next.js falls back to this. `title` is
 * overridden below into the template form so every other page's plain
 * title (e.g. "Nos voyages") gets suffixed into "Nos voyages | Mindful
 * Healing Trips" for its <title> tag.
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  ...buildMetadata({
    title: siteConfig.name,
    description: siteConfig.description,
    path: "/",
    appendSiteName: false,
  }),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${lora.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <JsonLd data={organizationJsonLd()} />
        <a
          href="#main-content"
          className="focus:bg-primary focus:text-primary-foreground sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:px-4 focus:py-2"
        >
          Aller au contenu principal
        </a>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
