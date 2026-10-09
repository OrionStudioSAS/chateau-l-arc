import Image from "next/image";

import { cn } from "@/lib/cn";

/**
 * Bannière de haut de page, partagée par l'accueil et les pages intérieures.
 *
 * `-mt-20` fait remonter la bannière sous l'en-tête transparent (h-20) ; la
 * page concernée doit donc figurer dans `routesHeroSombre` (src/config/site.ts),
 * sinon l'en-tête resterait blanc par-dessus la photo.
 */
/** Décalage de l'animation d'arrivée, pour enchaîner les textes en cascade. */
const delaiEntree = (ms: number) => ({ "--delai": `${ms}ms` }) as React.CSSProperties;

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
  texte,
  hauteur = "min-h-[80svh]",
  actions,
}: {
  image: string;
  accroche: string;
  titre: string;
  tailleTitre?: string;
  interligneTitre?: string;
  retourLigne?: boolean;
  /** Phrase de présentation sous le titre (accueil). */
  texte?: string;
  /** Hauteur minimale : plein écran sur l'accueil, 80 % ailleurs. */
  hauteur?: string;
  actions?: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        "relative -mt-20 flex flex-col justify-end overflow-hidden bg-club-950 text-white",
        hauteur,
      )}
    >
      {/* Parallaxe (cf. AnimationsDefilement) : la photo glisse plus lentement
          que la page ; légèrement agrandie pour couvrir son déplacement. */}
      <Image
        src={image}
        alt=""
        fill
        loading="eager"
        sizes="100vw"
        className="entree-image object-cover"
        data-parallax="0.25"
        data-parallax-echelle="1.1"
      />
      {/* Voile uniforme, puis dégradé plus dense en bas pour détacher le titre. */}
      <div aria-hidden="true" className="absolute inset-0 bg-black/30" />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
      />

      <div className="@container relative w-full px-5 pb-4 sm:px-6">
        <p
          className="entree-texte max-w-3xl text-[14px] font-medium uppercase lg:max-w-none tracking-[-0.14px] text-white/70 sm:text-[17px] lg:text-[20px] lg:tracking-[-0.2px]"
          style={delaiEntree(150)}
        >
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
            "entree-texte mt-2 font-butler sm:mt-3 font-bold uppercase tracking-[2px] text-white/70",
            retourLigne ? "whitespace-pre-line" : "whitespace-nowrap",
            // En dernier : tailwind-merge laisserait sinon la classe de taille
            // écraser l'interligne (voir le commentaire ci-dessus).
            interligneTitre,
          )}
          style={delaiEntree(300)}
        >
          {titre}
        </h1>

        {texte ? (
          <p
            className="entree-texte mt-5 max-w-xl text-[16px] font-normal leading-relaxed text-white/90 sm:text-[18px]"
            style={delaiEntree(450)}
          >
            {texte}
          </p>
        ) : null}

        {actions ? (
          <div
            className="entree-texte mt-6 flex flex-wrap items-center gap-3 sm:mt-7"
            style={delaiEntree(600)}
          >
            {actions}
          </div>
        ) : null}
      </div>
    </section>
  );
}
