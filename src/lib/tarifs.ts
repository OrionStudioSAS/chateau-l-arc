/**
 * Grille tarifaire du club (page Tarifs & abonnements).
 *
 * TODO : relevée sur la maquette — à faire valider ligne par ligne par le
 * club, puis à basculer dans Supabase pour que l'accueil la tienne à jour
 * depuis le back-office (la bannière l'annonce déjà aux visiteurs).
 */

/** Saisons de jeu, au format affiché dans la bannière. */
export const saisons = {
  haute: { libelle: "Haute saison", periode: "16/04 – 14/11", detail: "Du 16 avril au 14 novembre." },
  basse: { libelle: "Basse saison", periode: "15/11 – 15/04", detail: "Du 15 novembre au 15 avril." },
} as const;

export type CleSaison = keyof typeof saisons;

/** Saison d'une date (heure de Paris), d'après les bornes ci-dessus. */
export function saisonDu(date: Date): CleSaison {
  const [mois, jour] = new Intl.DateTimeFormat("fr-CA", {
    month: "2-digit",
    day: "2-digit",
    timeZone: "Europe/Paris",
  })
    .format(date)
    .split("-")
    .map(Number);
  const jourDeLAnnee = mois * 100 + jour;
  return jourDeLAnnee >= 416 && jourDeLAnnee <= 1114 ? "haute" : "basse";
}

export const greenFees: {
  libelle: string;
  prix: number;
  detail: string;
  saison?: CleSaison;
  miseEnAvant?: boolean;
}[] = [
  { libelle: "18 trous", prix: 85, detail: "Toute l'année, réservation en ligne.", miseEnAvant: true },
  { libelle: "9 trous · haute saison", prix: 55, detail: saisons.haute.detail, saison: "haute" },
  { libelle: "9 trous · basse saison", prix: 45, detail: saisons.basse.detail, saison: "basse" },
];

export const carnets = [
  { titre: "6 parcours 18 trous", offre: "5 achetés + 1 offert", parPartie: 58, prix: 350 },
  { titre: "12 parcours 18 trous", offre: "10 achetés + 2 offerts", parPartie: 58, prix: 700 },
  { titre: "12 parcours 9 trous", offre: "10 achetés + 2 offerts", parPartie: 38, prix: 450 },
];

/** Prix visiteurs et membres ; `null` : pas de tarif membre. */
export type LigneLocation = { libelle: string; visiteurs: number; membres: number | null };

export const locations: LigneLocation[] = [
  { libelle: "Voiturette 18 trous", visiteurs: 40, membres: 28 },
  { libelle: "Voiturette 9 trous", visiteurs: 33, membres: 25 },
  { libelle: "Chariot manuel", visiteurs: 5, membres: null },
  { libelle: "Série complète (location)", visiteurs: 40, membres: null },
];

export const practice: LigneLocation[] = [
  { libelle: "1 seau de balles", visiteurs: 4, membres: 3 },
  { libelle: "5 seaux", visiteurs: 18, membres: 12 },
  { libelle: "10 seaux", visiteurs: 34, membres: 22 },
  { libelle: "25 seaux", visiteurs: 75, membres: 50 },
];

/** Remise accordée en paiement comptant, et sa date limite. */
export const remiseComptant = { taux: 0.05, jusquau: "31/12" };

export const abonnements: { titre: string; prix: number; miseEnAvant?: boolean }[] = [
  { titre: "Individuel", prix: 2280, miseEnAvant: true },
  { titre: "Couple", prix: 3732 },
  { titre: "Famille (2 adultes)", prix: 3732 },
  { titre: "Individuel −35 ans", prix: 1560 },
  { titre: "Couple −35 ans", prix: 2748 },
  { titre: "−25 ans & étudiants", prix: 984 },
  { titre: "−15 ans", prix: 540 },
  { titre: "Individuel +80 ans", prix: 2052 },
  { titre: "Couple +80 ans", prix: 3300 },
];

/** TODO : liste reprise de la maquette, à valider avec le club. */
export const avantagesMembres = [
  "Accès illimité au parcours 18 trous",
  "Compétitions et vie de l'association sportive",
  "Tarifs membres sur les voiturettes et le practice",
  "Réservation prioritaire des départs",
  "Accès au club-house et aux événements du club",
];

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
