import {
  FAQ_ABONNEMENTS_QUESTIONS,
  FAQ_ABONNEMENTS_TITRE,
  FAQ_ACADEMIE_QUESTIONS,
  FAQ_ACADEMIE_TITRE,
  FAQ_ACCES_QUESTIONS,
  FAQ_ACCES_TITRE,
  FAQ_COMPETITIONS_QUESTIONS,
  FAQ_COMPETITIONS_TITRE,
  FAQ_GOLF_QUESTIONS,
  FAQ_GOLF_TITRE,
  FAQ_PRACTICE_QUESTIONS,
  FAQ_PRACTICE_TITRE,
  FAQ_RESERVATIONS_QUESTIONS,
  FAQ_RESERVATIONS_TITRE,
  FAQ_RESTAURANT_QUESTIONS,
  FAQ_RESTAURANT_TITRE,
  FAQ_SEMINAIRES_QUESTIONS,
  FAQ_SEMINAIRES_TITRE,
  FAQ_TARIFS_QUESTIONS,
  FAQ_TARIFS_TITRE,
} from "@/constants";

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

/** Thèmes dans l'ordre d'affichage. */
export const themesFaq: ThemeFaq[] = [
  theme("golf-parcours", "drapeau", "Le golf & le parcours", "FAQ_GOLF", FAQ_GOLF_TITRE, FAQ_GOLF_QUESTIONS),
  theme("reservations", "calendrier", "Réservations & départs", "FAQ_RESERVATIONS", FAQ_RESERVATIONS_TITRE, FAQ_RESERVATIONS_QUESTIONS),
  theme("tarifs", "etiquette", "Tarifs & paiement", "FAQ_TARIFS", FAQ_TARIFS_TITRE, FAQ_TARIFS_QUESTIONS),
  theme("abonnements", "membres", "Abonnements & vie de club", "FAQ_ABONNEMENTS", FAQ_ABONNEMENTS_TITRE, FAQ_ABONNEMENTS_QUESTIONS),
  theme("academie", "academie", "L'Académie : cours & stages", "FAQ_ACADEMIE", FAQ_ACADEMIE_TITRE, FAQ_ACADEMIE_QUESTIONS),
  theme("competitions", "trophee", "Compétitions", "FAQ_COMPETITIONS", FAQ_COMPETITIONS_TITRE, FAQ_COMPETITIONS_QUESTIONS),
  theme("practice", "practice", "Practice & matériel", "FAQ_PRACTICE", FAQ_PRACTICE_TITRE, FAQ_PRACTICE_QUESTIONS),
  theme("restaurant", "couverts", "Restaurant & Club House", "FAQ_RESTAURANT", FAQ_RESTAURANT_TITRE, FAQ_RESTAURANT_QUESTIONS),
  theme("seminaires", "salle", "Séminaires & réceptions", "FAQ_SEMINAIRES", FAQ_SEMINAIRES_TITRE, FAQ_SEMINAIRES_QUESTIONS),
  theme("acces", "repere", "Accès & infos pratiques", "FAQ_ACCES", FAQ_ACCES_TITRE, FAQ_ACCES_QUESTIONS),
];
