/**
 * Autres dates du calendrier des compétitions : entretien du parcours (tonte,
 * carottage…), fermetures, animations. Saisies dans le back-office
 * (Compétitions › Ajouter au calendrier), enregistrées dans
 * contenu/evenements.json. Module partagé serveur / navigateur.
 */

export type TypeEvenement = "entretien" | "fermeture" | "animation" | "autre";

export type EvenementCalendrier = {
  id: string;
  titre: string;
  type: TypeEvenement;
  /** AAAA-MM-JJ */
  dateDebut: string;
  /** AAAA-MM-JJ, null pour une seule journée. */
  dateFin: string | null;
  /** Texte libre : « 7h – 11h », « Matinée »… */
  horaires: string | null;
  description: string | null;
  /** Affiché sur le site ; sinon, seulement dans le calendrier du back-office. */
  public: boolean;
};

export const typesEvenement: Record<TypeEvenement, { libelle: string; exemple: string }> = {
  entretien: { libelle: "Entretien du parcours", exemple: "Tonte, carottage, sablage des greens…" },
  fermeture: { libelle: "Fermeture", exemple: "Parcours, practice ou restaurant fermé" },
  animation: { libelle: "Animation", exemple: "Soirée, journée portes ouvertes, initiation…" },
  autre: { libelle: "Autre", exemple: "Toute autre date à signaler" },
};

export const LONGUEUR_MAX_TITRE_EVENEMENT = 80;
export const LONGUEUR_MAX_DESCRIPTION_EVENEMENT = 300;

export const finEvenement = (e: Pick<EvenementCalendrier, "dateDebut" | "dateFin">) => e.dateFin ?? e.dateDebut;

/** Vrai si l'événement couvre ce jour (AAAA-MM-JJ). */
export const couvre = (e: Pick<EvenementCalendrier, "dateDebut" | "dateFin">, jour: string) =>
  e.dateDebut <= jour && finEvenement(e) >= jour;
