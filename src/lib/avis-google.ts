import "server-only";

import { cacheLife } from "next/cache";

/**
 * Avis Google de la fiche du golf, via l'API Places (New) :
 * note moyenne, nombre d'avis et les 5 avis que Google juge les plus
 * pertinents (limite de l'API). Lus côté serveur : aucun script ni cookie
 * Google sur le site.
 *
 * Variables (Vercel et .env.local) :
 *   - GOOGLE_PLACES_API_KEY : clé Google Maps Platform, « Places API (New) » activée ;
 *   - GOOGLE_PLACE_ID (facultatif) : identifiant de la fiche ; sinon retrouvé
 *     par une recherche « Golf Château l'Arc, Fuveau ».
 * Sans clé, rien n'est appelé et la section des avis n'apparaît pas (en local,
 * un aperçu d'exemple permet de travailler la mise en page).
 */

export type AvisGoogle = {
  /** Identifiant Google de l'avis (« places/…/reviews/… »). */
  id: string;
  auteur: string;
  /** Profil Google de l'auteur. */
  auteurUrl: string | null;
  photo: string | null;
  note: number;
  texte: string;
  /** « il y a 2 mois », dans la langue demandée. */
  quand: string;
  publieLe: string | null;
  /** Avis sur Google Maps. */
  lien: string | null;
};

export type FicheAvis = {
  note: number | null;
  nombre: number;
  avis: AvisGoogle[];
  /** Tous les avis de la fiche sur Google. */
  lienAvis: string | null;
  /** Formulaire « Donner un avis ». */
  lienDonnerAvis: string | null;
  /** Aperçu d'exemple (développement sans clé) : jamais en production. */
  exemple?: boolean;
};

const API = "https://places.googleapis.com/v1";
const RECHERCHE = "Golf Château l'Arc, Fuveau";

const avisGoogleConfigures = () => Boolean(process.env.GOOGLE_PLACES_API_KEY);

type ReponseFiche = {
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  googleMapsLinks?: { reviewsUri?: string; writeAReviewUri?: string };
  reviews?: {
    name: string;
    rating?: number;
    relativePublishTimeDescription?: string;
    publishTime?: string;
    text?: { text?: string };
    originalText?: { text?: string };
    googleMapsUri?: string;
    authorAttribution?: { displayName?: string; uri?: string; photoUri?: string };
  }[];
};

async function appeler<T>(chemin: string, init: RequestInit & { champs: string }): Promise<T> {
  const { champs, ...options } = init;
  const reponse = await fetch(`${API}${chemin}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": process.env.GOOGLE_PLACES_API_KEY ?? "",
      "X-Goog-FieldMask": champs,
    },
    signal: AbortSignal.timeout(6000),
  });
  if (!reponse.ok) throw new Error(`Places API ${reponse.status} : ${(await reponse.text()).slice(0, 300)}`);
  return (await reponse.json()) as T;
}

/** Identifiant de la fiche : variable d'environnement, sinon recherche (gardée une semaine). */
async function identifiantFiche(): Promise<string | null> {
  "use cache";
  cacheLife("weeks");
  if (process.env.GOOGLE_PLACE_ID) return process.env.GOOGLE_PLACE_ID;
  const resultat = await appeler<{ places?: { id: string }[] }>("/places:searchText", {
    method: "POST",
    body: JSON.stringify({ textQuery: RECHERCHE, languageCode: "fr" }),
    champs: "places.id",
  });
  return resultat.places?.[0]?.id ?? null;
}

/**
 * Note et avis dans la langue de la page (Google traduit les avis). Mis en
 * cache 6 heures : quelques appels par jour, dans le quota gratuit de Google.
 */
export async function lireAvisGoogle(langue: string): Promise<FicheAvis | null> {
  "use cache";
  cacheLife({ stale: 3600, revalidate: 6 * 3600, expire: 2 * 86400 });

  if (!avisGoogleConfigures()) return process.env.NODE_ENV === "development" ? exemple : null;

  try {
    const id = await identifiantFiche();
    if (!id) throw new Error(`Fiche introuvable (« ${RECHERCHE} »)`);
    const fiche = await appeler<ReponseFiche>(`/places/${encodeURIComponent(id)}?languageCode=${encodeURIComponent(langue)}`, {
      champs: "rating,userRatingCount,googleMapsUri,googleMapsLinks,reviews",
    });
    return {
      note: fiche.rating ?? null,
      nombre: fiche.userRatingCount ?? 0,
      lienAvis: fiche.googleMapsLinks?.reviewsUri ?? fiche.googleMapsUri ?? null,
      lienDonnerAvis: fiche.googleMapsLinks?.writeAReviewUri ?? null,
      avis: (fiche.reviews ?? [])
        .map((a) => ({
          id: a.name,
          auteur: a.authorAttribution?.displayName ?? "Golfeur",
          auteurUrl: a.authorAttribution?.uri ?? null,
          photo: a.authorAttribution?.photoUri ?? null,
          note: a.rating ?? 0,
          texte: (a.text?.text ?? a.originalText?.text ?? "").trim(),
          quand: a.relativePublishTimeDescription ?? "",
          publieLe: a.publishTime ?? null,
          lien: a.googleMapsUri ?? null,
        }))
        .filter((a) => a.texte),
    };
  } catch (erreur) {
    // Panne passagère ou clé refusée : on réessaie dans 10 minutes.
    cacheLife({ stale: 60, revalidate: 600, expire: 1800 });
    console.error("Avis Google indisponibles", erreur);
    return null;
  }
}

/** Aperçu de mise en page, en développement sans clé : textes fictifs signalés comme tels. */
const exemple: FicheAvis = {
  exemple: true,
  note: 4.6,
  nombre: 128,
  lienAvis: null,
  lienDonnerAvis: null,
  avis: [
    { id: "exemple-1", auteur: "Exemple A.", auteurUrl: null, photo: null, note: 5, texte: "Texte d'exemple : avis long pour vérifier la mise en page sur plusieurs lignes. Le vrai contenu viendra de la fiche Google du golf dès que la clé sera configurée.", quand: "il y a 2 semaines", publieLe: null, lien: null },
    { id: "exemple-2", auteur: "Exemple B.", auteurUrl: null, photo: null, note: 4, texte: "Texte d'exemple : avis court.", quand: "il y a 1 mois", publieLe: null, lien: null },
    { id: "exemple-3", auteur: "Exemple C.", auteurUrl: null, photo: null, note: 5, texte: "Texte d'exemple : avis de longueur moyenne, pour juger de l'équilibre entre les cartes.", quand: "il y a 3 mois", publieLe: null, lien: null },
  ],
};
