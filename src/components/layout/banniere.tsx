import Image from "next/image";

import { cn } from "@/lib/cn";

/**
 * Bannière de haut de page, partagée par l'accueil et les pages intérieures.
 *
 * `-mt-20` fait remonter la bannière sous l'en-tête transparent (h-20) ; la
 * page concernée doit donc figurer dans `routesHeroSombre` (src/config/site.ts),
 * sinon l'en-tête resterait blanc par-dessus la photo.
 */
export function Banniere({
  image,
  accroche,
  titre,
  /**
   * Taille du titre en unités de conteneur, à recalibrer par page : elle
   * dépend du nombre de lettres pour que le titre occupe toute la largeur.
   */
  tailleTitre = "text-[11cqw]",
  /**
   * Interligne du titre. Très serré par défaut (titre sur une ligne, la boîte
   * de ligne laisserait sinon un vide proportionnel à la taille de police) ;
   * à desserrer dès que le titre tient sur plusieurs lignes.
   */
  interligneTitre = "leading-[0.72]",
  /** Titre réparti sur plusieurs lignes : les `\n` du texte sont respectés. */
  retourLigne = false,
  actions,
}: {
  image: string;
  accroche: string;
  titre: string;
  tailleTitre?: string;
  interligneTitre?: string;
  retourLigne?: boolean;
  actions?: React.ReactNode;
}) {
  return (
    <section className="relative -mt-20 flex min-h-[80vh] flex-col justify-end bg-club-950 text-white">
      <Image
        src={image}
        alt=""
        fill
        loading="eager"
        sizes="100vw"
        className="object-cover"
      />
      {/* Voile uniforme, puis dégradé plus dense en bas pour détacher le titre. */}
      <div aria-hidden="true" className="absolute inset-0 bg-black/30" />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
      />

      <div className="@container relative w-full px-6 pb-4">
        <p className="text-[20px] font-medium uppercase tracking-[-0.2px] text-white/70">
          {accroche}
        </p>

        {/*
          leading resserré : la boîte de ligne laisse un vide proportionnel à la
          taille de police, énorme sur un titre court donc très gros.

          L'ordre compte : `tailwind-merge` considère qu'une classe de taille
          (`text-[…]`) peut porter un interligne (syntaxe `text-lg/7`) et
          supprime donc tout `leading-*` qui la précède. La taille passe en
          premier, l'interligne en dernier.
        */}
        <h1
          className={cn(
            tailleTitre,
            "mt-3 font-butler font-bold uppercase tracking-[2px] text-white/70",
            retourLigne ? "whitespace-pre-line" : "whitespace-nowrap",
            // En dernier : tailwind-merge laisserait sinon la classe de taille
            // écraser l'interligne (voir le commentaire ci-dessus).
            interligneTitre,
          )}
        >
          {titre}
        </h1>

        {actions ? (
          <div className="mt-5 flex flex-wrap items-center gap-3">{actions}</div>
        ) : null}
      </div>
    </section>
  );
}
