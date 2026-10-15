import "server-only";

import { avecEtat, mapperCompetition } from "@/lib/competitions";
import type { CompetitionAvecEtat } from "@/lib/api/types";
import { lireContenu } from "@/lib/contenu/stockage";

/**
 * Toutes les compétitions, brouillons compris, par date. Jamais mise en
 * cache : l'administrateur doit voir son dernier enregistrement aussitôt.
 */
export async function listerCompetitions(): Promise<{
  competitions: CompetitionAvecEtat[];
  /** Instant de la lecture (ms) et jour correspondant à Paris, pour les états. */
  maintenant: number;
  aujourdhui: string;
}> {
  const fiches = await lireContenu("competitions");
  const maintenant = new Date();
  return {
    competitions: fiches
      .map((fiche) => avecEtat(mapperCompetition(fiche), maintenant))
      .sort((a, b) => a.dateDebut.localeCompare(b.dateDebut)),
    maintenant: maintenant.getTime(),
    aujourdhui: new Intl.DateTimeFormat("fr-CA", { timeZone: "Europe/Paris" }).format(maintenant),
  };
}
