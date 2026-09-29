/** Constantes et types partagés entre le formulaire de pop-up et son action. */
export type EtatPopup =
  | { statut: "vide" }
  | { statut: "succes"; message: string }
  | { statut: "erreur"; message: string };

export const TAILLE_MAX_AFFICHE = 5 * 1024 * 1024;
export const TYPES_AFFICHE = ["image/jpeg", "image/png", "image/webp"];

/**
 * Le lien du bouton est rendu tel quel dans un `href` du site public : seuls
 * les chemins internes, le web, le téléphone et l'e-mail sont acceptés, ce qui
 * écarte notamment `javascript:`.
 */
export function lienAutorise(lien: string): boolean {
  return /^(\/(?!\/)|https?:\/\/|tel:|mailto:)/i.test(lien);
}
