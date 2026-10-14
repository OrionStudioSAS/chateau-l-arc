import "server-only";

import { avecEtat, mapperCompetition } from "@/lib/competitions";
import type { CompetitionAvecEtat } from "@/lib/api/types";
import { lireContenu } from "@/lib/contenu/stockage";

export const COMPETITIONS_PAR_PAGE = 6;

/**
 * Liste du back-office : brouillons compris, de la plus récente à la plus
 * ancienne. Jamais mise en cache — l'administrateur doit voir son dernier
 * enregistrement immédiatement.
 */
export async function listerCompetitions(page: number): Promise<{
  competitions: CompetitionAvecEtat[];
  total: number;
  pages: number;
  page: number;
}> {
  const fiches = await lireContenu("competitions");
  const debut = (page - 1) * COMPETITIONS_PAR_PAGE;
  const maintenant = new Date();

  return {
    competitions: [...fiches]
      .sort((a, b) => b.dateDebut.localeCompare(a.dateDebut))
      .slice(debut, debut + COMPETITIONS_PAR_PAGE)
      .map((fiche) => avecEtat(mapperCompetition(fiche), maintenant)),
    total: fiches.length,
    pages: Math.max(1, Math.ceil(fiches.length / COMPETITIONS_PAR_PAGE)),
    page,
  };
}
