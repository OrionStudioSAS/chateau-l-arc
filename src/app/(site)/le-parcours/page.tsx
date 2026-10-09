import type { Metadata } from "next";

import { Banniere } from "@/components/layout/banniere";
import { AppelAdhesion } from "@/components/sections/appel-adhesion";
import { ChiffresCles } from "@/components/sections/chiffres-cles";
import { ExplorerParcours } from "@/components/sections/explorer-parcours";
import { InfosPratiques } from "@/components/sections/infos-pratiques";
import { ParcoursDescription } from "@/components/sections/parcours-description";
import { ReperesDepart } from "@/components/sections/reperes-depart";
import { ZoneEntrainement } from "@/components/sections/zone-entrainement";

export const metadata: Metadata = {
  title: "Le parcours",
  description:
    "18 trous entre pins et garrigue, face à la montagne Sainte-Victoire : le parcours du Golf Château l'Arc, dessiné par Robert Trent Jones II.",
};

export default function Page() {
  return (
    <>
      <Banniere
        image="/images/parcours.png"
        filAriane={[{ label: "Accueil", href: "/" }, { label: "Parcours" }]}
        accroche="18 trous entre pins et garrigue, face à la montagne Sainte-Victoire."
        titre="Parcours"
        // Titre court : la taille est recalibrée pour occuper la largeur.
        tailleTitre="text-[16.25cqw]"
        texte="18 trous · par 70 · 5 817 m, dessinés par Robert Trent Jones II entre pins, garrigue et Sainte-Victoire."
      />

      <ChiffresCles
        variante="bande"
        chiffres={[
          { valeur: "18", ligne1: "Trous" },
          { valeur: "70", ligne1: "Par" },
          { valeur: "5\u00a0817 m", ligne1: "Blancs" },
          { valeur: "15 min", ligne1: "D'Aix-en-Provence" },
          { valeur: "1985", ligne1: "Création" },
          { valeur: "R. T. Jones II", ligne1: "Architecte" },
        ]}
      />

      <ParcoursDescription />

      <ReperesDepart />

      <ExplorerParcours />

      <ZoneEntrainement />

      <InfosPratiques />

      {/* Emplacement du widget Instagram (intégré par Orion). */}

      <AppelAdhesion />
    </>
  );
}
