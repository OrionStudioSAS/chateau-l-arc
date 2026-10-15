/**
 * Grille tarifaire du club. Les prix vivent dans contenu/tarifs.json, modifiés
 * depuis le back-office (rubrique « Tarifs ») et lus par getGrilleTarifs()
 * (lib/api/content) : un prix changé est à jour partout sur le site.
 */

export type CleSaison = "haute" | "basse";

/** Une ligne de prix (TTC, en euros). */
export type LigneTarif = { id: string; libelle: string; detail: string | null; prix: number };

export type GreenFee = LigneTarif & { saison: CleSaison | null; miseEnAvant: boolean };
export type Carnet = LigneTarif & { parties: number };
/** `prix` : visiteurs ; `membres` : prix membre, ou null s'il n'y en a pas. */
export type Location = LigneTarif & { membres: number | null; groupe: "location" | "practice" };
export type Abonnement = LigneTarif & { miseEnAvant: boolean };

export type GrilleTarifs = {
  /** Bornes de la haute saison, « MM-JJ » ; la basse saison couvre le reste de l'année. */
  saisons: { hauteDebut: string; hauteFin: string };
  /** Remise en paiement comptant (0,05 = 5 %) et sa date limite, « JJ/MM ». */
  remiseComptant: { taux: number; jusquau: string };
  greenFees: GreenFee[];
  carnets: Carnet[];
  locations: Location[];
  abonnements: Abonnement[];
};

const versJJMM = (mmjj: string) => mmjj.split("-").reverse().join("/");

/** « MM-JJ » décalé d'un jour (bornes de la basse saison). */
function decaler(mmjj: string, jours: number): string {
  const [m, j] = mmjj.split("-").map(Number);
  const date = new Date(Date.UTC(2001, m - 1, j + jours));
  return `${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
}

const jourMois = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", timeZone: "UTC" });
const enLettres = (mmjj: string) => {
  const [m, j] = mmjj.split("-").map(Number);
  return jourMois.format(new Date(Date.UTC(2001, m - 1, j))).replace(/^1 /, "1er ");
};

/** Libellés des saisons, au format affiché sur le site. */
export function saisonsDe(grille: GrilleTarifs) {
  const { hauteDebut, hauteFin } = grille.saisons;
  const basseDebut = decaler(hauteFin, 1);
  const basseFin = decaler(hauteDebut, -1);
  return {
    haute: {
      libelle: "Haute saison",
      periode: `${versJJMM(hauteDebut)} – ${versJJMM(hauteFin)}`,
      detail: `Du ${enLettres(hauteDebut)} au ${enLettres(hauteFin)}.`,
    },
    basse: {
      libelle: "Basse saison",
      periode: `${versJJMM(basseDebut)} – ${versJJMM(basseFin)}`,
      detail: `Du ${enLettres(basseDebut)} au ${enLettres(basseFin)}.`,
    },
  } as const;
}

export type Saisons = ReturnType<typeof saisonsDe>;

/** Saison d'une date (heure de Paris). */
export function saisonDu(date: Date, saisons: GrilleTarifs["saisons"]): CleSaison {
  const mmjj = new Intl.DateTimeFormat("fr-CA", { month: "2-digit", day: "2-digit", timeZone: "Europe/Paris" })
    .format(date)
    .replace("/", "-");
  return mmjj >= saisons.hauteDebut && mmjj <= saisons.hauteFin ? "haute" : "basse";
}

/** Prix d'une partie dans un carnet, arrondi à l'euro. */
export const parPartie = (carnet: Carnet) => Math.round(carnet.prix / Math.max(1, carnet.parties));

/** TODO : liste reprise de la maquette, à valider avec le club. */
/**
 * TODO : questions de la maquette ; réponses provisoires, rédigées pour ne
 * rien promettre, à remplacer par celles du club.
 */
export const questionsTarifs = [
  {
    question: "Peut-on régler l'abonnement en plusieurs fois ?",
    reponse:
      "Contactez l'accueil pour connaître les modalités de paiement. Une remise de 5 % s'applique en paiement comptant jusqu'au 31 décembre.",
  },
  {
    question: "Faut-il un index ou une carte verte pour jouer ?",
    reponse:
      "Une carte verte ou un index est demandé pour jouer le parcours. En cas de doute, l'accueil vous renseigne avant votre venue.",
  },
  {
    question: "Les tarifs basse saison s'appliquent-ils automatiquement ?",
    reponse:
      "Le tarif 9 trous basse saison (45 €) correspond aux départs entre le 15 novembre et le 15 avril. L'accueil vous confirme le tarif lors de votre réservation.",
  },
  {
    question: "Peut-on offrir un green fee ou un carnet ?",
    reponse: "Contactez l'accueil du club pour toute demande de cadeau.",
  },
];

const prixFormatter = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });

/** « 2 280 € » : espace insécable fine des milliers, euro séparé. */
export function euros(montant: number): string {
  return `${prixFormatter.format(montant)} €`;
}
