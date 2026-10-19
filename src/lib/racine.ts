import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque } from "next/font/google";

import { site } from "@/config/site";
import { IMAGE_PARTAGE } from "@/lib/seo";

/**
 * Socle commun aux deux layouts racine (site public sous app/[lang], back-
 * office sous app/(admin)) : police, valeurs par défaut des métadonnées.
 */

/** Police unique du site (variable : graisses 200 à 800). */
export const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Valeurs par défaut de toutes les pages. Volontairement sans `canonical` :
 * chaque page déclare le sien (cf. lib/seo), sinon elles pointeraient toutes
 * vers l'accueil.
 */
export const metadataRacine: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.nomMarque} — Golf 18 trous près d'Aix-en-Provence`,
    template: `%s | ${site.nomMarque}`,
  },
  description: site.description,
  applicationName: site.nomMarque,
  category: "sports",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: site.nomMarque,
    images: [{ url: IMAGE_PARTAGE, width: 1200, height: 630, alt: site.nomMarque }],
  },
  twitter: { card: "summary_large_image", images: [IMAGE_PARTAGE] },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  // Code de vérification Google Search Console (balise meta), si renseigné.
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } }
    : {}),
};

export const viewportRacine: Viewport = { themeColor: "#0f2a1d" };
