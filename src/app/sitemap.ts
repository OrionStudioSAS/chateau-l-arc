import type { MetadataRoute } from "next";

import { site } from "@/config/site";
import { estPagePubliqueVisible } from "@/config/visibilite";
import { getCompetitions } from "@/lib/api/content";

/**
 * Pages indexées, avec leur image principale. Les pages encore en
 * construction (noindex) et les actualités de démonstration n'y figurent pas :
 * les ajouter ici quand elles auront leur contenu (et retirer leur noindex).
 */
const pages: { chemin: string; priorite: number; frequence: MetadataRoute.Sitemap[number]["changeFrequency"]; image?: string }[] = [
  { chemin: "/", priorite: 1, frequence: "weekly", image: "/og/accueil.jpg" },
  { chemin: "/le-parcours", priorite: 0.9, frequence: "monthly", image: "/og/parcours.jpg" },
  { chemin: "/tarifs", priorite: 0.9, frequence: "monthly", image: "/og/tarifs.jpg" },
  { chemin: "/academie", priorite: 0.8, frequence: "monthly", image: "/og/academie.jpg" },
  { chemin: "/competitions", priorite: 0.8, frequence: "weekly", image: "/og/competitions.jpg" },
  { chemin: "/competitions/resultats", priorite: 0.6, frequence: "weekly" },
  { chemin: "/histoire", priorite: 0.6, frequence: "yearly", image: "/og/histoire.jpg" },
  { chemin: "/faq", priorite: 0.6, frequence: "monthly" },
  { chemin: "/contact", priorite: 0.5, frequence: "yearly" },
];

const absolu = (chemin: string) => new URL(chemin, site.url).toString();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const competitions = estPagePubliqueVisible("/competitions") ? await getCompetitions() : [];

  return [
    ...pages
      .filter((page) => estPagePubliqueVisible(page.chemin))
      .map((page) => ({
        url: absolu(page.chemin),
        changeFrequency: page.frequence,
        priority: page.priorite,
        ...(page.image ? { images: [absolu(page.image)] } : {}),
      })),
    ...competitions.map((competition) => ({
      url: absolu(`/competitions/${competition.slug}`),
      changeFrequency: "weekly" as const,
      priority: 0.5,
      ...(competition.afficheUrl ? { images: [absolu(competition.afficheUrl)] } : {}),
    })),
  ];
}
