import type { MetadataRoute } from "next";

import { routesPubliques, site } from "@/config/site";
import { getActualites, getCompetitions } from "@/lib/api/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [actualites, competitions] = await Promise.all([
    getActualites(),
    getCompetitions(),
  ]);

  return [
    { url: site.url, changeFrequency: "weekly", priority: 1 },
    ...routesPubliques.map((item) => ({
      url: `${site.url}${item.href}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...actualites.map((article) => ({
      url: `${site.url}/actualites/${article.slug}`,
      lastModified: new Date(article.publieLe),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    ...competitions.map((competition) => ({
      url: `${site.url}/competitions/${competition.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
