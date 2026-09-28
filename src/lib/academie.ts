/**
 * Offre de l'académie.
 * TODO : relevée sur la maquette — à faire valider par le club, en même temps
 * que la grille tarifaire (src/lib/tarifs.ts).
 */

export const formulesJuniors = [
  {
    titre: "4 – 7 ans",
    prix: "310€ / an",
    rythme: "1h30 par semaine",
    description: "Éveil golfique par le jeu, en petits groupes.",
  },
  {
    titre: "7 ans et +",
    prix: "410€ / an",
    rythme: "2h00 par semaine",
    description: "Technique, parcours et premières compétitions jeunes.",
  },
];

export const noteJuniors =
  "Stages pendant les vacances scolaires · Licence FFGolf : 21€ (-13 ans) / 24€ (13-18 ans)";

export const formulesPrestige = [
  {
    titre: "Prestige · 1 mois",
    prix: "140€",
    periode: "par mois",
    description: "Pour essayer le rythme des cours collectifs.",
  },
  {
    titre: "Prestige · 3 mois",
    prix: "110€",
    periode: "par mois",
    description: "Le bon tempo pour installer les fondamentaux.",
  },
  {
    titre: "Prestige · 6 mois",
    prix: "90€",
    periode: "par mois",
    description: "La progression sur la durée, au meilleur tarif.",
  },
  {
    titre: "Prestige + · 6 mois",
    prix: "200€",
    periode: "par mois",
    description:
      "Cours à volonté + parcours 9 trous à volonté*. Idéal nouveaux joueurs.",
    miseEnAvant: true,
    etiquette: "Recommandé",
  },
];

export const notePrestige =
  "*parcours accessible à partir de 13h l'hiver, 14h l'été";

/** TODO : portraits à remplacer par les photos des enseignants. */
export const enseignants = [
  { nom: "Julien Lefevre", titre: "Enseignant diplômé d'État", cadrage: "50% 30%" },
  { nom: "Arnaud Bonnard", titre: "Enseignant diplômé d'État", cadrage: "40% 60%" },
];
