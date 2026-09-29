/**
 * Contrats de données du site.
 * Ils décrivent ce que le front attend ; l'API (à définir) devra s'y conformer,
 * ou bien un adaptateur sera ajouté dans src/lib/api/ pour mapper sa réponse.
 */

export type Image = {
  url: string;
  alt: string;
  width?: number;
  height?: number;
};

export type Article = {
  slug: string;
  titre: string;
  chapo: string;
  contenuHtml: string;
  publieLe: string; // ISO 8601
  categorie?: string;
  image?: Image;
};

export type StatutCompetition = "brouillon" | "publie";

export type CategorieCompetition = "club" | "grand-prix" | "sponsorisee" | "loisir";

/** Compétition du club, telle que saisie dans le back-office. */
export type Competition = {
  id: string;
  slug: string;
  nom: string;
  dateDebut: string; // ISO (date)
  dateFin?: string;
  formule: string;
  depart: string;
  trous: string;
  indexMaximum?: string;
  categories?: string;
  sponsor?: string;
  inscriptionOuverture?: string;
  inscriptionCloture?: string;
  places?: number;
  inscrits: number;
  modeInscription?: string;
  droitJeuMembres?: string;
  droitJeuVisiteurs?: string;
  inclus?: string;
  description?: string;
  afficheUrl?: string;
  categorie: CategorieCompetition;
  statut: StatutCompetition;
  resultatsUrl?: string;
  resultatsPublies: boolean;
};

/** État dérivé des dates, calculé côté serveur pour rester déterministe. */
/**
 * État d'inscription, déduit de la fenêtre d'inscription :
 * avant l'ouverture, pendant, puis après la clôture.
 */
export type EtatCompetition = {
  cle: "a-venir" | "ouverte" | "terminee";
  libelle: string;
  ton: "vert" | "ambre" | "neutre";
  action: string;
};

export type CompetitionAvecEtat = Competition & { etat: EtatCompetition };

export type Tarif = {
  id: string;
  libelle: string;
  detail?: string;
  prix: number; // en euros
  unite?: string; // ex. « / personne », « / an »
  categorie: "green-fee" | "abonnement" | "academie" | "location";
};

export type Trou = {
  numero: number;
  par: number;
  longueurs: { serie: string; metres: number }[];
  description?: string;
  image?: Image;
};

/**
 * Bandeau d'information affiché en haut du site public.
 * Édité depuis le back-office (/admin) ; le champ libre `message` est le seul
 * modifiable pour l'instant, le reste viendra avec l'API.
 */
export type Bandeau = {
  actif: boolean;
  message: string;
  lien?: { label: string; href: string };
  publieLe?: string; // ISO 8601
};

/**
 * Carte du bloc « Green fees » de l'accueil.
 * `prix` est une chaîne déjà formatée (« 85€ », « dès 45€ ») : les cartes
 * mélangent montants fermes et tarifs d'appel, et c'est le club qui rédige.
 */
export type FormuleAccueil = {
  id: string;
  titre: string;
  prix: string;
  detail: string;
};

/** Une installation du domaine et son état, pour le menu « Informations sur le parcours ». */
export type Installation = {
  cle: string;
  libelle: string;
  groupe: number;
  type: "ouverture" | "autorisation";
  feminin: boolean;
  actif: boolean;
};

/** Pop-up marketing (une seule à la fois). `version` change à chaque publication. */
export type Popup = {
  actif: boolean;
  titre: string;
  texte: string;
  boutonLibelle?: string;
  boutonLien?: string;
  debut?: string; // AAAA-MM-JJ
  fin?: string; // AAAA-MM-JJ
  afficheUrl?: string;
  version: string;
};
