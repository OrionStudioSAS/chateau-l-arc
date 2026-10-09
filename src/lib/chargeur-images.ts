"use client";

import { LARGEURS_IMAGES } from "@/lib/images-optimisees";

/**
 * Chargeur de next/image : sert les versions WebP générées à la compilation
 * (scripts/optimiser-images.mjs) au lieu du service d'optimisation de
 * Vercel, soumis à un quota mensuel. Pour une largeur demandée, on prend la
 * plus petite version qui la couvre.
 *
 * Les SVG et les images hors de /images/ sont servis tels quels.
 */
export default function chargeurImages({ src, width }: { src: string; width: number }): string {
  if (!src.startsWith("/images/") || src.endsWith(".svg")) return src;

  const largeur = LARGEURS_IMAGES.find((candidate) => candidate >= width) ?? LARGEURS_IMAGES.at(-1);
  const nom = src.slice("/images/".length).replace(/\.[a-z0-9]+$/i, "");
  return `/optimise/${nom}-${largeur}.webp`;
}
