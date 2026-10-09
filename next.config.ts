import type { NextConfig } from "next";

import { pagesPubliquesMasquees } from "./src/config/visibilite";

const nextConfig: NextConfig = {
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
  images: {
    // Versions WebP générées à la compilation (scripts/optimiser-images.mjs) :
    // le service d'optimisation de Vercel est soumis à un quota mensuel.
    loader: "custom",
    loaderFile: "./src/lib/chargeur-images.ts",
  },
};

export default nextConfig;
