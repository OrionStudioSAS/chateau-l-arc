import type { CategorieCompetition, Competition } from "@/lib/api/types";

/**
 * Compétition telle que l'édite l'assistant du back-office : champs
 * structurés (départ, trous, catégories en étiquettes…), partagés par le
 * formulaire et l'action serveur. Les chaînes affichées sur le site public
 * (« Shotgun · 9h00 », « 18 trous »…) en sont déduites à l'enregistrement.
 */
export type BrouillonCompetition = {
  id: string | null;
  nom: string;
  dateDebut: string;
  dateFin: string;
  formule: string;
  categorie: CategorieCompetition;
  typeDepart: "shotgun" | "tee-times";
  heure: string;
  trous: "9" | "18" | "36";
  categories: string[];
  indexMaximum: string;
  sponsor: string;
  inscriptionOuverture: string;
  /** « AAAA-MM-JJTHH:mm », heure de Paris (champ datetime-local). */
  inscriptionCloture: string;
  places: string;
  inscrits: string;
  modeInscription: string;
  droitJeuMembres: string;
  droitJeuVisiteurs: string;
  inclus: string;
  ouverteVisiteurs: boolean;
  description: string;
  miseEnAvant: boolean;
  annonceBandeau: boolean;
  afficheUrl: string | null;
  reglementUrl: string | null;
};

export const FORMULES = [
  "Stableford",
  "Stroke play",
  "Scramble",
  "Match play",
  "Greensome",
  "Foursome",
  "Chapman",
  "Best ball",
];

export const SUGGESTIONS_CATEGORIES = [
  "Messieurs",
  "Dames",
  "Seniors",
  "Juniors",
  "Mixte",
  "Équipes de 2",
  "Équipes de 4",
];

export const MODES_INSCRIPTION = [
  "Formulaire sur le site",
  "À l'accueil",
  "Formulaire sur le site + à l'accueil",
];

/** Index d'ouverture à tous les joueurs. */
export const INDEX_OUVERT = "54";

/** Date ISO (avec fuseau) → « AAAA-MM-JJTHH:mm » à l'heure de Paris. */
export function versDatetimeLocal(iso?: string | null): string {
  if (!iso) return "";
  const parties = new Intl.DateTimeFormat("fr-CA", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(iso));
  const v = (type: string) => parties.find((p) => p.type === type)?.value ?? "";
  return `${v("year")}-${v("month")}-${v("day")}T${v("hour")}:${v("minute")}`;
}

export function brouillonVide(): BrouillonCompetition {
  return {
    id: null,
    nom: "",
    dateDebut: "",
    dateFin: "",
    formule: "Stableford",
    categorie: "club",
    typeDepart: "shotgun",
    heure: "9h00",
    trous: "18",
    categories: [],
    indexMaximum: INDEX_OUVERT,
    sponsor: "",
    inscriptionOuverture: "",
    inscriptionCloture: "",
    places: "",
    inscrits: "0",
    modeInscription: "Formulaire sur le site",
    droitJeuMembres: "",
    droitJeuVisiteurs: "",
    inclus: "",
    ouverteVisiteurs: true,
    description: "",
    miseEnAvant: true,
    annonceBandeau: false,
    afficheUrl: null,
    reglementUrl: null,
  };
}

/** Lit une compétition enregistrée (chaînes libres comprises) dans l'assistant. */
export function versBrouillon(competition: Competition): BrouillonCompetition {
  const depart = competition.depart ?? "";
  const heure = depart.match(/(\d{1,2})\s*h\s*(\d{2})?/i);
  const trous = competition.trous?.match(/\d+/)?.[0];
  const index = competition.indexMaximum?.match(/\d+/)?.[0];

  return {
    ...brouillonVide(),
    id: competition.id,
    nom: competition.nom,
    dateDebut: competition.dateDebut,
    dateFin: competition.dateFin ?? "",
    formule: competition.formule === "À préciser" ? "" : competition.formule,
    categorie: competition.categorie,
    typeDepart: /shotgun/i.test(depart) ? "shotgun" : "tee-times",
    heure: heure ? `${heure[1]}h${heure[2] ?? "00"}` : "",
    trous: trous === "9" || trous === "36" ? trous : "18",
    categories: (competition.categories ?? "")
      .split(/\s*[·,]\s*/)
      .map((c) => c.trim())
      .filter(Boolean),
    indexMaximum: index ?? INDEX_OUVERT,
    sponsor: competition.sponsor ?? "",
    inscriptionOuverture: competition.inscriptionOuverture ?? "",
    inscriptionCloture: versDatetimeLocal(competition.inscriptionCloture),
    places: competition.places ? String(competition.places) : "",
    inscrits: String(competition.inscrits ?? 0),
    modeInscription: competition.modeInscription ?? "",
    droitJeuMembres: competition.droitJeuMembres ?? "",
    droitJeuVisiteurs: competition.droitJeuVisiteurs ?? "",
    inclus: competition.inclus ?? "",
    ouverteVisiteurs: competition.ouverteVisiteurs,
    description: competition.description ?? "",
    miseEnAvant: competition.miseEnAvant ?? true,
    annonceBandeau: competition.annonceBandeau ?? false,
    afficheUrl: competition.afficheUrl ?? null,
    reglementUrl: competition.reglementUrl ?? null,
  };
}

/** Chaînes affichées sur le site, déduites des champs structurés. */
export function libellesPublics(b: BrouillonCompetition) {
  const heure = b.heure.trim();
  return {
    depart:
      b.typeDepart === "shotgun"
        ? ["Shotgun", heure].filter(Boolean).join(" · ")
        : heure
          ? `Départs à partir de ${heure}`
          : "Tee-times",
    trous: `${b.trous} trous`,
    indexMaximum:
      b.indexMaximum === INDEX_OUVERT ? "54 (ouvert à tous)" : b.indexMaximum ? `Index < ${b.indexMaximum}` : null,
    categories: b.categories.length ? b.categories.join(" · ") : null,
  };
}

/** Champs manquants pour publier (l'enregistrement en brouillon n'en exige que le nom). */
export function manquantsPourPublier(b: BrouillonCompetition): string[] {
  return [
    !b.nom.trim() && "le nom",
    !b.dateDebut && "la date",
    !b.formule.trim() && "la formule",
  ].filter((x): x is string => Boolean(x));
}
