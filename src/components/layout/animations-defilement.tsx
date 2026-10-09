"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/** Décalage entre deux éléments révélés ensemble, et plafond du cumul. */
const PAS_DELAI = 80;
const DELAI_MAX = 400;
/** Décélération longue et douce (même courbe que --ease-douce). */
const COURBE = "cubic-bezier(0.22, 1, 0.36, 1)";
/** Amplitude de référence de la parallaxe, en pixels. */
const AMPLITUDE = 400;

const mouvementReduit = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Défilement fluide (Lenis) et animations au défilement du site public :
 *
 * - textes, cartes et boutons montent en fondu quand ils entrent à l'écran,
 *   en cascade quand plusieurs arrivent ensemble ;
 * - les photos se dévoilent avec un léger dézoom ;
 * - les images marquées `data-parallax` glissent plus lentement que la page.
 *
 * Tout passe par l'API Web Animations : rien n'est écrit dans le HTML, donc
 * pas de conflit avec l'hydratation de React, et chaque animation est annulée
 * une fois jouée (l'élément retrouve ses propres transitions de survol).
 * Sans JavaScript, ou si l'utilisateur demande moins d'animations, le contenu
 * s'affiche simplement. Ce qui est déjà visible au chargement n'est pas
 * masqué, pour éviter tout clignotement.
 */
export function AnimationsDefilement() {
  const pathname = usePathname();
  const lenis = useRef<Lenis | null>(null);

  // Défilement fluide : une seule instance pour toute la navigation.
  useEffect(() => {
    if (mouvementReduit()) return;

    const instance = new Lenis({
      autoRaf: true,
      lerp: 0.09,
      // Carrousels, menus et pop-up gardent leur défilement natif.
      allowNestedScroll: true,
      anchors: { offset: -100 },
      stopInertiaOnNavigate: true,
    });
    lenis.current = instance;

    // Page bloquée (menu mobile ouvert : overflow hidden sur <html>) : Lenis
    // se met en pause, sinon la molette s'accumulerait et ferait sauter la
    // page à la fermeture. L'option `autoToggle` de Lenis repose sur un
    // événement de transition qui ne se déclenche pas toujours.
    const racine = document.documentElement;
    const suivreBlocage = () => {
      if (racine.style.overflow === "hidden") instance.stop();
      else instance.start();
    };
    const observateur = new MutationObserver(suivreBlocage);
    observateur.observe(racine, { attributes: true, attributeFilter: ["style"] });

    return () => {
      observateur.disconnect();
      instance.destroy();
      lenis.current = null;
    };
  }, []);

  // Révélations et parallaxe, recalculées à chaque page.
  useEffect(() => {
    if (mouvementReduit()) return;

    lenis.current?.resize();

    const main = document.getElementById("contenu");
    if (!main) return;

    const hauteurEcran = window.innerHeight;
    const sousLaLigne = (element: Element) =>
      element.getBoundingClientRect().top > hauteurEcran * 0.92;

    // Unités animées : chaque carte de liste, puis les textes et actions
    // hors listes. Un élément contenu dans une autre unité suit son parent.
    const unites = new Set<HTMLElement>();
    main.querySelectorAll<HTMLElement>("section li").forEach((li) => {
      if (!li.parentElement?.closest("li")) unites.add(li);
    });
    main
      .querySelectorAll<HTMLElement>(
        "section :is(h1, h2, h3, p, blockquote, dl, figure, a, button, iframe)",
      )
      .forEach((element) => {
        if (!element.closest("li")) unites.add(element);
      });

    // Blocs qui gèrent leur propre animation (cf. PresentationIntro).
    const animationPropre = (element: Element) => element.closest("[data-sans-revele]") !== null;

    const contenuDansUneUnite = (element: HTMLElement) => {
      for (let parent = element.parentElement; parent && parent !== main; parent = parent.parentElement) {
        if (unites.has(parent)) return true;
      }
      return false;
    };

    const textes = [...unites].filter(
      (element) =>
        !contenuDansUneUnite(element) && !animationPropre(element) && sousLaLigne(element),
    );

    const images = [...main.querySelectorAll<HTMLImageElement>("section img")].filter(
      (image) =>
        !image.hasAttribute("data-parallax") &&
        !animationPropre(image) &&
        !image.classList.contains("object-contain") &&
        image.getBoundingClientRect().width > 80 &&
        sousLaLigne(image),
    );

    // Chaque élément démarre figé sur son état caché (première image clé),
    // jusqu'à son entrée à l'écran.
    const revelations = new Map<Element, Animation>();
    const preparer = (element: Element, etapes: Keyframe[], duree: number) => {
      const animation = element.animate(etapes, { duration: duree, easing: COURBE, fill: "both" });
      animation.pause();
      revelations.set(element, animation);
    };
    textes.forEach((element) =>
      preparer(element, [{ opacity: 0, translate: "0 32px" }, { opacity: 1, translate: "0 0" }], 900),
    );
    images.forEach((image) =>
      preparer(image, [{ opacity: 0, scale: 1.12 }, { opacity: 1, scale: 1 }], 1500),
    );

    const observateur = new IntersectionObserver(
      (entrees) => {
        const entrantes = entrees
          .filter((entree) => entree.isIntersecting)
          .map((entree) => entree.target)
          .sort((a, b) =>
            a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
          );

        entrantes.forEach((element, rang) => {
          observateur.unobserve(element);
          const animation = revelations.get(element);
          if (!animation) return;

          animation.effect?.updateTiming({ delay: Math.min(rang * PAS_DELAI, DELAI_MAX) });
          animation.onfinish = () => animation.cancel();
          animation.play();
        });
      },
      { rootMargin: "0px 0px -8% 0px" },
    );

    revelations.forEach((_, element) => observateur.observe(element));

    // Parallaxe : l'image glisse d'une fraction de la distance au centre de
    // l'écran, agrandie juste assez pour ne jamais laisser de bord vide. Une
    // animation en pause dont on règle la position à chaque défilement.
    const parallaxes = [...document.querySelectorAll<HTMLElement>("[data-parallax]")].map(
      (element) => {
        const echelle = Number(element.dataset.parallaxEchelle ?? 1.2);
        const animation = element.animate(
          [
            { translate: `0 ${-AMPLITUDE}px`, scale: echelle },
            { translate: `0 ${AMPLITUDE}px`, scale: echelle },
          ],
          { duration: 1000, fill: "both" },
        );
        animation.pause();
        return { element, animation, force: Number(element.dataset.parallax) || 0.07 };
      },
    );

    let demande = 0;
    const appliquerParallaxe = () => {
      demande = 0;
      const milieu = window.innerHeight / 2;
      for (const { element, animation, force } of parallaxes) {
        const cadre = element.parentElement?.getBoundingClientRect();
        if (!cadre || cadre.bottom < 0 || cadre.top > window.innerHeight) continue;
        const decalage = (milieu - (cadre.top + cadre.height / 2)) * force;
        const position = Math.min(Math.max((decalage + AMPLITUDE) / (2 * AMPLITUDE), 0), 1);
        animation.currentTime = position * 1000;
      }
    };
    const surDefilement = () => {
      if (!demande) demande = window.requestAnimationFrame(appliquerParallaxe);
    };

    appliquerParallaxe();
    window.addEventListener("scroll", surDefilement, { passive: true });
    window.addEventListener("resize", surDefilement);

    return () => {
      observateur.disconnect();
      window.removeEventListener("scroll", surDefilement);
      window.removeEventListener("resize", surDefilement);
      if (demande) window.cancelAnimationFrame(demande);
      revelations.forEach((animation) => animation.cancel());
      parallaxes.forEach(({ animation }) => animation.cancel());
    };
  }, [pathname]);

  return null;
}
