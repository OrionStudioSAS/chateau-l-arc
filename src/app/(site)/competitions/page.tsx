import type { Metadata } from "next";

import { Banniere } from "@/components/layout/banniere";
import { AppelAdhesion } from "@/components/sections/appel-adhesion";
import { CompetitionsListe } from "@/components/sections/competitions-liste";
import { DernieresCompetitions } from "@/components/sections/dernieres-competitions";
import { getCompetitions } from "@/lib/api/content";

export const metadata: Metadata = {
  title: "Compétitions",
  description:
    "Calendrier des compétitions du Golf Château l'Arc : du scramble convivial au Grand Prix, inscriptions en ligne et résultats.",
};

export default async function Page() {
  const competitions = await getCompetitions();

  // Saison affichée : celle de la première compétition du calendrier.
  const saison = Number((competitions[0]?.dateDebut ?? "2026").slice(0, 4));

  return (
    <>
      <Banniere
        image="/images/competitions.png"
        filAriane={[{ label: "Accueil", href: "/" }, { label: "Compétitions" }]}
        titre="Compétitions"
        texte="Du scramble convivial au Grand Prix, une saison pour tous les niveaux. Inscription en ligne, résultats publiés dès le lendemain."
        hauteur="min-h-[70svh]"
      />

      <CompetitionsListe competitions={competitions} />

      <DernieresCompetitions saison={saison} />

      <AppelAdhesion />
    </>
  );
}
