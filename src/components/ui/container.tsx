import { cn } from "@/lib/cn";

/**
 * Gabarit horizontal de toutes les sections.
 *
 * 100 px de marge à gauche et à droite à partir de `lg` — en dessous, une
 * marge fixe aussi large ne laisserait presque rien au contenu. La largeur
 * totale est plafonnée à 1600 px pour que le contenu ne s'étire pas
 * indéfiniment sur les très grands écrans : au-delà, le bloc se centre et les
 * 100 px restent à l'intérieur.
 */
export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[1600px] px-5 sm:px-8 lg:px-[100px]", className)}>
      {children}
    </div>
  );
}

/**
 * Colonne de lecture (article, paragraphe centré) : la largeur est limitée par
 * `max-w`, sans les 100 px de marge des sections, qui la rendraient trop
 * étroite. Le rétrécissement vient de la largeur maximale, pas du padding.
 */
export function ContainerEtroit({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-3xl px-5 sm:px-8", className)}>
      {children}
    </div>
  );
}
