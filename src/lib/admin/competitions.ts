import "server-only";

import { avecEtat, mapperCompetition, type LigneCompetition } from "@/lib/competitions";
import type { CompetitionAvecEtat } from "@/lib/api/types";
import { creerClientServeur } from "@/lib/supabase/server";

export const COMPETITIONS_PAR_PAGE = 6;

const COLONNES =
  "id, slug, nom, date_debut, date_fin, formule, depart, trous, index_maximum, categories, sponsor, inscription_ouverture, inscription_cloture, places, inscrits, mode_inscription, droit_jeu_membres, droit_jeu_visiteurs, inclus, description, affiche_url, statut, resultats_url, resultats_publies";

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
  const supabase = await creerClientServeur();
  const debut = (page - 1) * COMPETITIONS_PAR_PAGE;

  const { data, error, count } = await supabase
    .from("competitions")
    .select(COLONNES, { count: "exact" })
    .order("date_debut", { ascending: false })
    .range(debut, debut + COMPETITIONS_PAR_PAGE - 1);

  if (error || !data) {
    console.error("Lecture des compétitions (admin) impossible", error);
    return { competitions: [], total: 0, pages: 1, page };
  }

  const maintenant = new Date();
  const total = count ?? data.length;

  return {
    competitions: (data as LigneCompetition[]).map((ligne) =>
      avecEtat(mapperCompetition(ligne), maintenant),
    ),
    total,
    pages: Math.max(1, Math.ceil(total / COMPETITIONS_PAR_PAGE)),
    page,
  };
}
