import type { Metadata } from "next";

import { Banniere } from "@/components/layout/banniere";
import { AppelSaison } from "@/components/sections/appel-saison";
import { CompetitionsListe } from "@/components/sections/competitions-liste";
import { DernieresCompetitions } from "@/components/sections/dernieres-competitions";
import { getCompetitions } from "@/lib/api/content";

export const metadata: Metadata = {
  title: "Compétitions",
  description:
    "Calendrier des compétitions du Golf Château l'Arc : formules, inscriptions et résultats.",
};

export default async function Page() {
  const competitions = await getCompetitions();

  // Saison affichée : celle de la première compétition du calendrier.
  const saison = Number(
    (competitions[0]?.dateDebut ?? new Date().toISOString()).slice(0, 4),
  );

  return (
    <>
      <Banniere
        image="/images/competitions.png"
        accroche="Un lieu pensé pour tous les passionnés de golf"
        titre="Competitions"
        // Titre de 12 lettres : taille calée pour occuper la largeur.
        tailleTitre="text-[11.5cqw]"
      />

      <CompetitionsListe competitions={competitions} saison={saison} />

      <DernieresCompetitions />

      <AppelSaison />
    </>
  );
}
