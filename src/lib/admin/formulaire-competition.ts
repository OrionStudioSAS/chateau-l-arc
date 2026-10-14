/** Constantes et types partagés entre le formulaire de compétition et son action. */
export type EtatCompetitionFormulaire =
  | { statut: "vide" }
  | { statut: "succes"; message: string }
  | { statut: "erreur"; message: string };

/** Transforme un nom en identifiant d'URL. */
export function slugifier(valeur: string): string {
  return valeur
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export type EtatResultats =
  | { statut: "vide" }
  | { statut: "succes"; message: string }
  | { statut: "erreur"; message: string };

/**
 * Les résultats sont publiés en PDF ; 4 Mo couvrent largement un classement.
 * Plafond imposé par Vercel : 4,5 Mo par requête, formulaire compris.
 */
export const TAILLE_MAX_RESULTATS = 4 * 1024 * 1024;
