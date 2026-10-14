import "server-only";

import { cacheLife } from "next/cache";

import { evenements } from "@/lib/analytics/evenements";
import { bornes, type Intervalle, type Periode, type Unite } from "@/lib/analytics/periodes";

/**
 * Lecture des statistiques Umami pour l'accueil du back-office.
 *
 * Variables d'environnement :
 * - UMAMI_API_KEY : clé d'API (Umami Cloud → Settings → API keys).
 * - NEXT_PUBLIC_UMAMI_WEBSITE_ID : identifiant du site (aussi utilisé par le suivi).
 * - UMAMI_API_URL (facultatif) : https://api.umami.is/v1 par défaut (Umami Cloud).
 */
const API = (process.env.UMAMI_API_URL || "https://api.umami.is/v1").replace(/\/$/, "");
const CLE = process.env.UMAMI_API_KEY;
const SITE = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

export const analyticsConfigure = Boolean(CLE && SITE);

type Point = { x: string; y: number };

async function umami<T>(chemin: string, parametres: Record<string, string | number>): Promise<T> {
  const url = new URL(`${API}/websites/${SITE}${chemin}`);
  for (const [cle, valeur] of Object.entries(parametres)) url.searchParams.set(cle, String(valeur));

  const reponse = await fetch(url, {
    signal: AbortSignal.timeout(10_000),
    headers: { Accept: "application/json", Authorization: `Bearer ${CLE}` },
  });
  if (!reponse.ok) throw new Error(`Umami ${reponse.status} sur ${chemin}`);
  return (await reponse.json()) as T;
}

const plage = ({ debut, fin }: Intervalle) => ({
  startAt: debut.getTime(),
  endAt: fin.getTime(),
  timezone: "Europe/Paris",
});

/** Les statistiques renvoient un objet, ou un tableau d'un seul objet selon la version. */
const visiteurs = (reponse: unknown): number => {
  const ligne = (Array.isArray(reponse) ? reponse[0] : reponse) as
    | { visitors?: number | { value?: number } }
    | undefined;
  const valeur = ligne?.visitors;
  return Number(typeof valeur === "object" ? valeur?.value : valeur) || 0;
};

/** « 2026-10-14 13:00:00 » ou « 2026-10-14T13:00:00Z » → clé de graduation. */
function cle(date: string, unite: Unite): string {
  const propre = date.replace("T", " ");
  return propre.slice(0, unite === "hour" ? 13 : unite === "day" ? 10 : 7);
}

function serie(points: Point[], graduations: { cle: string }[], unite: Unite): number[] {
  const parCle = new Map<string, number>();
  for (const point of points) {
    const c = cle(point.x, unite);
    parCle.set(c, (parCle.get(c) ?? 0) + Number(point.y));
  }
  return graduations.map((g) => parCle.get(g.cle) ?? 0);
}

const compter = (metriques: Point[], nom: string) =>
  Number(metriques.find((m) => m.x === nom)?.y ?? 0);

export type Indicateur = { valeur: number; precedent: number; serie: number[] };

export type Statistiques = {
  visiteurs: Indicateur;
  inscriptions: Indicateur;
  demandes: Indicateur;
  appels: Indicateur;
  popupClics: Indicateur;
  popupAffichages: number;
  graduations: { cle: string; libelle: string }[];
  /** Visites par graduation (graphique en barres). */
  visites: number[];
  sources: { libelle: string; part: number }[];
  pages: { chemin: string; vues: number }[];
};

/** Regroupe les canaux d'Umami dans les quatre familles de la maquette. */
function familles(canaux: Point[]): { libelle: string; part: number }[] {
  const total = canaux.reduce((somme, c) => somme + Number(c.y), 0);
  const groupes = new Map<string, number>([
    ["Moteurs de recherche", 0],
    ["Accès direct", 0],
    ["Réseaux sociaux", 0],
    ["Autres sites", 0],
  ]);
  for (const canal of canaux) {
    const famille = /search/i.test(canal.x)
      ? "Moteurs de recherche"
      : canal.x === "direct"
        ? "Accès direct"
        : /social/i.test(canal.x)
          ? "Réseaux sociaux"
          : "Autres sites";
    groupes.set(famille, (groupes.get(famille) ?? 0) + Number(canal.y));
  }
  return [...groupes].map(([libelle, nombre]) => ({
    libelle,
    part: total ? Math.round((nombre / total) * 100) : 0,
  }));
}

/**
 * Tous les chiffres de l'accueil pour une période, ou null si Umami n'est pas
 * configuré ou ne répond pas. Mis en cache quelques minutes : l'accueil reste
 * rapide et l'API n'est pas sollicitée à chaque visite du back-office.
 */
export async function getStatistiques(
  periode: Periode,
  depuisPopup: string | null,
): Promise<Statistiques | null> {
  "use cache";
  cacheLife("minutes");

  if (!analyticsConfigure) return null;

  const { debut, fin, precedent, unite, graduations } = bornes(periode);
  const courant = plage({ debut, fin });
  const avant = plage(precedent);

  try {
    const [stats, statsAvant, vues, evts, evtsAvant, serieEvts, canaux, pages, affichages] =
      await Promise.all([
        umami<unknown>("/stats", courant),
        umami<unknown>("/stats", avant),
        umami<{ sessions: Point[] }>("/pageviews", { ...courant, unit: unite }),
        umami<Point[]>("/metrics", { ...courant, type: "event" }),
        umami<Point[]>("/metrics", { ...avant, type: "event" }),
        umami<{ x: string; t: string; y: number }[]>("/events/series", { ...courant, unit: unite }),
        umami<Point[]>("/metrics", { ...courant, type: "channel" }),
        umami<Point[]>("/metrics", { ...courant, type: "path", limit: 5 }),
        depuisPopup
          ? umami<Point[]>("/metrics", {
              startAt: new Date(depuisPopup).getTime(),
              endAt: fin.getTime(),
              type: "event",
            })
          : Promise.resolve([] as Point[]),
      ]);

    const indicateur = (nom: string): Indicateur => ({
      valeur: compter(evts, nom),
      precedent: compter(evtsAvant, nom),
      serie: serie(
        serieEvts.filter((p) => p.x === nom).map((p) => ({ x: p.t, y: p.y })),
        graduations,
        unite,
      ),
    });

    const visites = serie(vues.sessions ?? [], graduations, unite);

    return {
      visiteurs: { valeur: visiteurs(stats), precedent: visiteurs(statsAvant), serie: visites },
      inscriptions: indicateur(evenements.inscription),
      demandes: indicateur(evenements.demande),
      appels: indicateur(evenements.appel),
      popupClics: indicateur(evenements.popupClic),
      popupAffichages: compter(affichages, evenements.popupAffichage),
      graduations,
      visites,
      sources: familles(canaux),
      pages: pages.map((page) => ({ chemin: page.x, vues: Number(page.y) })),
    };
  } catch (erreur) {
    console.error("Statistiques Umami indisponibles", erreur);
    return null;
  }
}

/** Visiteurs des 5 dernières minutes, ou null. */
export async function getVisiteursActifs(): Promise<number | null> {
  "use cache";
  cacheLife({ stale: 30, revalidate: 60, expire: 300 });

  if (!analyticsConfigure) return null;
  try {
    const reponse = await umami<{ visitors?: number; x?: number }>("/active", {});
    return Number(reponse.visitors ?? reponse.x) || 0;
  } catch (erreur) {
    console.error("Visiteurs actifs Umami indisponibles", erreur);
    return null;
  }
}
