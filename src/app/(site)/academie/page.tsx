import type { Metadata } from "next";

import { Banniere } from "@/components/layout/banniere";
import { AcademieJuniors } from "@/components/sections/academie-juniors";
import { AcademiePrestige } from "@/components/sections/academie-prestige";
import { AcademieStages } from "@/components/sections/academie-stages";
import { SuivezNous } from "@/components/sections/suivez-nous";
import { BoutonClair } from "@/components/ui/bouton-clair";
import { BoutonOr } from "@/components/ui/bouton-or";

export const metadata: Metadata = {
  title: "L'Académie",
  description:
    "École de golf juniors et adultes, stages et initiations au Golf Château l'Arc, encadrés par des enseignants diplômés d'État.",
};

export default function Page() {
  return (
    <>
      <Banniere
        image="/images/academie.png"
        // TODO : accroche reprise de la maquette, identique à celle du parcours —
        // à remplacer par une phrase propre à l'académie.
        accroche="18 trous entre pins et garrigue, face à la montagne Sainte-Victoire."
        titre="L’Académie"
        // Titre de 10 signes : taille calée pour occuper la largeur.
        tailleTitre="text-[13.4cqw]"
        actions={
          <>
            <BoutonOr href="/reserver">Réserver un cours ou un stage</BoutonOr>
            <BoutonClair href="/contact">Nous appeler</BoutonClair>
          </>
        }
      />

      <AcademieJuniors />

      <AcademiePrestige />

      <AcademieStages />

      <SuivezNous image="/images/academie.png" />
    </>
  );
}
