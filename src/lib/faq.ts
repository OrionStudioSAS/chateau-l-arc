import type { Constantes } from "@/lib/i18n";

/**
 * Questions fréquentes, par thème. Tous les textes (titres, questions,
 * réponses, liens) sont dans constants.ts et se modifient depuis l'éditeur
 * visuel du back-office (Pages › FAQ) ; ici, seulement l'ordre des thèmes,
 * leur pictogramme et leur ancre.
 */

export type PictoTheme =
  | "drapeau"
  | "calendrier"
  | "etiquette"
  | "membres"
  | "academie"
  | "trophee"
  | "practice"
  | "couverts"
  | "salle"
  | "repere";

export type QuestionFaq = {
  question: string;
  reponse: string;
  /** Lien facultatif sous la réponse (vide : aucun). */
  lien: string;
  texteLien: string;
};

export type ThemeFaq = {
  id: string;
  titre: string;
  picto: PictoTheme;
  /** Section de constants.ts (chemins de l'éditeur visuel). */
  section: string;
  /** Nom des constantes du titre et des questions. */
  constantes: { titre: string; questions: string };
  questions: QuestionFaq[];
};

const theme = (
  id: string,
  picto: PictoTheme,
  section: string,
  prefixe: string,
  titre: string,
  questions: readonly QuestionFaq[],
): ThemeFaq => ({
  id,
  picto,
  section: `FAQ · ${section}`,
  constantes: { titre: `${prefixe}_TITRE`, questions: `${prefixe}_QUESTIONS` },
  titre,
  questions: [...questions],
});

/** Thèmes dans l'ordre d'affichage, avec les textes de la langue de la page. */
export function themesFaq(T: Constantes): ThemeFaq[] {
  return [
    theme("golf-parcours", "drapeau", "Le golf & le parcours", "FAQ_GOLF", T.FAQ_GOLF_TITRE, T.FAQ_GOLF_QUESTIONS),
    theme("reservations", "calendrier", "Réservations & départs", "FAQ_RESERVATIONS", T.FAQ_RESERVATIONS_TITRE, T.FAQ_RESERVATIONS_QUESTIONS),
    theme("tarifs", "etiquette", "Tarifs & paiement", "FAQ_TARIFS", T.FAQ_TARIFS_TITRE, T.FAQ_TARIFS_QUESTIONS),
    theme("abonnements", "membres", "Abonnements & vie de club", "FAQ_ABONNEMENTS", T.FAQ_ABONNEMENTS_TITRE, T.FAQ_ABONNEMENTS_QUESTIONS),
    theme("academie", "academie", "L'Académie : cours & stages", "FAQ_ACADEMIE", T.FAQ_ACADEMIE_TITRE, T.FAQ_ACADEMIE_QUESTIONS),
    theme("competitions", "trophee", "Compétitions", "FAQ_COMPETITIONS", T.FAQ_COMPETITIONS_TITRE, T.FAQ_COMPETITIONS_QUESTIONS),
    theme("practice", "practice", "Practice & matériel", "FAQ_PRACTICE", T.FAQ_PRACTICE_TITRE, T.FAQ_PRACTICE_QUESTIONS),
    theme("restaurant", "couverts", "Restaurant & Club House", "FAQ_RESTAURANT", T.FAQ_RESTAURANT_TITRE, T.FAQ_RESTAURANT_QUESTIONS),
    theme("seminaires", "salle", "Séminaires & réceptions", "FAQ_SEMINAIRES", T.FAQ_SEMINAIRES_TITRE, T.FAQ_SEMINAIRES_QUESTIONS),
    theme("acces", "repere", "Accès & infos pratiques", "FAQ_ACCES", T.FAQ_ACCES_TITRE, T.FAQ_ACCES_QUESTIONS),
  ];
}
