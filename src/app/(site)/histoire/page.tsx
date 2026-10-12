import type { Metadata } from "next";

import { Banniere } from "@/components/layout/banniere";
import { AppelAdhesion } from "@/components/sections/appel-adhesion";
import { ChiffresCles } from "@/components/sections/chiffres-cles";
import { DomaineAujourdhui } from "@/components/sections/domaine-aujourdhui";
import { FriseHistoire } from "@/components/sections/frise-histoire";
import { HistoireIntro } from "@/components/sections/histoire-intro";
import { VenirAuDomaine } from "@/components/sections/venir-au-domaine";

export const metadata: Metadata = {
  title: "Notre histoire",
  description:
    "Quatre siècles d'histoire au pied de la Sainte-Victoire : une demeure de famille, un atelier d'artistes, un décor de cinéma et aujourd'hui un golf.",
};

export default function Page() {
  return (
    <>
      <Banniere
        image="/images/hp-haut-gauche.png"
        filAriane={[{ label: "Accueil", href: "/" }, { label: "Notre histoire" }]}
        titre="Histoire"
        texte="Quatre siècles d'histoire au pied de la Sainte-Victoire : une demeure de famille, un atelier d'artistes, un décor de cinéma et aujourd'hui un golf."
        hauteur="min-h-[70svh]"
      />

      <ChiffresCles
        variante="bande"
        chiffres={[
          { valeur: "1620", ligne1: "Construction du château" },
          { valeur: "100 ha", ligne1: "Superficie du domaine" },
          { valeur: "1985", ligne1: "Création du golf" },
          { valeur: "25 min", ligne1: "Aéroport & gare TGV" },
        ]}
      />

      <HistoireIntro />

      <FriseHistoire />

      <DomaineAujourdhui />

      <VenirAuDomaine />

      <AppelAdhesion />
    </>
  );
}
