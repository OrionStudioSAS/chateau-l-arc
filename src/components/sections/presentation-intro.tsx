"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

import { ContainerEtroit } from "@/components/ui/container";
import { Surtitre } from "@/components/ui/surtitre";

/**
 * Vignettes décoratives réparties autour du texte, par rangées de deux.
 * Positions en pourcentage du bloc de texte ; masquées sous 1024 px, où elles
 * chevaucheraient le contenu. `derive` : vitesse de flottement propre à
 * chacune, pour donner de la profondeur pendant le défilement.
 */
const vignettes = [
  { cote: "gauche", rangee: 0, x: "11%", y: "-4%", image: "/images/hp-haut-gauche.png", derive: -50 },
  { cote: "gauche", rangee: 1, x: "5%", y: "38%", image: "/images/hp-milieu-gauche.png", derive: 30 },
  { cote: "gauche", rangee: 2, x: "13.5%", y: "80%", image: "/images/hp-bas-gauche.png", derive: -25 },
  { cote: "droite", rangee: 0, x: "11%", y: "-6%", image: "/images/hp-haut-droite.png", derive: 35 },
  { cote: "droite", rangee: 1, x: "5%", y: "39%", image: "/images/hp-milieu-droite.png", derive: -40 },
  { cote: "droite", rangee: 2, x: "13.5%", y: "84%", image: "/images/hp-bas-droite.png", derive: 20 },
] as const;

/** Texte de présentation, découpé en mots pour l'animation ligne par ligne. */
const TEXTE =
  "Le Château l'Arc Golf Club fait indéniablement partie des plus beaux lieux golfiques de la région Provence Alpes Côte d'Azur. Le parcours, créé en 1985 et dessiné par Robert Trent Jones II, est idéalement situé aux portes d'Aix-En-Provence et Marseille. Ce par 70 de 5817 mètres propose une expérience golfique variée grâce à son dessin qui serpente entre pins et garrigue dans un environnement d'exception puisqu'il donne une vue fantastique sur la montagne Sainte-Victoire.";

const borner = (valeur: number) => Math.min(Math.max(valeur, 0), 1);
const adoucir = (t: number) => 1 - (1 - t) ** 3;

/**
 * Introduction de l'accueil, animée au rythme du défilement (et non dans le
 * temps) : les lignes du texte apparaissent une à une à mesure qu'on descend,
 * les vignettes arrivent des côtés rangée par rangée puis flottent à des
 * vitesses différentes. En remontant, l'animation se rejoue à l'envers.
 *
 * `data-sans-revele` : la révélation générale (AnimationsDefilement) ne
 * s'applique pas ici. Sans JavaScript ou si l'utilisateur demande moins
 * d'animations, tout reste simplement affiché.
 */
