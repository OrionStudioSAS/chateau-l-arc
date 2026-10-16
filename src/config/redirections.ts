/**
 * Plan de redirections 301 : URL de l'ancien site (même domaine,
 * www.chateaularcgolfclub.com) → pages du nouveau site. Servi par
 * next.config.ts ; détail et justification dans docs/plan-redirections-301.md.
 *
 * L'ordre compte : la première règle qui correspond s'applique (les règles
 * précises avant les génériques, le filet `/fr/:chemin*` en dernier). La
 * chaîne de requête est conservée par Next.
 */
import { urlReservation } from "./site";

export type Redirection = { source: string; destination: string };

/** Anciennes actualités : chacune vers la page la plus proche de son sujet. */
const actualites: Record<string, string> = {
  // État du parcours, travaux, practice
  "actualites-parcours-17-avril": "/informations-parcours",
  "aeration-des-greens": "/informations-parcours",
  "aeration-des-greens-et-departs": "/informations-parcours",
  "parcours-point-au-17-novembre": "/informations-parcours",
  "des-nouvelles-du-parcours-chateau-l-arc": "/informations-parcours",
  "reouverture-de-la-route-vers-le-practice": "/le-parcours",
  "annonce-speciale-practice": "/le-parcours",
  "de-nouvelles-balles-au-practice": "/le-parcours",
  // Compétitions et équipes
  "agsca-avril-2024": "/competitions/resultats",
  "asgca-2024": "/competitions/resultats",
  "amicale-des-seniors-de-provence-1": "/competitions/resultats",
  "amicale-des-seniors-de-provence-avril-24": "/competitions/resultats",
  "championnat-de-ligue-par-equipes": "/competitions/resultats",
  "championnat-de-ligue-par-equipes-2eme-division-messieurs": "/competitions/resultats",
  "championnat-de-ligue-par-equipes-promotion-seniors-messieurs-et-dames": "/competitions/resultats",
  "finale-de-ligue-individuel-match-play-2023": "/competitions/resultats",
  "interclubs-provence-dames-paca": "/competitions/resultats",
  "la-coupe-du-personnel-2023": "/competitions/resultats",
  "race-to-sainte-victoire-2021": "/competitions/resultats",
  // Vie du club
  "recrutement-immediat-d-un-caddy-master-commissaire-de-parcours": "/contact",
  "remerciements-pour-votre-fidelite-credit-exceptionnel-dans-vos-reserves": "/tarifs",
  "bonne-annee-2020": "/",
  "decouvrez-les-nouvelles-fonctionnalites-de-notre-site-internet": "/",
};

export const redirections: Redirection[] = [
  // ─── Pages principales ───
  { source: "/fr", destination: "/" },
  { source: "/fr/accueil", destination: "/" },
  { source: "/fr/accueil-1", destination: "/" },
  { source: "/fr/histoire", destination: "/histoire" },
  { source: "/fr/le-chateau-d-arc", destination: "/histoire" },
  // « Nos partenaires » : bloc Partenaires de l'accueil.
  { source: "/fr/organisation", destination: "/" },
  { source: "/fr/tarifs", destination: "/tarifs" },

  // ─── Golf ───
  { source: "/fr/parcours", destination: "/le-parcours" },
  // Pages « Trou n° 1 » à « Trou n° 18 » : section Trou par trou du parcours.
  { source: "/fr/parcours/:chemin*", destination: "/le-parcours" },
  { source: "/fr/trou-par-trou", destination: "/le-parcours" },
  { source: "/fr/competitions", destination: "/competitions" },
  { source: "/fr/competitions/list/:chemin*", destination: "/competitions" },
  // Fiches des anciennes compétitions (épreuves passées) : calendrier.
  { source: "/fr/competitions/:slug", destination: "/competitions" },
  { source: "/fr/competitions/:slug/:chemin*", destination: "/competitions" },
  { source: "/fr/association-sportive", destination: "/competitions" },

  // ─── Académie, événements, contact ───
  { source: "/fr/presentation-1", destination: "/academie" },
  { source: "/fr/s-inscrire", destination: "/academie" },
  { source: "/fr/nos-salles", destination: "/contact" },
  { source: "/fr/contact", destination: "/contact" },
  { source: "/fr/nous-suivre", destination: "/contact" },

  // ─── Actualités ───
  ...Object.entries(actualites).flatMap(([slug, destination]) => [
    { source: `/fr/actualites/articles/${slug}`, destination },
    { source: `/fr/actualites/actualites-publiques/${slug}`, destination },
  ]),
  { source: "/fr/actualites", destination: "/competitions" },
  { source: "/fr/actualites/:chemin*", destination: "/competitions" },

  // ─── Pages légales ───
  { source: "/fr/politique-de-confidentialite", destination: "/" },
  { source: "/fr/mentions-legales-credits", destination: "/" },

  // ─── Espace membres et médias de l'ancienne plateforme ───
  // Connexion membre : la réservation des départs se fait désormais sur Prima Golf.
  { source: "/connexion", destination: urlReservation },
  { source: "/connexion/:chemin*", destination: urlReservation },
  { source: "/account/:chemin*", destination: urlReservation },
  { source: "/videos/:chemin*", destination: "/le-parcours" },
  // PDF de départs et de résultats des compétitions.
  { source: "/models/golfcompetition/:chemin*", destination: "/competitions/resultats" },
  // Documents de l'association sportive (calendriers, statuts, résultats).
  { source: "/models/gallerymedia/:chemin*", destination: "/competitions" },

  // ─── Filet de sécurité : toute autre ancienne page en /fr/ ───
  { source: "/fr/:chemin*", destination: "/" },
];
