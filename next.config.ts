import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
