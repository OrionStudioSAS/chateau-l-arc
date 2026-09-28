/**
 * Grille tarifaire du club.
 *
 * TODO : relevée sur la maquette — à faire valider ligne par ligne par le
 * club avant mise en ligne, puis à basculer dans Supabase si le club doit
 * pouvoir la modifier lui-même.
 */

export const greenFees = [
  {
    titre: "18 trous",
    prix: "85€",
    precision: "Toute l'année",
    miseEnAvant: true,
  },
  {
    titre: "9 trous · haute saison",
    prix: "55€",
    precision: "Du 16 avril au 14 novembre",
  },
  {
    titre: "9 trous · basse saison",
    prix: "45€",
    precision: "Du 15 novembre au 15 avril",
  },
];

export const carnets = [
  { parcours: "18 trous", offre: "5 achetés = 6", prix: "350€", unitaire: "Soit 58€ le green fee" },
  { parcours: "18 trous", offre: "10 achetés = 12", prix: "700€", unitaire: "Soit 58€ le green fee" },
  { parcours: "9 trous", offre: "10 achetés = 12", prix: "450€", unitaire: "Soit 37€ le green fee" },
];

export const surPlace = [
  {
    titre: "Voiturettes",
    lignes: [
      { libelle: "18 trous", prix: "40€" },
      { libelle: "9 trous", prix: "33€" },
      { libelle: "Carnet 5×18 trous = 6", prix: "200€" },
      { libelle: "Carnet 10×18 trous = 12", prix: "400€" },
      { libelle: "Chariot manuel", prix: "5€" },
    ],
  },
  {
    titre: "Practice",
    lignes: [
      { libelle: "1 seau de balles", prix: "4€" },
      { libelle: "1 seau (avec green fee)", prix: "3€" },
      { libelle: "5 seaux", prix: "18€" },
      { libelle: "10 seaux", prix: "34€" },
      { libelle: "25 seaux", prix: "75€" },
    ],
  },
  {
    titre: "Matériel",
    lignes: [
      { libelle: "Location 1 club", prix: "3€" },
      { libelle: "Série complète", prix: "40€" },
    ],
  },
];

export const abonnements = [
  { titre: "Individuel", prix: "2 280€" },
  { titre: "Couple", prix: "3 732€" },
  { titre: "Individuel · -35 ans", prix: "1 560€", miseEnAvant: true, etiquette: "Le plus choisi" },
  { titre: "Couple · -35 ans", prix: "2 748€" },
  { titre: "-25 ans & étudiants", prix: "984€" },
  { titre: "-15 ans", prix: "540€", precision: "Gratuit pour les enfants d'abonnés couples" },
  { titre: "Individuel · +80 ans", prix: "2 052€" },
  { titre: "Couple · +80 ans", prix: "3 300€" },
];

export const noteAbonnements =
  "Famille (2 adultes hors couple) : 3 732€ · Famille (1 adulte + 1 descendant) : sur devis";

export const avantagesMembres = [
  "-5% pour paiement comptant ou 5 ans d'ancienneté (non cumulable)",
  "8 invitations inter-clubs par mois (Cabre d'Or, Aix, Grand-Avignon, Valgarde, Digne, Miramas, Roquebrune, Luberon)",
  "-60% sur les golfs d'Aix-Marseille (hors compétitions et jours fériés)",
  "Réductions inter-clubs avec la carte LeClub",
  "Facilités de paiement : mensuel ou trimestriel",
];

export const tarifsMembres = [
  { libelle: "Voiturette 18 trous", prix: "28€" },
  { libelle: "Voiturette 9 trous", prix: "25€" },
  { libelle: "1 seau de balles", prix: "3€" },
  { libelle: "5 seaux", prix: "12€" },
  { libelle: "10 seaux", prix: "22€" },
  { libelle: "25 seaux", prix: "50€" },
  { libelle: "50 seaux", prix: "75€" },
];
