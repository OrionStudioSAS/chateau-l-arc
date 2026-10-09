import type { Metadata } from "next";

import { Banniere } from "@/components/layout/banniere";
import { AvantagesMembres } from "@/components/sections/avantages-membres";
import { QuestionsTarifs } from "@/components/sections/questions-tarifs";
import { TarifsAbonnements } from "@/components/sections/tarifs-abonnements";
import { TarifsGreenFees } from "@/components/sections/tarifs-green-fees";
import { TarifsNavigation } from "@/components/sections/tarifs-navigation";

export const metadata: Metadata = {
  title: "Tarifs & abonnements",
  description:
    "Green fees, carnets, locations, practice et abonnements annuels du Golf Château l'Arc. Haute saison du 16 avril au 14 novembre, basse saison du 15 novembre au 15 avril.",
};

/** TODO : année des abonnements, à faire suivre chaque saison. */
const ANNEE_ABONNEMENTS = 2027;

export default function Page() {
  return (
    <>
      <Banniere
        image="/images/tarifs.png"
        filAriane={[{ label: "Accueil", href: "/" }, { label: "Tarifs & abonnements" }]}
        titre="Tarifs"
        // TODO : vrai une fois la grille gérée depuis le back-office (cf. lib/tarifs).
        texte="Les prix affichés sont toujours à jour : ils sont gérés directement par l'accueil du club."
        hauteur="min-h-[70svh]"
        pied={<TarifsNavigation />}
      />

      <TarifsGreenFees />

      <TarifsAbonnements annee={ANNEE_ABONNEMENTS} />

      <AvantagesMembres />

      <QuestionsTarifs />
    </>
  );
}
