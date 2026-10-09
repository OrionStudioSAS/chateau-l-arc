import Image from "next/image";

import { cn } from "@/lib/cn";

/**
 * Blason du club. Le fichier est clair, prévu pour un fond sombre : sur fond
 * clair, passer `sombre` pour le ramener à une silhouette foncée.
 *
 * Source : l'image contenue dans public/images/logo.svg (le SVG fourni n'est
 * qu'une enveloppe autour d'un PNG 500 × 537 px), réduite à 104 × 112 px,
 * soit 4× la taille affichée : nette sur tous les écrans, et servie telle
 * quelle, sans passer par l'optimiseur d'images.
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
      unoptimized
      loading={priorite ? "eager" : "lazy"}
      className={cn(
        "h-7 w-auto shrink-0 transition-[filter] duration-300",
        sombre && "brightness-[0.25]",
        className,
      )}
    />
  );
}
