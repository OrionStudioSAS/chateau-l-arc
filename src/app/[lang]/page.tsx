import type { Metadata } from "next";
import { Lien as Link } from "@/components/ui/lien";

import { Banniere } from "@/components/layout/banniere";
import { BoutonOr } from "@/components/ui/bouton-or";
import { AppelAdhesion } from "@/components/sections/appel-adhesion";
import { ArtDeVivre } from "@/components/sections/art-de-vivre";
import { AvisGoogle } from "@/components/sections/avis-google";
import { ChiffresCles } from "@/components/sections/chiffres-cles";
import { CompetitionsApercu } from "@/components/sections/competitions-apercu";
import { Partenaires } from "@/components/sections/partenaires";
import { ParcoursSignature } from "@/components/sections/parcours-signature";
import { Presentation } from "@/components/sections/presentation";
import { ProfiterDuGolf } from "@/components/sections/profiter-du-golf";
import { TarifsApercu } from "@/components/sections/tarifs-apercu";
import { headerActions } from "@/config/site";
import { estPagePubliqueVisible } from "@/config/visibilite";
import { getGrilleTarifs } from "@/lib/api/content";
import { JsonLd, jsonLdGolf, jsonLdSiteWeb, metadonnees } from "@/lib/seo";
import { i18n } from "@/lib/i18n/serveur";

export async function generateMetadata(): Promise<Metadata> {
  return metadonnees({
    titreAbsolu: "Château l'Arc Golf Club — Golf 18 trous près d'Aix-en-Provence",
    description: "Golf 18 trous par 70 signé Robert Trent Jones II, face à la Sainte-Victoire, à 15 min d'Aix-en-Provence. Green fees, abonnements, école de golf et restaurant.",
    chemin: "/",
  });
}

export default async function Page() {
  const { T, tr } = await i18n();
  const { ACCUEIL_CHIFFRES, BANNER_ACCROCHE, BANNER_IMAGE, BANNER_TEXTE, BANNER_TITRE } = T;
  const grille = await getGrilleTarifs();

  return (
    <>
      <JsonLd donnees={[await jsonLdGolf(), await jsonLdSiteWeb()]} />
      <Banniere
        image={BANNER_IMAGE}
        imageAlt="Le Château l'Arc entre les pins, face à la montagne Sainte-Victoire"
        accroche={BANNER_ACCROCHE}
        titre={BANNER_TITRE}
        texte={BANNER_TEXTE}
        hauteur="min-h-[calc(100svh-2.5rem)]"
        cmsPaths={{
          accroche: "Accueil · Bannière.BANNER_ACCROCHE",
          titre: "Accueil · Bannière.BANNER_TITRE",
          texte: "Accueil · Bannière.BANNER_TEXTE",
          image: "Accueil · Bannière.BANNER_IMAGE",
        }}
        actions={
          <>
            <BoutonOr
              href={headerActions.reservation.href}
              className="px-6 py-4 text-[13px] tracking-[0.08em] xl:px-6"
            >
              {tr(headerActions.reservation.label)} <span aria-hidden="true">→</span>
            </BoutonOr>
            <Link
              href="/le-parcours"
              className="inline-flex items-center rounded-sm border border-white/40 bg-black/20 px-6 py-4 text-[13px] font-semibold uppercase tracking-[0.08em] text-white backdrop-blur-sm transition-colors hover:bg-black/35"
            >
              {tr("Découvrir le parcours")}
            </Link>
          </>
        }
      />

      <ChiffresCles variante="bande" chiffres={ACCUEIL_CHIFFRES} cms="Accueil · Chiffres clés.ACCUEIL_CHIFFRES" />

      <Presentation />

      <ProfiterDuGolf />

      <ParcoursSignature />

      <TarifsApercu grille={grille} />

      {estPagePubliqueVisible("/competitions") && <CompetitionsApercu />}

      <ArtDeVivre />

      <AvisGoogle />

      <Partenaires />

      {/* Emplacement du widget Instagram (intégré par Orion). */}

      <AppelAdhesion />
    </>
  );
}
