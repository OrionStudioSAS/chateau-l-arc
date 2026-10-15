import type { Metadata } from "next";

import { Banniere } from "@/components/layout/banniere";
import { AppelAdhesion } from "@/components/sections/appel-adhesion";
import { CompetitionsListe } from "@/components/sections/competitions-liste";
import { DernieresCompetitions } from "@/components/sections/dernieres-competitions";
import { getCompetitions } from "@/lib/api/content";
import { COMPETITIONS_PAGE_BANNIERE_IMAGE, COMPETITIONS_PAGE_BANNIERE_TEXTE, COMPETITIONS_PAGE_BANNIERE_TITRE } from "@/constants";

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
        image={COMPETITIONS_PAGE_BANNIERE_IMAGE}
        filAriane={[{ label: "Accueil", href: "/" }, { label: "Compétitions" }]}
        titre={COMPETITIONS_PAGE_BANNIERE_TITRE}
        texte={COMPETITIONS_PAGE_BANNIERE_TEXTE}
        cmsPaths={{
          titre: "Compétitions · Bannière.COMPETITIONS_PAGE_BANNIERE_TITRE",
          texte: "Compétitions · Bannière.COMPETITIONS_PAGE_BANNIERE_TEXTE",
          image: "Compétitions · Bannière.COMPETITIONS_PAGE_BANNIERE_IMAGE",
        }}
        hauteur="min-h-[70svh]"
      />

      <CompetitionsListe competitions={competitions} />

      <DernieresCompetitions saison={saison} />

      <AppelAdhesion />
    </>
  );
}
