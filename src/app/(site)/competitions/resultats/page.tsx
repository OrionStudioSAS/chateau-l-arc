import type { Metadata } from "next";

import { PageHero } from "@/components/layout/page-hero";
import { DernieresCompetitions } from "@/components/sections/dernieres-competitions";
import { getCompetitions } from "@/lib/api/content";

export const metadata: Metadata = {
  title: "Résultats des compétitions",
  description:
    "Classements officiels des compétitions du Golf Château l'Arc, publiés dès le lendemain.",
};

export default async function Page() {
  const competitions = await getCompetitions();
  const saison = Number((competitions[0]?.dateDebut ?? "2026").slice(0, 4));

  return (
    <>
      <PageHero
        surtitre="Compétitions"
        titre={`Résultats de la saison ${saison}`}
        chapo="Classements officiels au format PDF, publiés dès le lendemain de chaque compétition."
      />
      <DernieresCompetitions saison={saison} complet />
    </>
  );
}
