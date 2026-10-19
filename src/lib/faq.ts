import type { Route } from "next";

import { pagesAVenir, site, urlItineraire } from "@/config/site";
import { enseignants, formulesJuniors, formulesPrestige } from "@/lib/academie";
import { euros, saisonsDe, type GrilleTarifs, type Location } from "@/lib/tarifs";

/**
 * Questions fréquentes, par thème.
 *
 * Les réponses chiffrées (tarifs, académie) sont tirées des mêmes données que
 * les pages concernées, pour ne jamais diverger. TODO : les autres réponses
 * sont rédigées pour ne rien promettre (renvoi vers l'accueil quand la règle
 * n'est pas connue) — à faire valider par le club.
 */

export type PictoTheme =
  | "drapeau"
  | "calendrier"
  | "etiquette"
  | "membres"
  | "academie"
  | "trophee"
  | "practice"
  | "couverts"
  | "salle"
  | "repere";

export type QuestionFaq = {
  question: string;
  reponse: string;
  lien?: { label: string; href: Route | `https://${string}` | `tel:${string}` };
};

export type ThemeFaq = { id: string; titre: string; picto: PictoTheme; questions: QuestionFaq[] };

const prix = (ligne: Location) =>
  `${ligne.libelle.toLowerCase()} : ${euros(ligne.prix)}${ligne.membres ? ` (${euros(ligne.membres)} pour les membres)` : ""}`;

const telephone = site.contact.telephone;

