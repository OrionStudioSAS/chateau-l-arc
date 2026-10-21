import type { Metadata } from "next";

import { Banniere } from "@/components/layout/banniere";
import { AppelAdhesion } from "@/components/sections/appel-adhesion";
import { CompetitionsListe } from "@/components/sections/competitions-liste";
import { DernieresCompetitions } from "@/components/sections/dernieres-competitions";
import { getCompetitions, getEvenements } from "@/lib/api/content";
import { metadonnees } from "@/lib/seo";
import { i18n } from "@/lib/i18n/serveur";

export async function generateMetadata(): Promise<Metadata> {
  return metadonnees({
    titre: "Compétitions de golf",
    description: "Calendrier des compétitions du golf de Château l'Arc à Fuveau : scrambles, Grand Prix, seniors. Inscriptions en ligne et résultats dès le lendemain.",
    chemin: "/competitions",
    image: "/og/competitions.jpg",
  });
}

export default async function Page() {
  const { T } = await i18n();
  const { COMPETITIONS_PAGE_BANNIERE_IMAGE, COMPETITIONS_PAGE_BANNIERE_TEXTE, COMPETITIONS_PAGE_BANNIERE_TITRE } = T;
  const [competitions, evenements] = await Promise.all([getCompetitions(), getEvenements()]);

  // Saison affichée : celle de la première compétition du calendrier.
  const saison = Number((competitions[0]?.dateDebut ?? "2026").slice(0, 4));

  return (
    <>
      <Banniere
        image={COMPETITIONS_PAGE_BANNIERE_IMAGE}
        imageAlt="Golfeurs réunis lors d'une compétition au Château l'Arc"
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

      <CompetitionsListe competitions={competitions} evenements={evenements} />

      <DernieresCompetitions saison={saison} />

      <AppelAdhesion />
    </>
  );
}
