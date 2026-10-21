import { notFound } from "next/navigation";

import { AnimationsDefilement } from "@/components/layout/animations-defilement";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { CmsBridge } from "@/components/cms/bridge";
import { EnTeteSite } from "@/components/layout/en-tete-site";
import { PopupMarketing } from "@/components/layout/popup-marketing";
import { SiteFooter } from "@/components/layout/site-footer";
import { SuiviAnalytics } from "@/components/layout/suivi-analytics";
import { getPopupActive } from "@/lib/api/content";
import { codesLangues, estLangue } from "@/lib/i18n";
import { dictionnaire } from "@/lib/i18n/dictionnaires";
import { LangueProvider } from "@/lib/i18n/client";
import { i18n } from "@/lib/i18n/serveur";
import { bricolage, metadataRacine, viewportRacine } from "@/lib/racine";

import "../globals.css";

export const metadata = metadataRacine;
export const viewport = viewportRacine;

/**
 * Une version prérendue du site par langue. Le français est servi sans
 * préfixe (« /tarifs » est réécrit en « /fr/tarifs » par src/proxy.ts).
 */
export async function generateStaticParams() {
  return codesLangues.map((lang) => ({ lang }));
}

/** Layout racine du site public : document, langue, chrome (en-tête, pied de page). */
export default async function SiteLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!estLangue(lang)) notFound();

  const [popup, { tr }] = await Promise.all([getPopupActive(), i18n()]);

  return (
    // suppressHydrationWarning : des extensions de navigateur ajoutent des
    // attributs sur <html> et <body> (data-trendtrack…, cz-shortcut-listen…)
    // avant l'hydratation. Ne masque que les attributs de ces deux éléments.
    <html lang={lang} className={`${bricolage.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full font-sans" suppressHydrationWarning>
        <LangueProvider langue={lang} dico={dictionnaire(lang)}>
          <div className="flex min-h-full flex-col bg-sable-50 text-encre">
            <a
              href="#contenu"
              className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-club-950 focus:px-5 focus:py-3 focus:text-sable-50"
            >
              {tr("Aller au contenu")}
            </a>
            {/* Le bandeau défile normalement ; seul l'en-tête colle en haut de la
                fenêtre, et se place donc sous le bandeau tant que la page n'a pas défilé. */}
            <AnnouncementBar />
            <EnTeteSite />
            <main id="contenu" className="flex-1">
              {children}
            </main>
            <SiteFooter />
            <PopupMarketing popup={popup} />
            <AnimationsDefilement />
            <CmsBridge />
            <SuiviAnalytics />
          </div>
        </LangueProvider>
      </body>
    </html>
  );
}
