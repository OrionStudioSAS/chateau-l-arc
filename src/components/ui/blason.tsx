import Image from "next/image";

import { cn } from "@/lib/cn";

/**
 * Blason du club. Le fichier est clair, prévu pour un fond sombre : sur fond
 * clair, passer `sombre` pour le ramener à une silhouette foncée.
 *
 * Source : l'image 500 × 537 px contenue dans public/images/logo.svg (le SVG
 * fourni n'est qu'une enveloppe autour d'un PNG). Extraite pour que
 * next/image en serve une version légère à la bonne taille.
 */
export function Blason({
  className,
  sombre = false,
  priorite = false,
}: {
  className?: string;
  sombre?: boolean;
  /** Au-dessus de la ligne de flottaison (en-tête) : chargé sans attendre. */
  priorite?: boolean;
}) {
  return (
    <Image
      src="/images/blason.png"
      alt=""
      width={26}
      height={28}
      loading={priorite ? "eager" : "lazy"}
      className={cn(
        "h-7 w-auto shrink-0 transition-[filter] duration-300",
        sombre && "brightness-[0.25]",
        className,
      )}
    />
  );
}
