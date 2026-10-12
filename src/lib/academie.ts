/**
 * Offre de l'académie.
 * TODO : relevée sur la maquette — à faire valider par le club, en même temps
 * que la grille tarifaire (src/lib/tarifs.ts).
 */

export const atoutsJuniors = [
  { libelle: "Mercredi & samedi", picto: "calendrier" },
  { libelle: "8 élèves maximum", picto: "groupe" },
  { libelle: "Prêt de club inclus", picto: "club" },
  { libelle: "30 séances par an", picto: "repetition" },
] as const;

export const formulesJuniors = [
  {
    titre: "4 – 7 ans",
    prix: 310,
    rythme: "1h30 par semaine",
    description: "Éveil golfique par le jeu, en petits groupes.",
  },
  {
    titre: "7 ans et +",
    prix: 410,
    rythme: "2h00 par semaine",
    description: "Technique, parcours et premières compétitions jeunes.",
  },
];

export const noteJuniors =
  "Stages pendant les vacances scolaires · Licence FFGolf : 21 € (−13 ans) / 24 € (13–18 ans)";

export const atoutsPrestige = [
  { libelle: "Cours collectifs · 6 personnes maximum", picto: "groupe" },
  { libelle: "1 heure par jour", picto: "horloge" },
  { libelle: "Lundi, mardi, jeudi et vendredi", picto: "calendrier" },
  { libelle: "−10 % pour les membres du club", picto: "remise" },
] as const;

export const formulesPrestige: {
  titre: string;
  prix: number;
  description: string;
  points?: string[];
  etiquette?: string;
}[] = [
  { titre: "Prestige · 1 mois", prix: 140, description: "Pour essayer le rythme des cours collectifs." },
  { titre: "Prestige · 3 mois", prix: 110, description: "Le bon tempo pour installer les fondamentaux." },
  { titre: "Prestige · 6 mois", prix: 90, description: "La progression sur la durée, au meilleur tarif." },
  {
    titre: "Prestige + · 6 mois",
    prix: 200,
    description: "Idéal pour les nouveaux joueurs.",
    points: ["Cours à volonté", "Parcours 9 trous à volonté*"],
    etiquette: "Recommandé",
  },
];

export const notePrestige = "*Parcours accessible à partir de 13h l'hiver, 14h l'été.";

export const stages = [
  { titre: "Initiations découverte", texte: "Une première approche du golf, encadrée par un enseignant." },
  { titre: "Ateliers thématiques", texte: "Petit jeu, putting, sortie de bunker…" },
  { titre: "Stages tous niveaux", texte: "Pendant les vacances scolaires et toute l'année." },
];

/**
 * TODO : photos et présentations des enseignants à fournir ; en attendant,
 * leurs initiales tiennent la place du portrait.
 */
export const enseignants = [
  { nom: "Julien Lefevre", titre: "Enseignant diplômé d'État" },
  { nom: "Arnaud Bonnard", titre: "Enseignant diplômé d'État" },
];
