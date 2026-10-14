import type {
  CategorieCompetition,
  Competition,
  CompetitionAvecEtat,
  EtatCompetition,
} from "@/lib/api/types";
import type { FicheCompetition } from "@/lib/contenu/stockage";

const sansNull = <T,>(valeur: T | null): T | undefined => valeur ?? undefined;

/** Fiche de `contenu/competitions.json` → objet du site (null → undefined). */
export function mapperCompetition(fiche: FicheCompetition): Competition {
  return Object.fromEntries(
    Object.entries(fiche).map(([cle, valeur]) => [cle, sansNull(valeur)]),
  ) as Competition;
}

const jourMois = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  timeZone: "Europe/Paris",
});

/**
 * État d'une compétition, déduit de sa fenêtre d'inscription :
 * avant l'ouverture → « Être prévenu », pendant → « S'inscrire »,
 * après la clôture → « Terminé ».
 *
 * `maintenant` est passé explicitement : la fonction reste déterministe et
 * peut donc être appelée dans un scope « use cache ».
 */
export function etatCompetition(
  competition: Competition,
  maintenant: Date,
): EtatCompetition {
  if (
    competition.inscriptionOuverture &&
    new Date(competition.inscriptionOuverture) > maintenant
  ) {
    return {
      cle: "a-venir",
      libelle: `Ouverture le ${jourMois.format(new Date(competition.inscriptionOuverture))}`,
      ton: "ambre",
      action: "Être prévenu",
    };
  }

  const cloture = competition.inscriptionCloture
    ? new Date(competition.inscriptionCloture)
    : // Sans clôture renseignée, c'est la compétition elle-même qui fait foi :
      // elle se termine à la fin de sa dernière journée.
      (() => {
        const fin = new Date(competition.dateFin ?? competition.dateDebut);
        fin.setHours(23, 59, 59, 999);
        return fin;
      })();

  if (cloture < maintenant) {
    return { cle: "terminee", libelle: "Terminé", ton: "neutre", action: "Terminé" };
  }

  return {
    cle: "ouverte",
    libelle: "Inscriptions ouvertes",
    ton: "vert",
    action: "S'inscrire",
  };
}

export function avecEtat(
  competition: Competition,
  maintenant: Date,
): CompetitionAvecEtat {
  return { ...competition, etat: etatCompetition(competition, maintenant) };
}

/** Libellés des catégories (filtres, étiquettes, back-office). */
export const libellesCategorie: Record<CategorieCompetition, string> = {
  club: "Club",
  "grand-prix": "Grand Prix",
  seniors: "Seniors",
};

/** Classes des pastilles d'état, partagées par le site public et le back-office. */
export const tonsPastille: Record<EtatCompetition["ton"], string> = {
  vert: "bg-club-600/15 text-club-800",
  ambre: "bg-amber-500/15 text-amber-800",
  neutre: "bg-encre/[0.06] text-gris-500",
};
