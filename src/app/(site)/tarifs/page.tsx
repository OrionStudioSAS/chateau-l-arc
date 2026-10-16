import type { Metadata } from "next";

import { Banniere } from "@/components/layout/banniere";
import { AvantagesMembres } from "@/components/sections/avantages-membres";
import { QuestionsTarifs } from "@/components/sections/questions-tarifs";
import { TarifsAbonnements } from "@/components/sections/tarifs-abonnements";
import { TarifsGreenFees } from "@/components/sections/tarifs-green-fees";
import { TarifsNavigation } from "@/components/sections/tarifs-navigation";
import { TARIFS_PAGE_BANNIERE_IMAGE, TARIFS_PAGE_BANNIERE_TEXTE, TARIFS_PAGE_BANNIERE_TITRE } from "@/constants";
import { metadonnees } from "@/lib/seo";

export const metadata: Metadata = metadonnees({
  titre: "Tarifs green fees et abonnements",
  description: "Green fee 18 trous, 9 trous haute et basse saison, carnets, voiturettes, practice et abonnements annuels du golf de Château l'Arc, près d'Aix-en-Provence.",
  chemin: "/tarifs",
  image: "/og/tarifs.jpg",
});

/** TODO : année des abonnements, à faire suivre chaque saison. */
const ANNEE_ABONNEMENTS = 2027;

export default function Page() {
  return (
    <>
      <Banniere
        image={TARIFS_PAGE_BANNIERE_IMAGE}
        imageAlt="Le grand salon du château, accueil du golf"
        filAriane={[{ label: "Accueil", href: "/" }, { label: "Tarifs & abonnements" }]}
        titre={TARIFS_PAGE_BANNIERE_TITRE}
        // TODO : vrai une fois la grille gérée depuis le back-office (cf. lib/tarifs).
        texte={TARIFS_PAGE_BANNIERE_TEXTE}
        cmsPaths={{
          titre: "Tarifs · Bannière.TARIFS_PAGE_BANNIERE_TITRE",
          texte: "Tarifs · Bannière.TARIFS_PAGE_BANNIERE_TEXTE",
          image: "Tarifs · Bannière.TARIFS_PAGE_BANNIERE_IMAGE",
        }}
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