export function PresentationIntro() {
  const bloc = useRef<HTMLDivElement>(null);
  const paragraphe = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const conteneur = bloc.current;
    const texte = paragraphe.current;
    if (!conteneur || !texte) return;

    const mots = [...texte.querySelectorAll<HTMLElement>("[data-mot]")];
    const cadres = [...conteneur.querySelectorAll<HTMLElement>("[data-vignette]")];

    // Lignes réelles du paragraphe, d'après la position des mots : elles
    // changent avec la largeur de l'écran, d'où le recalcul au redimensionnement.
    let lignes: HTMLElement[][] = [];
    const decouperLignes = () => {
      const parHauteur = new Map<number, HTMLElement[]>();
      for (const mot of mots) {
        const haut = mot.offsetTop;
        parHauteur.set(haut, [...(parHauteur.get(haut) ?? []), mot]);
      }
      lignes = [...parHauteur.entries()].sort(([a], [b]) => a - b).map(([, groupe]) => groupe);
    };

    let demande = 0;
    const animer = () => {
      demande = 0;
      const hauteurEcran = window.innerHeight;
      const cadreTexte = texte.getBoundingClientRect();

      // 0 quand le haut du texte atteint 90 % de l'écran, 1 quand son bas
      // passe à 65 % : tout est affiché avant d'arriver au milieu de l'écran.
      const debut = hauteurEcran * 0.9;
      const fin = hauteurEcran * 0.65 - cadreTexte.height;
      const progression = borner((debut - cadreTexte.top) / (debut - fin));

      // Chaque ligne s'anime sur 1,6 « pas », en léger chevauchement avec la suivante.
      const total = lignes.length;
      lignes.forEach((ligne, rang) => {
        const t = adoucir(borner((progression * (total + 0.6) - rang) / 1.6));
        for (const mot of ligne) {
          mot.style.opacity = String(t);
          mot.style.translate = `0 ${((1 - t) * 18).toFixed(1)}px`;
        }
      });

      // Vignettes : une rangée après l'autre, depuis l'extérieur, puis une
      // dérive continue tant que la section est à l'écran.
      const cadreBloc = conteneur.getBoundingClientRect();
      const centre = borner(
        (hauteurEcran - cadreBloc.top) / (hauteurEcran + cadreBloc.height),
      );
      cadres.forEach((cadre, index) => {
        const { cote, rangee, derive } = vignettes[index];
        const t = adoucir(borner((progression - rangee * 0.22) / 0.4));
        const sens = cote === "gauche" ? -1 : 1;
        const decalageX = (1 - t) * 90 * sens;
        const decalageY = (1 - t) * 50 + (centre - 0.5) * derive;
        cadre.style.opacity = String(t);
        cadre.style.transform = `translate(${decalageX.toFixed(1)}px, ${decalageY.toFixed(1)}px) rotate(${((1 - t) * 6 * sens).toFixed(2)}deg) scale(${(0.8 + 0.2 * t).toFixed(3)})`;
      });
    };

    const demander = () => {
      if (!demande) demande = window.requestAnimationFrame(animer);
    };
    const recalculer = () => {
      decouperLignes();
      demander();
    };

    recalculer();
    // Les polices web changent la coupure des lignes une fois chargées.
    document.fonts?.ready.then(recalculer);
    const observateur = new ResizeObserver(recalculer);
    observateur.observe(texte);
    window.addEventListener("scroll", demander, { passive: true });

    return () => {
      observateur.disconnect();
      window.removeEventListener("scroll", demander);
      if (demande) window.cancelAnimationFrame(demande);
      for (const mot of mots) {
        mot.style.removeProperty("opacity");
        mot.style.removeProperty("translate");
      }
      for (const cadre of cadres) {
        cadre.style.removeProperty("opacity");
        cadre.style.removeProperty("transform");
      }
    };
  }, []);

  return (
    <div ref={bloc} data-sans-revele className="relative">
      <div aria-hidden="true" className="absolute inset-0 hidden lg:block">
        {vignettes.map((vignette) => (
          <span
            key={`${vignette.cote}-${vignette.y}`}
            data-vignette
            className="absolute block overflow-hidden rounded-md shadow-[0_6px_18px_rgba(16,24,40,0.12)] will-change-transform"
            style={{
              top: vignette.y,
              [vignette.cote === "gauche" ? "left" : "right"]: vignette.x,
            }}
          >
            <Image
              src={vignette.image}
              alt=""
              width={135}
              height={70}
              sizes="135px"
              className="h-[70px] w-[135px] object-cover"
            />
          </span>
        ))}
      </div>

      <ContainerEtroit className="relative max-w-xl text-center">
        <Surtitre className="text-encre/70">Le plus beau golf entre Aix et Marseille</Surtitre>

        {/* Un <span> par mot : c'est leur position qui donne les lignes. */}
        <p
          ref={paragraphe}
          className="mt-10 text-[20px] font-normal leading-[1.6] tracking-[-0.2px] text-encre/85"
        >
          {TEXTE.split(" ").map((mot, index) => (
            <span key={index}>
              <span data-mot className="inline-block">
                {mot}
              </span>{" "}
            </span>
          ))}
        </p>
      </ContainerEtroit>
    </div>
  );
}
