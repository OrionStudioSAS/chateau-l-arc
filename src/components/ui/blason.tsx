import Image from "next/image";

import { cn } from "@/lib/cn";

/**
 * Blason du club. Le fichier est clair, prévu pour un fond sombre : sur fond
 * clair, passer `sombre` pour le ramener à une silhouette foncée.
 *
 * TODO : le PNG fourni ne fait que 38 × 28 px, un peu flou sur écran Retina.
 * Le remplacer par un SVG (ou un PNG au moins 4× plus grand) dès que possible.
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
      src="/images/logo.png"
      alt=""
      width={38}
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
