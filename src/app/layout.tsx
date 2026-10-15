import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";

import { site } from "@/config/site";

import "./globals.css";

/** Police unique du site (variable : graisses 200 à 800). */
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.baseline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: site.name,
    title: `${site.name} — ${site.baseline}`,
    description: site.description,
    url: site.url,
  },
  alternates: { canonical: "/" },
};

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
