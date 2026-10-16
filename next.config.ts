import type { NextConfig } from "next";

import { redirections } from "./src/config/redirections";
import { DOMAINE_CANONIQUE } from "./src/config/site";
import { pagesPubliquesMasquees } from "./src/config/visibilite";

const HOTE_CANONIQUE = new URL(DOMAINE_CANONIQUE).host;

const nextConfig: NextConfig = {
  // Le « / » final est traité ci-dessous, en un seul saut (sinon : 308 de Next, puis 301).
  skipTrailingSlashRedirect: true,
  // Ancien site → nouveau : vrais 301 (Next utilise 308 par défaut), cf. src/config/redirections.ts.
  async redirects() {
    const anciennes = redirections.flatMap((redirection) =>
      // Les anciennes URL existaient souvent avec un « / » final : les deux formes sont couvertes.
      redirection.source.endsWith("*")
        ? [
            redirection,
            { ...redirection, source: `${redirection.source}/` },
            { ...redirection, source: `${redirection.source.replace(/\/:chemin\*$/, "")}/` },
          ]
        : [redirection, { ...redirection, source: `${redirection.source}/` }],
    );
    return [
      ...anciennes.map((redirection) => ({ ...redirection, statusCode: 301 })),
      // Toute autre URL avec « / » final → sans, comme le veut le site (une seule version indexée).
      { source: "/:chemin+/", destination: "/:chemin+", statusCode: 301 },
    ];
  },
  async headers() {
    return [
      // Hors du domaine officiel (prévisualisations, *.vercel.app) : jamais indexé.
      {
        source: "/:chemin*",
        missing: [{ type: "host", value: HOTE_CANONIQUE }],
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      { source: "/admin/:chemin*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
      // Images de partage et icônes : fichiers stables, longue mise en cache.
      { source: "/og/:fichier*", headers: [{ key: "Cache-Control", value: "public, max-age=604800" }] },
    ];
  },
  async rewrites() {
    return {
      // Avant les pages existantes : servir la 404 en conservant l'URL demandee.
      beforeFiles: pagesPubliquesMasquees.map((route) => ({
        source: `${route}/:path*`,
        destination: "/404",
      })),
    };
  },
  // Modèle de cache Next 16 : « use cache » + cacheLife/cacheTag (cf. src/lib/api).
  cacheComponents: true,
  // Liens internes vérifiés à la compilation.
  typedRoutes: true,
  experimental: {
    serverActions: {
      // PDF de résultats et affiches (4 Mo max, cf. lib/admin) + marge du formulaire.
      bodySizeLimit: "4.5mb",
    },
  },
  images: {
    // Versions WebP générées à la compilation (scripts/optimiser-images.mjs) :
    // le service d'optimisation de Vercel est soumis à un quota mensuel.
    loader: "custom",
    loaderFile: "./src/lib/chargeur-images.ts",
  },
};

export default nextConfig;
