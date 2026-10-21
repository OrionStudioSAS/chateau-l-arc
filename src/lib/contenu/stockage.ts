import "server-only";

import competitionsEmbarquees from "@contenu/competitions.json";
import evenementsEmbarques from "@contenu/evenements.json";
import popupEmbarquee from "@contenu/popup.json";
import statutEmbarque from "@contenu/statut.json";
import tarifsEmbarques from "@contenu/tarifs.json";

import type { CategorieCompetition, Installation, StatutCompetition } from "@/lib/api/types";
import type { EvenementCalendrier } from "@/lib/evenements";
import type { GrilleTarifs } from "@/lib/tarifs";
import { depotConfigure, lireTexte } from "@/lib/contenu/depot";

/**
 * Forme des fichiers JSON de `contenu/`, tels qu'écrits par le back-office.
 * Les champs vides sont enregistrés à `null` (JSON n'a pas d'`undefined`).
 */
export type FichierStatut = {
  bandeau: {
    actif: boolean;
    message: string;
    lien: { label: string; href: string } | null;
    publieLe: string | null;
  };
  installations: Installation[];
};

export type FichierPopup = {
  actif: boolean;
  titre: string;
  texte: string;
  boutonLibelle: string | null;
  boutonLien: string | null;
  debut: string | null;
  fin: string | null;
  afficheUrl: string | null;
  version: string;
};

export type FicheCompetition = {
  id: string;
  slug: string;
  nom: string;
  dateDebut: string;
  dateFin: string | null;
  formule: string;
  depart: string;
  trous: string;
  indexMaximum: string | null;
  categories: string | null;
  sponsor: string | null;
  inscriptionOuverture: string | null;
  inscriptionCloture: string | null;
  places: number | null;
  inscrits: number;
  modeInscription: string | null;
  droitJeuMembres: string | null;
  droitJeuVisiteurs: string | null;
  inclus: string | null;
  description: string | null;
  afficheUrl: string | null;
  categorie: CategorieCompetition;
  ouverteVisiteurs: boolean;
  vainqueurs: string | null;
  statut: StatutCompetition;
  resultatsUrl: string | null;
  resultatsPublies: boolean;
  reglementUrl?: string | null;
  miseEnAvant?: boolean;
  annonceBandeau?: boolean;
};

type Fichiers = {
  statut: FichierStatut;
  popup: FichierPopup;
  competitions: FicheCompetition[];
  evenements: EvenementCalendrier[];
  tarifs: GrilleTarifs;
};

export type CleContenu = keyof Fichiers;

/** Emplacement de chaque fichier dans le dépôt. */
export const cheminsContenu: Record<CleContenu, string> = {
  statut: "contenu/statut.json",
  popup: "contenu/popup.json",
  competitions: "contenu/competitions.json",
  evenements: "contenu/evenements.json",
  tarifs: "contenu/tarifs.json",
};

/** Dossier des fichiers déposés (PDF, affiches), servis par /fichiers/… */
export const DOSSIER_FICHIERS = "contenu/fichiers";

/** Version embarquée au build : secours si GitHub est injoignable. */
const embarques: Fichiers = {
  statut: statutEmbarque as FichierStatut,
  popup: popupEmbarquee as FichierPopup,
  competitions: competitionsEmbarquees as FicheCompetition[],
  evenements: evenementsEmbarques as EvenementCalendrier[],
  tarifs: tarifsEmbarques as GrilleTarifs,
};

/**
 * Dernière version publiée d'un fichier de contenu, lue sur GitHub. Sans jeton
 * ou en cas d'échec, la copie embarquée au build prend le relais : le site
 * reste en ligne, avec le contenu du dernier déploiement.
 */
export async function lireContenu<C extends CleContenu>(cle: C): Promise<Fichiers[C]> {
  if (!depotConfigure()) return embarques[cle];

  try {
    const texte = await lireTexte(cheminsContenu[cle]);
    if (texte !== null) return JSON.parse(texte) as Fichiers[C];
    console.error(`Contenu « ${cle} » absent du dépôt : copie embarquée utilisée.`);
  } catch (erreur) {
    console.error(`Lecture du contenu « ${cle} » sur GitHub impossible`, erreur);
  }
  return embarques[cle];
}

/** Même lecture, au sein d'un commit (cf. `commiter`) : version figée du dépôt. */
export async function lireDans<C extends CleContenu>(
  lire: (chemin: string) => Promise<string | null>,
  cle: C,
): Promise<Fichiers[C]> {
  const texte = await lire(cheminsContenu[cle]);
  return texte === null ? embarques[cle] : (JSON.parse(texte) as Fichiers[C]);
}

/** Sérialisation stable, lisible dans les diffs GitHub. */
export const versJson = (valeur: unknown) => `${JSON.stringify(valeur, null, 2)}\n`;
