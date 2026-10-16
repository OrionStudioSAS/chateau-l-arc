import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque } from "next/font/google";

import { site } from "@/config/site";
import { IMAGE_PARTAGE } from "@/lib/seo";

import "./globals.css";

/** Police unique du site (variable : graisses 200 à 800). */
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Valeurs par défaut de toutes les pages. Volontairement sans `canonical` :
 * chaque page déclare le sien (cf. lib/seo), sinon elles pointeraient toutes
 * vers l'accueil.
 */
export const metadata: Metadata = {
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

export const viewport: Viewport = { themeColor: "#0f2a1d" };

/**
 * Layout racine : document, polices, styles.
 * Le chrome du site public vit dans (site)/layout.tsx, celui du back-office
 * dans (admin)/admin/layout.tsx.
 */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning : des extensions de navigateur ajoutent des
    // attributs sur <html> et <body> (data-trendtrack…, cz-shortcut-listen…)
    // avant l'hydratation. Ne masque que les attributs de ces deux éléments.
    <html
      lang="fr"
      className={`${bricolage.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full font-sans" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
