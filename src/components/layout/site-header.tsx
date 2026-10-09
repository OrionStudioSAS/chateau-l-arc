"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Logo } from "@/components/layout/logo";
import {
  PanneauStatut,
  PastilleStatut,
  libelleBoutonStatut,
} from "@/components/layout/panneau-statut";
import { BoutonClair } from "@/components/ui/bouton-clair";
import { BoutonOr } from "@/components/ui/bouton-or";
import { headerActions, headerNav, routesHeroSombre, site } from "@/config/site";
import { cn } from "@/lib/cn";
import type { Installation } from "@/lib/api/types";
import type { Meteo } from "@/lib/meteo";

/** Boutons de l'en-tête, plus compacts que ceux des sections (maquette). */
const boutonEnTete = "px-3 py-2.5 text-[12px] font-medium tracking-[-0.12px] xl:px-3.5";

const lienNav =
  "whitespace-nowrap text-[12px] font-normal uppercase tracking-[-0.12px] transition-colors";

const telephone = site.contact.telephoneLien;

export function SiteHeader({
  statut,
  meteo,
}: {
  statut: Installation[];
  meteo: Meteo | null;
}) {
  const pathname = usePathname();
  const [defile, setDefile] = useState(false);
  const [menuOuvert, setMenuOuvert] = useState(false);
  const [infosOuvertes, setInfosOuvertes] = useState(false);
  const zoneInfos = useRef<HTMLDivElement>(null);

  // Le panneau d'informations se referme au clic à l'extérieur et sur Échap.
  useEffect(() => {
    if (!infosOuvertes) return;

    const surClic = (evenement: MouseEvent) => {
      if (!zoneInfos.current?.contains(evenement.target as Node)) {
        setInfosOuvertes(false);
      }
    };
    const surTouche = (evenement: KeyboardEvent) => {
      if (evenement.key === "Escape") setInfosOuvertes(false);
    };

    document.addEventListener("mousedown", surClic);
    document.addEventListener("keydown", surTouche);
    return () => {
      document.removeEventListener("mousedown", surClic);
      document.removeEventListener("keydown", surTouche);
    };
  }, [infosOuvertes]);

  // Changement de page : le panneau ne doit pas rester ouvert. Ajusté pendant
  // le rendu plutôt que dans un effet, pour éviter un rendu en cascade.
  const [cheminPrecedent, setCheminPrecedent] = useState(pathname);
  if (pathname !== cheminPrecedent) {
    setCheminPrecedent(pathname);
    setInfosOuvertes(false);
    setMenuOuvert(false);
  }

  // Menu mobile ouvert : la page derrière ne défile plus, Échap le referme,
  // et il se ferme de lui-même si la fenêtre passe en affichage bureau.
  useEffect(() => {
    if (!menuOuvert) return;

    const racine = document.documentElement;
    const debordement = racine.style.overflow;
    racine.style.overflow = "hidden";

    const surTouche = (evenement: KeyboardEvent) => {
      if (evenement.key === "Escape") setMenuOuvert(false);
    };
    const bureau = window.matchMedia("(min-width: 1024px)");
    const surBureau = (evenement: MediaQueryListEvent) => {
      if (evenement.matches) setMenuOuvert(false);
    };

    document.addEventListener("keydown", surTouche);
    bureau.addEventListener("change", surBureau);
    return () => {
      racine.style.overflow = debordement;
      document.removeEventListener("keydown", surTouche);
      bureau.removeEventListener("change", surBureau);
    };
  }, [menuOuvert]);

  useEffect(() => {
    const surDefilement = () => setDefile(window.scrollY > 8);
    surDefilement();
    window.addEventListener("scroll", surDefilement, { passive: true });
    return () => window.removeEventListener("scroll", surDefilement);
  }, []);

  const boutonStatut = libelleBoutonStatut(statut);

  // Transparent uniquement en haut d'une page à hero sombre, menu mobile fermé.
  const transparent =
    !defile && !menuOuvert && routesHeroSombre.includes(pathname);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 transition-colors duration-300",
          transparent
            ? "bg-transparent text-sable-50"
            : "border-b border-club-950/10 bg-white text-encre",
        )}
      >
        {/* Grille en trois colonnes : le logo reste centré sans recouvrir les
            liens, quelle que soit la largeur des blocs latéraux. */}
        <div className="mx-auto grid h-20 w-full max-w-[1600px] grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 sm:px-8 xl:px-10">
          <nav aria-label="Navigation principale" className="hidden lg:block">
            <ul className="flex items-center gap-4 xl:gap-8">
              {headerNav.map((item) => {
                const actif =
                  pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={actif ? "page" : undefined}
                      className={cn(
                        lienNav,
                        transparent ? "text-white" : "text-encre",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <Link
            href="/"
            aria-label="Accueil"
            onClick={() => setMenuOuvert(false)}
            // col-start explicite : la nav masquée sort de la grille en mobile.
            className="col-start-2 justify-self-center"
          >
            <Logo sombre={!transparent} />
          </Link>

          <div className="col-start-3 flex items-center justify-self-end lg:gap-2.5">
            {/* Panneau déroulant (motif « disclosure ») : il présente un état,
                pas des actions, d'où un bouton + région plutôt qu'un role="menu". */}
            {/* h-20 : la zone occupe toute la hauteur de l'en-tête, pour que le
                panneau (top-full) parte exactement de son bord inférieur. */}
            <div ref={zoneInfos} className="relative mr-3.5 hidden h-20 items-center wide:flex">
              <button
                type="button"
                aria-expanded={infosOuvertes}
                aria-controls="infos-parcours"
                onClick={() => setInfosOuvertes((ouvert) => !ouvert)}
                className={cn(
                  "flex items-center gap-2.5 whitespace-nowrap rounded-full border py-2 pl-4 pr-3.5 text-[14px] font-medium transition-colors",
                  transparent
                    ? "border-white/25 bg-club-950/30 text-white backdrop-blur-sm hover:bg-club-950/45"
                    : "border-club-950/15 bg-white text-encre hover:bg-sable-50",
                )}
              >
                {boutonStatut.ouvert !== null ? (
                  <PastilleStatut actif={boutonStatut.ouvert} />
                ) : null}
                {boutonStatut.texte}
                <svg
                  aria-hidden="true"
                  viewBox="0 0 12 12"
                  className={cn(
                    "size-3 transition-transform duration-200",
                    infosOuvertes && "rotate-180",
                  )}
                >
                  <path
                    d="M2 4l4 4 4-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {infosOuvertes ? (
                <div
                  id="infos-parcours"
                  role="region"
                  aria-label="Aujourd'hui au golf"
                  // Verre dépoli : la photo reste visible à travers. Sur l'en-tête
                  // blanc (page défilée), voile plus sombre pour garder le texte
                  // blanc lisible au-dessus d'un contenu clair.
                  className={cn(
                    "absolute left-0 top-full w-[360px] rounded-b-lg border border-t-0 border-white/15 text-white shadow-[0_18px_40px_rgba(16,24,40,0.25)] backdrop-blur-xl",
                    transparent ? "bg-black/20" : "bg-encre/70",
                  )}
                >
                  <PanneauStatut installations={statut} meteo={meteo} />
                </div>
              ) : null}
            </div>

            <a
              href={telephone}
              aria-label={`Appeler le golf au ${site.contact.telephone}`}
              className={cn(
                "mr-3.5 hidden size-9 items-center justify-center rounded-full border transition-colors xl:flex",
                transparent
                  ? "border-white/40 text-white hover:bg-white/10"
                  : "border-club-950/20 text-encre hover:bg-sable-50",
              )}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="size-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              >
                <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
              </svg>
            </a>

            <BoutonClair
              href={headerActions.membre.href}
              // Blanc sur la photo, sable sur l'en-tête blanc pour rester visible.
              className={cn(
                boutonEnTete,
                "hidden lg:inline-flex",
                transparent ? "bg-white hover:bg-sable-100" : "bg-sable-100 hover:bg-sable-50",
              )}
            >
              {headerActions.membre.label}
            </BoutonClair>
            <BoutonOr
              href={headerActions.reservation.href}
              className={cn(boutonEnTete, "hidden lg:inline-flex")}
            >
              {headerActions.reservation.label}
            </BoutonOr>

            <button
              type="button"
              aria-expanded={menuOuvert}
              aria-controls="menu-mobile"
              onClick={() => setMenuOuvert((ouvert) => !ouvert)}
              className={cn(
                "rounded-full border px-4 py-2 text-xs uppercase tracking-[0.14em] lg:hidden",
                transparent ? "border-sable-50/40" : "border-club-950/15",
              )}
            >
              {menuOuvert ? "Fermer" : "Menu"}
            </button>
          </div>
        </div>

        {menuOuvert ? (
          <div
            id="menu-mobile"
            // Hauteur bornée à l'écran : le menu défile lui-même sur les petits
            // téléphones en paysage, la page étant bloquée derrière.
            className="max-h-[calc(100dvh-5rem)] overflow-y-auto overscroll-contain border-t border-club-950/10 bg-white text-encre lg:hidden"
          >
            <div className="mx-auto w-full max-w-[1600px] px-5 pb-8 pt-2 sm:px-8">
              <ul className="flex flex-col">
                {headerNav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMenuOuvert(false)}
                      className="block border-b border-club-950/10 py-4 text-[14px] uppercase tracking-[0.14em] text-encre"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <a
                    href={telephone}
                    className="block border-b border-club-950/10 py-4 text-[14px] uppercase tracking-[0.14em] text-encre"
                  >
                    Nous appeler
                  </a>
                </li>
                <li>
                  <Link
                    href={headerActions.info.href}
                    onClick={() => setMenuOuvert(false)}
                    className="block border-b border-club-950/10 py-4 text-[14px] uppercase tracking-[0.14em] text-encre"
                  >
                    {headerActions.info.label}
                  </Link>
                </li>
              </ul>
              <div className="mt-6 flex flex-col gap-3">
                <BoutonClair
                  href={headerActions.membre.href}
                  // Fond sable sur blanc : un filet pour que le bouton se détache.
                  className="justify-center border border-club-950/10 py-4"
                >
                  {headerActions.membre.label}
                </BoutonClair>
                <BoutonOr
                  href={headerActions.reservation.href}
                  className="justify-center py-4"
                >
                  {headerActions.reservation.label}
                </BoutonOr>
              </div>
            </div>
          </div>
        ) : null}
      </header>

      {/* Voile sous le menu mobile : assombrit la page et referme au toucher. */}
      {menuOuvert ? (
        <div
          aria-hidden="true"
          onClick={() => setMenuOuvert(false)}
          className="fixed inset-0 z-40 bg-club-950/40 lg:hidden"
        />
      ) : null}
    </>
  );
}
