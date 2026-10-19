import { bricolage, metadataRacine, viewportRacine } from "@/lib/racine";

import "../globals.css";

export const metadata = metadataRacine;
export const viewport = viewportRacine;

/** Layout racine du back-office (le site public a le sien, sous app/[lang]). */
export default function RacineAdmin({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning : des extensions de navigateur ajoutent des
    // attributs sur <html> et <body> avant l'hydratation.
    <html lang="fr" className={`${bricolage.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full font-sans" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
