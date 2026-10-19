import Image from "next/image";
import { Lien as Link } from "@/components/ui/lien";

import { Editable } from "@/components/cms/editable";
import { cn } from "@/lib/cn";
import { i18n } from "@/lib/i18n/serveur";
import { JsonLd, jsonLdFilAriane } from "@/lib/seo";
import { TAILLE_PLEINE_LARGEUR, variablesPleineLargeur } from "@/lib/titre-pleine-largeur";

/**
 * Bannière de haut de page, partagée par l'accueil et les pages intérieures.
 *
 * `-mt-20` fait remonter la bannière sous l'en-tête transparent (h-20) ; la
 * page concernée doit donc figurer dans `routesHeroSombre` (src/config/site.ts),
 * sinon l'en-tête resterait blanc par-dessus la photo.
 */
/** Décalage de l'animation d'arrivée, pour enchaîner les textes en cascade. */
const delaiEntree = (ms: number) => ({ "--delai": `${ms}ms` }) as React.CSSProperties;

export async function Banniere({
  image,
  imageAlt = "",
  accroche,
  titre,
  /**
   * Taille du titre : 11 % de la largeur, réduite si le titre est long pour
   * qu'il tienne toujours sur sa ligne (le texte est modifiable dans le
   * back-office).
   */
  tailleTitre = TAILLE_PLEINE_LARGEUR,
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
  filAriane,
  actions,
  pied,
  encart,
  cmsPaths,
}: {
  image: string;
  /** Description de la photo (référencement des images, lecteurs d'écran). */
  imageAlt?: string;
  /** Ligne au-dessus du titre (facultative). */
  accroche?: string;
  titre: string;
  tailleTitre?: string;
  interligneTitre?: string;
  retourLigne?: boolean;
  /** Phrase de présentation sous le titre (accueil). */
  texte?: string;
  /** Hauteur minimale : plein écran sur l'accueil, 80 % ailleurs. */
  hauteur?: string;
  /** Fil d'Ariane sous l'en-tête ; le dernier élément est la page courante. */
  filAriane?: { label: string; href?: string }[];
  actions?: React.ReactNode;
  /** Rangée pleine largeur sous le texte (onglets de la page Tarifs…). */
  pied?: React.ReactNode;
  /** Bloc calé en bas à droite à partir de 1024 px, sous le texte avant (coordonnées de la page Contact). */
  encart?: React.ReactNode;
  cmsPaths?: { accroche?: string; titre?: string; texte?: string; image?: string };
}) {
  const { tr, lien } = await i18n();
  // Fil d'Ariane : libellés et adresses dans la langue de la page.
  const etapes = filAriane?.map((etape) => ({
    label: tr(etape.label),
    href: etape.href ? lien(etape.href) : undefined,
  }));
  return (
    <section
      className={cn(
        "relative -mt-20 flex flex-col justify-end overflow-hidden bg-club-950 text-white",
        hauteur,
      )}
    >
      {/* Parallaxe (cf. AnimationsDefilement) : la photo glisse plus lentement
          que la page ; légèrement agrandie pour couvrir son déplacement. */}
      <Editable path={cmsPaths?.image ?? ""} image as="div" className="absolute inset-0">
        <Image
          src={image}
          alt={tr(imageAlt)}
          fill
          loading="eager"
          // Élément le plus grand de la page (LCP) : chargé en priorité.
          fetchPriority="high"
          sizes="100vw"
          className="entree-image object-cover"
          data-parallax="0.25"
          data-parallax-echelle="1.1"
        />
      </Editable>
      {/* Voile uniforme, puis dégradé plus dense en bas pour détacher le titre.
          Sans clic : dans l'éditeur visuel, un clic sur le fond vise la photo. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-black/30" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
      />

      {etapes ? <JsonLd donnees={jsonLdFilAriane(etapes)} /> : null}
      {filAriane ? (
        <nav
          aria-label={tr("Fil d'Ariane")}
          className="absolute inset-x-0 top-[88px] px-5 text-[13px] text-white/70 sm:px-8 xl:px-10"
        >
          <ol className="flex flex-wrap items-center gap-2">
            {(etapes ?? []).map((etape, index) => (
              <li key={etape.label} className="flex items-center gap-2">
                {index > 0 ? <span aria-hidden="true">›</span> : null}
                {etape.href ? (
                  <Link href={etape.href} className="transition-colors hover:text-white">
                    {etape.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="font-medium text-white">
                    {etape.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      ) : null}

      <div className="@container relative w-full px-5 pb-4 sm:px-6">
        {accroche ? (
          <Editable path={cmsPaths?.accroche ?? ""} as="p"
            className="entree-texte max-w-3xl text-[14px] font-medium uppercase lg:max-w-none tracking-[-0.14px] text-white/70 sm:text-[17px] lg:text-[20px] lg:tracking-[-0.2px]"
            style={delaiEntree(150)}
          >
            {accroche}
          </Editable>
        ) : null}

        {/*
          leading resserré : la boîte de ligne laisse un vide proportionnel à la
          taille de police, énorme sur un titre court donc très gros.

          L'ordre compte : `tailwind-merge` considère qu'une classe de taille
          (`text-[…]`) peut porter un interligne (syntaxe `text-lg/7`) et
          supprime donc tout `leading-*` qui la précède. La taille passe en
          premier, l'interligne en dernier.
        */}
        <Editable path={cmsPaths?.titre ?? ""} as="h1"
          className={cn(
            tailleTitre,
            "entree-texte mt-2 font-butler sm:mt-3 font-bold uppercase tracking-[2px] text-white/70",
            retourLigne ? "whitespace-pre-line" : "whitespace-nowrap",
            // En dernier : tailwind-merge laisserait sinon la classe de taille
            // écraser l'interligne (voir le commentaire ci-dessus).
            interligneTitre,
          )}
          style={{
            ...delaiEntree(300),
            ...variablesPleineLargeur(titre),
          }}
        >
          {titre}
        </Editable>

        {texte ? (
          <Editable path={cmsPaths?.texte ?? ""} as="p"
            className="entree-texte mt-5 max-w-xl text-[16px] font-normal leading-relaxed text-white/90 sm:text-[18px]"
            style={delaiEntree(450)}
          >
            {texte}
          </Editable>
        ) : null}

        {actions ? (
          <div
            className="entree-texte mt-6 flex flex-wrap items-center gap-3 sm:mt-7"
            style={delaiEntree(600)}
          >
            {actions}
          </div>
        ) : null}

        {pied ? (
          <div className="entree-texte mt-8 pb-2 sm:mt-10" style={delaiEntree(600)}>
            {pied}
          </div>
        ) : null}

        {encart ? (
          <div
            className="entree-texte mt-6 pb-2 lg:absolute lg:bottom-6 lg:right-6 lg:mt-0 lg:pb-0"
            style={delaiEntree(600)}
          >
            {encart}
          </div>
        ) : null}
      </div>
    </section>
  );
}