/** Questions par thème ; les réponses chiffrées viennent de la grille publiée. */
export function themesFaq(grille: GrilleTarifs): ThemeFaq[] {
  const { abonnements, carnets, greenFees, remiseComptant } = grille;
  const locations = grille.locations.filter((l) => l.groupe === "location");
  const practice = grille.locations.filter((l) => l.groupe === "practice");
  const saisons = saisonsDe(grille);
  const gf18 = greenFees.find((g) => g.saison === null) ?? greenFees[0];
  const gf9Haute = greenFees.find((g) => g.saison === "haute");
  const gf9Basse = greenFees.find((g) => g.saison === "basse");
  const minuscule = (texte: string) => texte.charAt(0).toLowerCase() + texte.slice(1).replace(/\.$/, "");

  return [
  {
    id: "golf-parcours",
    titre: "Le golf & le parcours",
    picto: "drapeau",
    questions: [
      {
        question: "Le golf est-il ouvert aux non-membres ?",
        reponse:
          "Oui. Le parcours est ouvert à tous les golfeurs, membres ou non. Il suffit de réserver un départ en ligne ou auprès de l'accueil et de régler un green fee.",
      },
      {
        question: "Faut-il un niveau minimum pour jouer ?",
        reponse:
          "Une carte verte ou un index est demandé pour jouer le parcours. Pour débuter, l'Académie propose des initiations encadrées par nos enseignants.",
        lien: { label: "Découvrir l'Académie", href: "/academie" },
      },
      {
        question: "Combien de temps dure une partie de 18 trous ?",
        reponse: "Comptez en moyenne quatre heures à quatre heures et demie pour un 18 trous.",
      },
      {
        question: "Comment connaître l'état du parcours avant de venir ?",
        reponse:
          "L'accueil met à jour l'état du parcours, des voiturettes et des installations chaque matin. Il est affiché en haut du site : cliquez sur « Parcours ouvert » pour le détail.",
      },
      {
        question: "Une tenue particulière est-elle exigée ?",
        reponse: "Oui : une tenue de golf correcte est exigée sur le parcours et au practice.",
      },
      {
        question: "Qui a dessiné le parcours ?",
        reponse:
          "Robert Trent Jones II, l'un des plus grands architectes de golf au monde, en 1985. Le parcours est un par 70 de 5 817 mètres.",
        lien: { label: "Explorer le parcours", href: "/le-parcours" },
      },
    ],
  },
  {
    id: "reservations",
    titre: "Réservations & départs",
    picto: "calendrier",
    questions: [
      {
        question: "Comment réserver un départ ?",
        reponse: `En ligne, à tout moment, via le bouton « Réserver un départ », ou par téléphone auprès de l'accueil au ${telephone}.`,
      },
      {
        question: "Puis-je modifier ou annuler ma réservation ?",
        reponse: `Contactez l'accueil au ${telephone} : il vous indiquera les conditions de modification ou d'annulation.`,
      },
      {
        question: "Puis-je réserver pour un groupe ?",
        reponse:
          "Oui. Pour un groupe, une sortie d'entreprise ou un événement, contactez l'accueil pour organiser vos départs.",
        lien: { label: "Groupes & privatisation", href: pagesAVenir.groupePrivatisation },
      },
      {
        question: "Puis-je venir jouer seul ?",
        reponse: "Oui. Réservez simplement un départ en ligne ou auprès de l'accueil.",
      },
    ],
  },
  {
    id: "tarifs",
    titre: "Tarifs & paiement",
    picto: "etiquette",
    questions: [
      {
        question: "Quels sont les tarifs des green fees ?",
        reponse: `${gf18 ? `${gf18.libelle} : ${euros(gf18.prix)} toute l'année.` : ""}${
          gf9Haute && gf9Basse
            ? ` 9 trous : ${euros(gf9Haute.prix)} en haute saison (${minuscule(saisons.haute.detail)}) et ${euros(gf9Basse.prix)} en basse saison (${minuscule(saisons.basse.detail)}).`
            : ""
        }`.trim(),
        lien: { label: "Tous les tarifs", href: "/tarifs" },
      },
      {
        question: "Existe-t-il des carnets de green fees ?",
        reponse: `Oui, valables 12 mois : ${carnets
          .map((carnet) => `${carnet.libelle.toLowerCase()} à ${euros(carnet.prix)}`)
          .join(", ")}.`,
      },
      {
        question: "Combien coûte la location d'une voiturette ?",
        reponse: `${locations
          .filter((ligne) => ligne.libelle.startsWith("Voiturette"))
          .map(prix)
          .join(" ; ")
          .replace(/^./, (lettre) => lettre.toUpperCase())}.`,
      },
      {
        question: "Quels moyens de paiement acceptez-vous ?",
        reponse: "L'accueil vous renseigne sur les moyens de paiement acceptés sur place.",
      },
      {
        question: "Peut-on offrir un green fee ?",
        reponse: "Oui, contactez l'accueil du club pour toute demande de cadeau.",
      },
    ],
  },
  {
    id: "abonnements",
    titre: "Abonnements & vie de club",
    picto: "membres",
    questions: [
      {
        question: "Quelles formules d'abonnement proposez-vous ?",
        reponse: `${abonnements.map((formule) => `${formule.libelle} ${euros(formule.prix)}`).join(", ")}, par an.`,
        lien: { label: "Voir les abonnements", href: "/tarifs" },
      },
      {
        question: "Y a-t-il une réduction en payant comptant ?",
        reponse: `Oui : −${Math.round(remiseComptant.taux * 100)} % en paiement comptant jusqu'au ${remiseComptant.jusquau}.`,
      },
      {
        question: "Peut-on payer l'abonnement en plusieurs fois ?",
        reponse: "Contactez l'accueil pour connaître les modalités de paiement de votre abonnement.",
      },
      {
        question: "Comment devenir membre ?",
        reponse:
          "Faites votre demande d'adhésion en ligne ou auprès de l'accueil : l'équipe vous accompagne dans le choix de la formule.",
        lien: { label: "Devenir membre", href: pagesAVenir.devenirMembre },
      },
      {
        question: "Qu'est-ce que l'Association sportive ?",
        reponse:
          "L'Association sportive anime la vie du club : compétitions, rencontres et événements entre membres tout au long de la saison.",
      },
    ],
  },
  {
    id: "academie",
    titre: "L'Académie : cours & stages",
    picto: "academie",
    questions: [
      {
        question: "À partir de quel âge peut-on apprendre ?",
        reponse: `Dès 4 ans, à l'école de golf juniors : ${formulesJuniors
          .map((formule) => `${formule.titre} ${euros(formule.prix)} par an (${formule.rythme})`)
          .join(", ")}, le mercredi et le samedi.`,
        lien: { label: "École juniors", href: "/academie" },
      },
      {
        question: "Proposez-vous des cours pour adultes ?",
        reponse: `Oui, les formules Prestige : cours collectifs de 6 personnes maximum, une heure par jour, lundi, mardi, jeudi et vendredi, dès ${euros(Math.min(...formulesPrestige.map((formule) => formule.prix)))} par mois.`,
      },
      {
        question: "Y a-t-il des stages pendant les vacances ?",
        reponse: "Oui, des stages tous niveaux sont organisés pendant les vacances scolaires et toute l'année.",
      },
      {
        question: "Peut-on organiser une initiation découverte ?",
        reponse:
          "Oui, de 2 à 30 personnes, entre amis, en famille ou entre collègues. Réservez par téléphone auprès de l'accueil.",
      },
      {
        question: "Qui sont les enseignants ?",
        reponse: `${enseignants.map((enseignant) => enseignant.nom).join(" et ")}, enseignants diplômés d'État.`,
      },
    ],
  },
  {
    id: "competitions",
    titre: "Compétitions",
    picto: "trophee",
    questions: [
      {
        question: "Comment s'inscrire à une compétition ?",
        reponse:
          "Depuis la page Compétitions : choisissez la compétition, puis suivez le bouton « S'inscrire » dès l'ouverture des inscriptions.",
        lien: { label: "Calendrier des compétitions", href: "/competitions" },
      },
      {
        question: "Les compétitions sont-elles ouvertes aux visiteurs ?",
        reponse:
          "Certaines, oui : elles portent la mention « Ouvert à tous ». Le filtre « Ouvertes aux visiteurs » de la page Compétitions les regroupe.",
      },
      {
        question: "Où consulter les résultats ?",
        reponse: "Les classements officiels sont publiés au format PDF dès le lendemain de chaque compétition.",
        lien: { label: "Résultats de la saison", href: "/competitions/resultats" },
      },
    ],
  },
  {
    id: "practice",
    titre: "Practice & matériel",
    picto: "practice",
    questions: [
      {
        question: "Combien coûte un seau de balles ?",
        reponse: `${practice.map(prix).join(" ; ").replace(/^./, (lettre) => lettre.toUpperCase())}.`,
      },
      {
        question: "Peut-on louer du matériel ?",
        reponse: `Oui : ${locations
          .filter((ligne) => !ligne.libelle.startsWith("Voiturette"))
          .map(prix)
          .join(" ; ")}.`,
      },
      {
        question: "Les voiturettes sont-elles toujours autorisées ?",
        reponse:
          "Leur circulation dépend de l'état du terrain. L'accueil indique chaque matin si elles sont autorisées, en haut du site (« Parcours ouvert »).",
      },
    ],
  },
  {
    id: "restaurant",
    titre: "Restaurant & Club House",
    picto: "couverts",
    questions: [
      {
        question: "Le restaurant est-il ouvert aux non-golfeurs ?",
        reponse: "Contactez directement le restaurant pour connaître les horaires et réserver une table.",
      },
      {
        question: "Peut-on profiter de la terrasse ?",
        reponse:
          "La grande terrasse du Club House offre une vue panoramique sur la montagne Sainte-Victoire.",
      },
    ],
  },
  {
    id: "seminaires",
    titre: "Séminaires & réceptions",
    picto: "salle",
    questions: [
      {
        question: "Peut-on privatiser le domaine ?",
        reponse:
          "Oui, pour un séminaire, une journée golf d'entreprise, une soirée ou une réception. Faites votre demande via la page Contact.",
        lien: { label: "Nous contacter", href: "/contact" },
      },
      {
        question: "Quelles prestations proposez-vous ?",
        reponse:
          "Salons du château, restauration et initiations au golf : l'équipe établit avec vous une proposition sur mesure.",
      },
    ],
  },
  {
    id: "acces",
    titre: "Accès & infos pratiques",
    picto: "repere",
    questions: [
      {
        question: "Où se trouve le golf ?",
        reponse: `${site.contact.adresse}, ${site.contact.codePostalVille}, aux portes d'Aix-en-Provence.`,
      },
      {
        question: "Comment venir ?",
        reponse:
          "Le domaine est à 25 minutes de l'aéroport Marseille Provence et de la gare TGV d'Aix-en-Provence, et à 5 minutes de l'autoroute A8.",
        lien: { label: "Itinéraire", href: urlItineraire as `https://${string}` },
      },
      {
        question: "Comment joindre l'accueil ?",
        reponse: `Par téléphone au ${telephone} ou par e-mail à ${site.contact.email}.`,
      },
    ],
  },
  ];
}

/** Raccourcis de la bannière : remplissent la recherche. */
export const recherchesFrequentes = [
  "Tarifs green fees",
  "Réserver un départ",
  "Carte verte",
  "Compétitions",
  "Voiturettes",
  "Accès",
];
