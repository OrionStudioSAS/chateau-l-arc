/** Constantes et règles partagées par l'écran du bandeau, son action et le site. */

/** Une seule ligne sur ordinateur. */
export const LONGUEUR_MAX_BANDEAU = 90;
export const LONGUEUR_MAX_BOUTON_BANDEAU = 24;

/**
 * Compétition visée par le lien du bouton (« /competitions/grand-prix »),
 * ou null. Un bandeau qui renvoie vers une compétition s'efface tout seul
 * une fois l'épreuve passée.
 */
export function slugCompetitionLiee(href: string | null | undefined): string | null {
  const slug = href?.match(/^\/competitions\/([a-z0-9-]+)\/?$/)?.[1];
  return slug && slug !== "resultats" ? slug : null;
}

/** Dernier jour de l'épreuve, au format AAAA-MM-JJ. */
export const dernierJour = (competition: { dateDebut: string; dateFin?: string | null }) =>
  (competition.dateFin ?? competition.dateDebut).slice(0, 10);
