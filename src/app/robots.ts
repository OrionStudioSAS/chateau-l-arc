import type { MetadataRoute } from "next";

import { site } from "@/config/site";

/**
 * Production : tout est ouvert sauf le back-office, l'API et l'aperçu de
 * l'éditeur visuel (?edit). Prévisualisations Vercel : rien n'est indexé.
 */
export default function robots(): MetadataRoute.Robots {
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production") {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api/", "/*?edit", "/*&edit"] },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
