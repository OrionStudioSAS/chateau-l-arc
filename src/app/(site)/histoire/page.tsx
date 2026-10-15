import type { Metadata } from "next";

import { Banniere } from "@/components/layout/banniere";
import { AppelAdhesion } from "@/components/sections/appel-adhesion";
import { ChiffresCles } from "@/components/sections/chiffres-cles";
import { DomaineAujourdhui } from "@/components/sections/domaine-aujourdhui";
import { FriseHistoire } from "@/components/sections/frise-histoire";
import { HistoireIntro } from "@/components/sections/histoire-intro";
import { VenirAuDomaine } from "@/components/sections/venir-au-domaine";
import { HISTOIRE_BANNIERE_IMAGE, HISTOIRE_BANNIERE_TEXTE, HISTOIRE_BANNIERE_TITRE, HISTOIRE_CHIFFRES } from "@/constants";

export const metadata: Metadata = {
  title: "Notre histoire",
  description:
    "Quatre siècles d'histoire au pied de la Sainte-Victoire : une demeure de famille, un atelier d'artistes, un décor de cinéma et aujourd'hui un golf.",
};

export default function Page() {
  return (
    <>
      <Banniere
        image={HISTOIRE_BANNIERE_IMAGE}
        filAriane={[{ label: "Accueil", href: "/" }, { label: "Notre histoire" }]}
        titre={HISTOIRE_BANNIERE_TITRE}
        texte={HISTOIRE_BANNIERE_TEXTE}
        cmsPaths={{
          titre: "Histoire · Bannière.HISTOIRE_BANNIERE_TITRE",
          texte: "Histoire · Bannière.HISTOIRE_BANNIERE_TEXTE",
          image: "Histoire · Bannière.HISTOIRE_BANNIERE_IMAGE",
        }}
        hauteur="min-h-[70svh]"
      />

      <ChiffresCles
        variante="bande"
        chiffres={HISTOIRE_CHIFFRES}
        cms="Histoire · Chiffres clés.HISTOIRE_CHIFFRES"
      />

      <HistoireIntro />

      <FriseHistoire />

      <DomaineAujourdhui />

      <VenirAuDomaine />

      <AppelAdhesion />
    </>
  );
}
