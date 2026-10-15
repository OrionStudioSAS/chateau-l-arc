import Link from "next/link";

import { Banniere } from "@/components/layout/banniere";
import { BoutonOr } from "@/components/ui/bouton-or";
import { AppelAdhesion } from "@/components/sections/appel-adhesion";
import { ArtDeVivre } from "@/components/sections/art-de-vivre";
import { ChiffresCles } from "@/components/sections/chiffres-cles";
import { CompetitionsApercu } from "@/components/sections/competitions-apercu";
import { Partenaires } from "@/components/sections/partenaires";
import { ParcoursSignature } from "@/components/sections/parcours-signature";
import { Presentation } from "@/components/sections/presentation";
import { ProfiterDuGolf } from "@/components/sections/profiter-du-golf";
import { TarifsApercu } from "@/components/sections/tarifs-apercu";
import { ACCUEIL_CHIFFRES, BANNER_ACCROCHE, BANNER_IMAGE, BANNER_TITRE, BANNER_TEXTE } from "@/constants";
import { headerActions } from "@/config/site";
import { estPagePubliqueVisible } from "@/config/visibilite";
import { getGrilleTarifs } from "@/lib/api/content";

export default async function Page() {
  const grille = await getGrilleTarifs();

  return (
    <>
      <Banniere
        image={BANNER_IMAGE}
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
              {headerActions.reservation.label} <span aria-hidden="true">→</span>
            </BoutonOr>
            <Link
              href="/le-parcours"
              className="inline-flex items-center rounded-sm border border-white/40 bg-black/20 px-6 py-4 text-[13px] font-semibold uppercase tracking-[0.08em] text-white backdrop-blur-sm transition-colors hover:bg-black/35"
            >
              Découvrir le parcours
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

      {/* Emplacement du widget « avis Google » (intégré par Orion). */}

      <Partenaires />

      {/* Emplacement du widget Instagram (intégré par Orion). */}

      <AppelAdhesion />
    </>
  );
}
