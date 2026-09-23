/** Constantes et types partagés entre le formulaire d'admin et son action serveur. */
export const LONGUEUR_MAX_BANDEAU = 160;

export type EtatBandeau =
  | { statut: "vide" }
  | { statut: "succes"; message: string }
  | { statut: "erreur"; message: string };
