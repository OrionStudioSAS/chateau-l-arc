import "server-only";

import { cacheLife } from "next/cache";

import {
  CLE_ACTIFS,
  CLE_POPUP,
  cleJour,
  clePages,
  cleVisiteurs,
  FENETRE_ACTIFS_MS,
  jourEtHeure,
} from "@/lib/analytics/cles";
import { evenements } from "@/lib/analytics/evenements";
import { ajouterJours, bornes, ymd, type Periode } from "@/lib/analytics/periodes";
import { redis, stockageConfigure, type Commande } from "@/lib/analytics/redis";

/** Dernière erreur de lecture, pour l'expliquer dans le back-office. */
export type EtatStatistiques = "ok" | "non-configure" | "erreur";

export type Indicateur = { valeur: number; precedent: number; serie: number[] };

export type Statistiques = {
  visiteurs: Indicateur;
  inscriptions: Indicateur;
  demandes: Indicateur;
  appels: Indicateur;
  popupClics: Indicateur;
  /** Affichages de la pop-up sur la période (taux de clic). */
  popupAffichagesPeriode: number;
  /** Affichages de la version en ligne de la pop-up, depuis sa publication. */
  popupAffichages: number;
  visiteursActifs: number;
  graduations: { cle: string; libelle: string }[];
  /** Visites par graduation (graphique en barres). */
  visites: number[];
  sources: { libelle: string; part: number }[];
  pages: { chemin: string; vues: number }[];
};

type Compteurs = Record<string, number>;

/** Réponse HGETALL d'Upstash (liste plate champ, valeur…) → objet. */
function versObjet(reponse: unknown): Compteurs {
  const liste = Array.isArray(reponse) ? (reponse as string[]) : [];
  const objet: Compteurs = {};
  for (let i = 0; i < liste.length; i += 2) objet[liste[i]] = Number(liste[i + 1]) || 0;
  return objet;
}

function joursEntre(debut: Date, fin: Date): string[] {
  const jours: string[] = [];
  for (let jour = ymd(debut), dernier = ymd(fin); jour <= dernier; jour = ajouterJours(jour, 1)) {
    jours.push(jour);
  }
  return jours;
}

const somme = (liste: Compteurs[], champ: string) =>
  liste.reduce((total, compteurs) => total + (compteurs[champ] ?? 0), 0);

const FAMILLES: [string, string][] = [
  ["recherche", "Moteurs de recherche"],
  ["direct", "Accès direct"],
  ["social", "Réseaux sociaux"],
  ["autres", "Autres sites"],
];

/**
 * Chiffres de l'accueil du back-office pour une période, lus dans les
 * compteurs du suivi maison (cf. app/api/suivi). Null si le stockage n'est pas
 * configuré ou ne répond pas. Mis en cache une minute.
 */
