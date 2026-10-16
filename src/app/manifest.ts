import type { MetadataRoute } from "next";

import { site } from "@/config/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.nomMarque,
    short_name: site.shortName,
    description: site.description,
    lang: "fr-FR",
    start_url: "/",
    display: "standalone",
    background_color: "#f9f6f0",
    theme_color: "#0f2a1d",
    icons: [
      { src: "/icons/icone-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icone-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
