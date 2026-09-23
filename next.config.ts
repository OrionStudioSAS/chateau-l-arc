import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Modèle de cache Next 16 : « use cache » + cacheLife/cacheTag (cf. src/lib/api).
  cacheComponents: true,
  // Liens internes vérifiés à la compilation.
  typedRoutes: true,
  images: {
    // À compléter avec le domaine du CMS / de l'API quand il sera connu.
    remotePatterns: [],
  },
};

export default nextConfig;
