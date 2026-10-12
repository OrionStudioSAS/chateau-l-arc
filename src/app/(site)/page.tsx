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
import { BANNER_ACCROCHE, BANNER_TITRE, BANNER_TEXTE } from "@/constants";
import { headerActions } from "@/config/site";
import { estPagePubliqueVisible } from "@/config/visibilite";

export default function Page() {
  return (
    <>
      <Banniere
        image="/images/banner.jpg"
        accroche={BANNER_ACCROCHE}
        titre={BANNER_TITRE}
        texte={BANNER_TEXTE}
        hauteur="min-h-[calc(100svh-2.5rem)]"
        cmsPaths={{
          accroche: "Bannière.BANNER_ACCROCHE",
          titre: "Bannière.BANNER_TITRE",
          texte: "Bannière.BANNER_TEXTE",
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

      <ChiffresCles variante="bande" />

      <Presentation />

      <ProfiterDuGolf />

      <ParcoursSignature />

      <TarifsApercu />

      {estPagePubliqueVisible("/competitions") && <CompetitionsApercu />}

      <ArtDeVivre />

      {/* Emplacement du widget « avis Google » (intégré par Orion). */}

      <Partenaires />

      {/* Emplacement du widget Instagram (intégré par Orion). */}

      <AppelAdhesion />
    </>
  );
}