export async function getStatistiques(
  periode: Periode,
  versionPopup: string | null,
): Promise<{ stats: Statistiques | null; etat: EtatStatistiques; detail?: string }> {
  "use cache";
  cacheLife({ stale: 30, revalidate: 60, expire: 600 });

  if (!stockageConfigure) return { stats: null, etat: "non-configure" };

  const maintenant = new Date();
  const { debut, fin, precedent, unite, graduations } = bornes(periode, maintenant);
  const jours = joursEntre(debut, fin);
  const joursAvant = joursEntre(precedent.debut, precedent.fin);

  const commandes: Commande[] = [
    ...jours.map((jour) => ["HGETALL", cleJour(jour)]),
    ...jours.map((jour) => ["HGETALL", clePages(jour)]),
    ...joursAvant.map((jour) => ["HGETALL", cleJour(jour)]),
    ["PFCOUNT", ...jours.map(cleVisiteurs)],
    ["PFCOUNT", ...joursAvant.map(cleVisiteurs)],
    ["ZREMRANGEBYSCORE", CLE_ACTIFS, 0, maintenant.getTime() - FENETRE_ACTIFS_MS],
    ["ZCARD", CLE_ACTIFS],
    ["HGET", CLE_POPUP, versionPopup ?? "-"],
  ];

  let resultats: unknown[];
  try {
    resultats = await redis(commandes);
  } catch (erreur) {
    console.error("Statistiques indisponibles", erreur);
    // Erreur passagère : on retentera vite plutôt que de la garder en cache.
    cacheLife({ stale: 0, revalidate: 10, expire: 60 });
    return {
      stats: null,
      etat: "erreur",
      detail: erreur instanceof Error ? erreur.message : String(erreur),
    };
  }

  const n = jours.length;
  const parJour = resultats.slice(0, n).map(versObjet);
  const pagesParJour = resultats.slice(n, 2 * n).map(versObjet);
  const parJourAvant = resultats.slice(2 * n, 2 * n + joursAvant.length).map(versObjet);
  const [visiteurs, visiteursAvant, , actifs, affichagesPopup] = resultats
    .slice(2 * n + joursAvant.length)
    .map(Number);

  const compteursDe = new Map(jours.map((jour, i) => [jour, parJour[i]]));
  const { heure } = jourEtHeure(maintenant);

  /** Valeur d'un champ pour chaque graduation (heure, jour ou mois). */
  const serie = (champ: string): number[] =>
    graduations.map(({ cle }) => {
      if (unite === "hour") {
        const [jour, h] = cle.split(" ");
        const champHeure = champ === "visites" ? `h${h}` : `${champ}:h${h}`;
        return compteursDe.get(jour)?.[champHeure] ?? 0;
      }
      if (unite === "day") return compteursDe.get(cle)?.[champ] ?? 0;
      return somme(
        jours.filter((jour) => jour.startsWith(cle)).map((jour) => compteursDe.get(jour) ?? {}),
        champ,
      );
    });

  /** « Aujourd'hui » se compare à hier, jusqu'à la même heure. */
  const precedentDe = (champ: string): number =>
    periode === "jour"
      ? Array.from({ length: Number(heure) + 1 }, (_, h) =>
          parJourAvant[0]?.[`${champ}:h${String(h).padStart(2, "0")}`] ?? 0,
        ).reduce((a, b) => a + b, 0)
      : somme(parJourAvant, champ);

  const indicateur = (nom: string): Indicateur => ({
    valeur: somme(parJour, `e:${nom}`),
    precedent: precedentDe(`e:${nom}`),
    serie: serie(`e:${nom}`),
  });

  const totalSources = FAMILLES.reduce((total, [cle]) => total + somme(parJour, `src:${cle}`), 0);

  const pages = new Map<string, number>();
  for (const compteurs of pagesParJour) {
    for (const [chemin, vues] of Object.entries(compteurs)) {
      pages.set(chemin, (pages.get(chemin) ?? 0) + vues);
    }
  }

  const visites = serie("visites");

  const stats: Statistiques = {
    visiteurs: {
      valeur: visiteurs || 0,
      // Les visiteurs uniques d'hier ne se découpent pas par heure : pas
      // d'évolution affichée pour « Aujourd'hui ».
      precedent: periode === "jour" ? 0 : visiteursAvant || 0,
      serie: visites,
    },
    inscriptions: indicateur(evenements.inscription),
    demandes: indicateur(evenements.demande),
    appels: indicateur(evenements.appel),
    popupClics: indicateur(evenements.popupClic),
    popupAffichagesPeriode: somme(parJour, `e:${evenements.popupAffichage}`),
    popupAffichages: affichagesPopup || 0,
    visiteursActifs: actifs || 0,
    graduations,
    visites,
    sources: FAMILLES.map(([cle, libelle]) => ({
      libelle,
      part: totalSources ? Math.round((somme(parJour, `src:${cle}`) / totalSources) * 100) : 0,
    })),
    pages: [...pages]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([chemin, vues]) => ({ chemin, vues })),
  };
  return { stats, etat: "ok" };
}
