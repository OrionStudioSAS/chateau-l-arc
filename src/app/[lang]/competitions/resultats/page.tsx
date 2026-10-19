import type { Metadata } from "next";

import { PageHero } from "@/components/layout/page-hero";
import { DernieresCompetitions } from "@/components/sections/dernieres-competitions";
import { getCompetitions } from "@/lib/api/content";
import { i18n } from "@/lib/i18n/serveur";
import { metadonnees } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return metadonnees({
    titre: "Résultats des compétitions",
    description: "Classements officiels des compétitions du golf de Château l'Arc, publiés en PDF dès le lendemain de chaque épreuve, avec les vainqueurs.",
    chemin: "/competitions/resultats",
    image: "/og/competitions.jpg",
  });
}

export default async function Page() {
  const [competitions, { tr }] = await Promise.all([getCompetitions(), i18n()]);
  const saison = Number((competitions[0]?.dateDebut ?? "2026").slice(0, 4));

  return (
    <>
      <PageHero
        surtitre="Compétitions"
        titre={`${tr("Résultats de la saison")} ${saison}`}
        chapo="Classements officiels au format PDF, publiés dès le lendemain de chaque compétition."
      />
      <DernieresCompetitions saison={saison} complet />
    </>
  );
}
