import type {
  Competition,
  CompetitionAvecEtat,
  EtatCompetition,
} from "@/lib/api/types";

/** Ligne de la table `competitions` telle que renvoyée par Supabase. */
export type LigneCompetition = {
  id: string;
  slug: string;
  nom: string;
  date_debut: string;
  date_fin: string | null;
  formule: string;
  depart: string;
  trous: string;
  index_maximum: string | null;
  categories: string | null;
  sponsor: string | null;
  inscription_ouverture: string | null;
  inscription_cloture: string | null;
  places: number | null;
  inscrits: number;
  mode_inscription: string | null;
  droit_jeu_membres: string | null;
  droit_jeu_visiteurs: string | null;
  inclus: string | null;
  description: string | null;
  affiche_url: string | null;
  categorie: "club" | "grand-prix" | "sponsorisee" | "loisir";
  statut: "brouillon" | "publie";
  resultats_url: string | null;
  resultats_publies: boolean;
};

const sansNull = <T,>(valeur: T | null): T | undefined => valeur ?? undefined;

export function mapperCompetition(ligne: LigneCompetition): Competition {
  return {
    id: ligne.id,
    slug: ligne.slug,
    nom: ligne.nom,
    dateDebut: ligne.date_debut,
    dateFin: sansNull(ligne.date_fin),
    formule: ligne.formule,
    depart: ligne.depart,
    trous: ligne.trous,
    indexMaximum: sansNull(ligne.index_maximum),
    categories: sansNull(ligne.categories),
    sponsor: sansNull(ligne.sponsor),
    inscriptionOuverture: sansNull(ligne.inscription_ouverture),
    inscriptionCloture: sansNull(ligne.inscription_cloture),
    places: sansNull(ligne.places),
    inscrits: ligne.inscrits,
    modeInscription: sansNull(ligne.mode_inscription),
    droitJeuMembres: sansNull(ligne.droit_jeu_membres),
    droitJeuVisiteurs: sansNull(ligne.droit_jeu_visiteurs),
    inclus: sansNull(ligne.inclus),
    description: sansNull(ligne.description),
    afficheUrl: sansNull(ligne.affiche_url),
    categorie: ligne.categorie,
    statut: ligne.statut,
    resultatsUrl: sansNull(ligne.resultats_url),
    resultatsPublies: ligne.resultats_publies,
  };
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

/** Classes des pastilles d'état, partagées par le site public et le back-office. */
export const tonsPastille: Record<EtatCompetition["ton"], string> = {
  vert: "bg-club-600/15 text-club-800",
  ambre: "bg-amber-500/15 text-amber-800",
  neutre: "bg-encre/[0.06] text-gris-500",
};
