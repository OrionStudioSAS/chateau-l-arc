import type { Metadata } from "next";

import { Banniere } from "@/components/layout/banniere";
import { SuivezNous } from "@/components/sections/suivez-nous";
import { TarifsAbonnements } from "@/components/sections/tarifs-abonnements";
import { TarifsGreenFees } from "@/components/sections/tarifs-green-fees";
import { TarifsSurPlace } from "@/components/sections/tarifs-sur-place";
import { BoutonClair } from "@/components/ui/bouton-clair";
import { BoutonOr } from "@/components/ui/bouton-or";
import { headerActions } from "@/config/site";

export const metadata: Metadata = {
  title: "Tarifs",
  description:
    "Green fees, carnets, locations et abonnements annuels du Golf Château l'Arc. Basse saison du 15 novembre au 15 avril.",
};

/** TODO : année de la grille tarifaire, à faire suivre chaque saison. */
const ANNEE_TARIFS = 2026;

export default function Page() {
  return (
    <>
      <Banniere
        image="/images/tarifs.png"
        accroche="Des tarifs simples, toute l'année. Basse saison du 15 novembre au 15 avril."
        titre="Tarifs"
        // Titre de 6 lettres : taille calée pour occuper la largeur.
        tailleTitre="text-[24.7cqw]"
        actions={
          <>
            <BoutonOr href={headerActions.reservation.href}>Réserver un départ</BoutonOr>
            <BoutonClair href="/contact">Nous appeler</BoutonClair>
          </>
        }
      />

      <TarifsGreenFees />

      <TarifsSurPlace />

      <TarifsAbonnements annee={ANNEE_TARIFS} />

      <SuivezNous />
    </>
  );
}
