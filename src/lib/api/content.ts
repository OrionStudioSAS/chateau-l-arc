import { cacheLife, cacheTag } from "next/cache";

import { ApiError, apiFetch, apiIsConfigured } from "@/lib/api/client";
import { actualitesMock } from "@/lib/api/mock/actualites";
import { avecEtat, mapperCompetition } from "@/lib/competitions";
import { lireContenu, type FichierPopup } from "@/lib/contenu/stockage";
import { normaliserInstallation } from "@/lib/statut";
import type { GrilleTarifs } from "@/lib/tarifs";
import type {
  Article,
  Bandeau,
  CompetitionAvecEtat,
  Installation,
  Popup,
} from "@/lib/api/types";

/**
 * Point d'entrée unique du contenu éditorial.
 * Chaque lecture est mise en cache (« use cache ») et étiquetée : le back-office
 * invalide l'étiquette après chaque commit dans `contenu/` (cf. lib/contenu), et
 * une source externe peut le faire via POST /api/revalidate.
 */
export const tags = {
  bandeau: "bandeau",
  statut: "statut",
  popup: "popup",
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

/**
 * Compétitions publiées, de la plus proche à la plus lointaine.
 * L'état est calculé ici, dans le scope mis en cache : les composants n'ont
 * donc pas besoin de lire l'horloge, ce qui les garderait dynamiques.
 */
export async function getCompetitions(): Promise<CompetitionAvecEtat[]> {
  "use cache";
  cacheTag(tags.competitions);
  cacheLife("hours");

  const fiches = await lireContenu("competitions");
  const maintenant = new Date();

  return fiches
    .filter((fiche) => fiche.statut === "publie")
    .map((fiche) => avecEtat(mapperCompetition(fiche), maintenant))
    .sort((a, b) => a.dateDebut.localeCompare(b.dateDebut));
}

/** Les trois prochaines compétitions à venir, pour l'accueil. */
export async function getProchainesCompetitions(
  limite = 3,
): Promise<CompetitionAvecEtat[]> {
  "use cache";
  cacheTag(tags.competitions);
  cacheLife("hours");

  // Seules les compétitions « mises en avant » dans le back-office (par défaut).
  const competitions = (await getCompetitions()).filter((c) => c.miseEnAvant !== false);
  const aVenir = competitions.filter(
    (competition) => competition.etat.cle !== "terminee",
  );

  return (aVenir.length > 0 ? aVenir : competitions).slice(0, limite);
}

export async function getCompetition(
  slug: string,
): Promise<CompetitionAvecEtat | null> {
  "use cache";
  cacheTag(tags.competitions, `competition:${slug}`);
  cacheLife("hours");

  const competitions = await getCompetitions();
  return competitions.find((competition) => competition.slug === slug) ?? null;
}

/** Grille tarifaire publiée (contenu/tarifs.json), modifiée depuis le back-office. */
export async function getGrilleTarifs(): Promise<GrilleTarifs> {
  "use cache";
  cacheTag(tags.tarifs);
  cacheLife("days");

  return lireContenu("tarifs");
}

const jourMoisBandeau = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  timeZone: "Europe/Paris",
});

/**
 * Bandeau d'information. Une compétition « annoncée dans le bandeau » le prend
 * pendant ses inscriptions (de l'ouverture à la clôture) ; sinon, le message
 * saisi dans le back-office. Revalidé chaque heure pour suivre ces dates.
 */
export async function getBandeau(): Promise<Bandeau> {
  "use cache";
  cacheTag(tags.bandeau, tags.competitions);
  cacheLife("hours");

  const [{ bandeau }, competitions] = await Promise.all([
    lireContenu("statut"),
    getCompetitions(),
  ]);

  const annoncee = competitions.find((c) => c.annonceBandeau && c.etat.cle === "ouverte");
  if (annoncee) {
    const limite = annoncee.inscriptionCloture ?? `${annoncee.dateDebut}T12:00:00Z`;
    return {
      actif: true,
      message: `Inscriptions ouvertes : ${annoncee.nom}, jusqu'au ${jourMoisBandeau.format(new Date(limite))}`,
      lien: { label: "S'inscrire", href: `/competitions/${annoncee.slug}` },
      publieLe: bandeau.publieLe ?? undefined,
    };
  }

  return {
    actif: bandeau.actif,
    message: bandeau.message,
    lien: bandeau.lien ?? undefined,
    publieLe: bandeau.publieLe ?? undefined,
  };
}

/** Compétitions dont les résultats sont en ligne, la plus récente d'abord. */
export async function getCompetitionsAvecResultats(
  limite = 3,
): Promise<CompetitionAvecEtat[]> {
  "use cache";
  cacheTag(tags.competitions);
  cacheLife("hours");

  const competitions = await getCompetitions();

  return competitions
    .filter((competition) => competition.resultatsPublies && competition.resultatsUrl)
    .sort((a, b) => b.dateDebut.localeCompare(a.dateDebut))
    .slice(0, limite);
}

/** État des installations, dans l'ordre d'affichage (par groupe puis par ordre). */
export async function getStatutInstallations(): Promise<Installation[]> {
  "use cache";
  cacheTag(tags.statut);
  cacheLife("days");

  const { installations } = await lireContenu("statut");
  return installations.map(normaliserInstallation);
}

/**
 * Pop-up active, ou null. La période d'affichage n'est pas filtrée ici : le
 * contrôle se fait dans le navigateur, avec l'horloge du visiteur, pour que la
 * pop-up disparaisse à minuit pile et non à l'expiration du cache.
 */
export async function getPopupActive(): Promise<Popup | null> {
  "use cache";
  cacheTag(tags.popup);
  cacheLife("hours");

  const popup = await lireContenu("popup");
  return popup.actif ? mapperPopup(popup) : null;
}

export function mapperPopup(fichier: FichierPopup): Popup {
  return {
    actif: fichier.actif,
    titre: fichier.titre,
    texte: fichier.texte,
    boutonLibelle: fichier.boutonLibelle ?? undefined,
    boutonLien: fichier.boutonLien ?? undefined,
    debut: fichier.debut ?? undefined,
    fin: fichier.fin ?? undefined,
    afficheUrl: fichier.afficheUrl ?? undefined,
    version: fichier.version,
  };
}
