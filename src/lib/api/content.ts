import { cacheLife, cacheTag } from "next/cache";

import { ApiError, apiFetch, apiIsConfigured } from "@/lib/api/client";
import { creerClientPublic, supabaseConfigure } from "@/lib/supabase/public";
import { actualitesMock } from "@/lib/api/mock/actualites";
import { bandeauMock } from "@/lib/api/mock/bandeau";
import { formulesMock } from "@/lib/api/mock/formules";
import { tarifsMock } from "@/lib/api/mock/tarifs";
import {
  avecEtat,
  mapperCompetition,
  type LigneCompetition,
} from "@/lib/competitions";
import type {
  Article,
  Bandeau,
  CompetitionAvecEtat,
  FormuleAccueil,
  Tarif,
} from "@/lib/api/types";

/**
 * Point d'entrée unique du contenu éditorial.
 * Chaque lecture est mise en cache (« use cache ») et étiquetée : l'API pourra
 * invalider une ressource précise via POST /api/revalidate (cf. app/api/revalidate).
 */
export const tags = {
  bandeau: "bandeau",
  actualites: "actualites",
  competitions: "competitions",
  tarifs: "tarifs",
  formules: "formules",
} as const;

export type ContentTag = (typeof tags)[keyof typeof tags];

async function notFoundToNull<T>(promise: Promise<T>): Promise<T | null> {
  try {
    return await promise;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export async function getActualites(): Promise<Article[]> {
  "use cache";
  cacheTag(tags.actualites);
  cacheLife("hours");

  if (!apiIsConfigured) return actualitesMock;
  return apiFetch<Article[]>("/actualites");
}

export async function getActualite(slug: string): Promise<Article | null> {
  "use cache";
  cacheTag(tags.actualites, `actualite:${slug}`);
  cacheLife("hours");

  if (!apiIsConfigured) {
    return actualitesMock.find((article) => article.slug === slug) ?? null;
  }
  return notFoundToNull(apiFetch<Article>(`/actualites/${slug}`));
}

const COLONNES_COMPETITION =
  "id, slug, nom, date_debut, date_fin, formule, depart, trous, index_maximum, categories, sponsor, inscription_ouverture, inscription_cloture, places, inscrits, mode_inscription, droit_jeu_membres, droit_jeu_visiteurs, inclus, description, affiche_url, statut, resultats_url, resultats_publies";

/**
 * Compétitions publiées, de la plus proche à la plus lointaine.
 * L'état est calculé ici, dans le scope mis en cache : les composants n'ont
 * donc pas besoin de lire l'horloge, ce qui les garderait dynamiques.
 */
export async function getCompetitions(): Promise<CompetitionAvecEtat[]> {
  "use cache";
  cacheTag(tags.competitions);
  cacheLife("hours");

  if (!supabaseConfigure) {
    console.error(
      "Compétitions indisponibles : variables d'environnement Supabase manquantes.",
    );
    return [];
  }

  const supabase = creerClientPublic();
  const { data, error } = await supabase
    .from("competitions")
    .select(COLONNES_COMPETITION)
    .eq("statut", "publie")
    .order("date_debut", { ascending: true });

  if (error || !data) {
    console.error("Lecture des compétitions impossible", error);
    return [];
  }

  const maintenant = new Date();
  return (data as LigneCompetition[])
    .map((ligne) => avecEtat(mapperCompetition(ligne), maintenant))
    .sort((a, b) => a.dateDebut.localeCompare(b.dateDebut));
}

/** Les trois prochaines compétitions à venir, pour l'accueil. */
export async function getProchainesCompetitions(
  limite = 3,
): Promise<CompetitionAvecEtat[]> {
  "use cache";
  cacheTag(tags.competitions);
  cacheLife("hours");

  const competitions = await getCompetitions();
  const aVenir = competitions.filter(
    (competition) =>
      competition.etat.cle !== "resultats-attente" &&
      competition.etat.cle !== "resultats-publies",
  );

  return (aVenir.length > 0 ? aVenir : competitions).slice(0, limite);
}

export async function getCompetition(
  slug: string,
): Promise<CompetitionAvecEtat | null> {
  "use cache";
  cacheTag(tags.competitions, `competition:${slug}`);
  cacheLife("hours");

  if (!supabaseConfigure) return null;

  const supabase = creerClientPublic();
  const { data, error } = await supabase
    .from("competitions")
    .select(COLONNES_COMPETITION)
    .eq("statut", "publie")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) return null;

  return avecEtat(mapperCompetition(data as LigneCompetition), new Date());
}

export async function getTarifs(): Promise<Tarif[]> {
  "use cache";
  cacheTag(tags.tarifs);
  cacheLife("days");

  if (!apiIsConfigured) return tarifsMock;
  return apiFetch<Tarif[]>("/tarifs");
}

export async function getBandeau(): Promise<Bandeau> {
  "use cache";
  cacheTag(tags.bandeau);
  cacheLife("days");

  // Sans Supabase configuré (tests, environnement vierge), on sert le mock.
  if (!supabaseConfigure) return bandeauMock;

  const supabase = creerClientPublic();
  const { data, error } = await supabase
    .from("bandeau")
    .select("message, actif, lien_label, lien_href, publie_le")
    .eq("id", "principal")
    .maybeSingle();

  if (error || !data) {
    console.error("Lecture du bandeau impossible", error);
    // Plutôt qu'une page en erreur, le bandeau disparaît.
    return { actif: false, message: "" };
  }

  return {
    actif: data.actif,
    message: data.message,
    lien:
      data.lien_label && data.lien_href
        ? { label: data.lien_label, href: data.lien_href }
        : undefined,
    publieLe: data.publie_le,
  };
}

export async function getFormulesAccueil(): Promise<FormuleAccueil[]> {
  "use cache";
  cacheTag(tags.formules);
  cacheLife("days");

  if (!apiIsConfigured) return formulesMock;
  return apiFetch<FormuleAccueil[]>("/formules-accueil");
}
