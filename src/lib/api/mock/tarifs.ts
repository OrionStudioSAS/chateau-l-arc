import type { Tarif } from "@/lib/api/types";

/** Contenu de démonstration — les montants réels sont à fournir par le club. */
export const tarifsMock: Tarif[] = [
  { id: "gf-18-semaine", libelle: "Green-fee 18 trous", detail: "Du lundi au vendredi", prix: 0, unite: "/ personne", categorie: "green-fee" },
  { id: "gf-18-weekend", libelle: "Green-fee 18 trous", detail: "Week-end et jours fériés", prix: 0, unite: "/ personne", categorie: "green-fee" },
  { id: "gf-9", libelle: "Green-fee 9 trous", prix: 0, unite: "/ personne", categorie: "green-fee" },
  { id: "abo-annuel", libelle: "Abonnement annuel", detail: "Accès illimité au parcours", prix: 0, unite: "/ an", categorie: "abonnement" },
  { id: "loc-voiturette", libelle: "Voiturette", prix: 0, unite: "/ 18 trous", categorie: "location" },
];
