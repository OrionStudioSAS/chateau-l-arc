import type { Article } from "@/lib/api/types";

/** Contenu de démonstration — remplacé dès que l'API sera branchée. */
export const actualitesMock: Article[] = [
  {
    slug: "ouverture-saison",
    titre: "Ouverture de la saison",
    chapo:
      "Le parcours retrouve ses greens d'été : programme des premières semaines et conditions de jeu.",
    contenuHtml:
      "<p>Texte de démonstration en attente du contenu réel fourni par le club.</p>",
    publieLe: "2026-03-14T09:00:00.000Z",
    categorie: "Vie du club",
  },
  {
    slug: "travaux-practice",
    titre: "Le practice fait peau neuve",
    chapo:
      "Nouveaux tapis, cibles repensées et éclairage : le practice rouvre après trois semaines de travaux.",
    contenuHtml:
      "<p>Texte de démonstration en attente du contenu réel fourni par le club.</p>",
    publieLe: "2026-02-02T09:00:00.000Z",
    categorie: "Équipements",
  },
  {
    slug: "resultats-coupe-du-president",
    titre: "Résultats de la Coupe du Président",
    chapo: "Retour sur une journée disputée sous le soleil de la Sainte-Victoire.",
    contenuHtml:
      "<p>Texte de démonstration en attente du contenu réel fourni par le club.</p>",
    publieLe: "2025-11-18T09:00:00.000Z",
    categorie: "Compétitions",
  },
];
