import type { Metadata } from "next";

import { Banniere } from "@/components/layout/banniere";
import { ChiffresCles } from "@/components/sections/chiffres-cles";
import { ExplorerParcours } from "@/components/sections/explorer-parcours";
import { ParcoursDescription } from "@/components/sections/parcours-description";
import { ReperesDepart } from "@/components/sections/reperes-depart";
import { ZoneEntrainement } from "@/components/sections/zone-entrainement";
import { BoutonClair } from "@/components/ui/bouton-clair";
import { BoutonOr } from "@/components/ui/bouton-or";
import { headerActions } from "@/config/site";

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
        accroche="18 trous entre pins et garrigue, face à la montagne Sainte-Victoire."
        titre="Parcours"
        // Titre court : la taille est recalibrée pour occuper la largeur.
        tailleTitre="text-[16.25cqw]"
        actions={
          <>
            <BoutonOr href={headerActions.reservation.href}>Réserver ce parcours</BoutonOr>
            <BoutonClair href="/le-parcours/scorecard">Voir la scorecard</BoutonClair>
          </>
        }
      />

      <ChiffresCles
        chiffres={[
          { valeur: "18", ligne1: "Trous" },
          { valeur: "5817", ligne1: "Mètres" },
          { valeur: "70", ligne1: "Par" },
          { valeur: "128", ligne1: "Slope" },
        ]}
      />

      <ParcoursDescription />

      <ReperesDepart />

      <ExplorerParcours />

      <ZoneEntrainement />
    </>
  );
}
