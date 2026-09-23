"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Logo } from "@/components/layout/logo";
import { BoutonOr } from "@/components/ui/bouton-or";
import { headerActions, headerNav, routesHeroSombre } from "@/config/site";
import { cn } from "@/lib/cn";

const lienNav =
  "whitespace-nowrap text-[12px] font-normal uppercase tracking-[-0.12px] transition-colors";

export function SiteHeader() {
  const pathname = usePathname();
  const [defile, setDefile] = useState(false);
  const [menuOuvert, setMenuOuvert] = useState(false);

  useEffect(() => {
    const surDefilement = () => setDefile(window.scrollY > 8);
    surDefilement();
    window.addEventListener("scroll", surDefilement, { passive: true });
    return () => window.removeEventListener("scroll", surDefilement);
  }, []);

  // Transparent uniquement en haut d'une page à hero sombre, menu mobile fermé.
  const transparent =
    !defile && !menuOuvert && routesHeroSombre.includes(pathname);

  return (
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
      <div className="mx-auto grid h-20 w-full max-w-[1600px] grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 sm:px-8">
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
          <Logo />
        </Link>

        <div className="col-start-3 flex items-center justify-self-end lg:gap-4 xl:gap-5">
          <Link
            href={headerActions.info.href}
            className={cn(
              lienNav,
              "mr-4 hidden wide:inline",
              transparent ? "text-white" : "text-encre",
            )}
          >
            {headerActions.info.label}
          </Link>
          <Link
            href={headerActions.membre.href}
            className="hidden whitespace-nowrap rounded-sm bg-sable-100 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-club-950 transition-colors hover:bg-white lg:inline-block xl:px-5"
          >
            {headerActions.membre.label}
          </Link>
          <BoutonOr
            href={headerActions.reservation.href}
            className="hidden lg:inline-flex"
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
          className="border-t border-club-950/10 bg-white text-encre lg:hidden"
        >
          <div className="mx-auto w-full max-w-[1600px] px-5 py-4 sm:px-8">
            <ul className="flex flex-col">
              {headerNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMenuOuvert(false)}
                    className="block border-b border-club-950/5 py-3 text-sm uppercase tracking-[0.14em] text-encre/80"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href={headerActions.info.href}
                  onClick={() => setMenuOuvert(false)}
                  className="block border-b border-club-950/5 py-3 text-sm uppercase tracking-[0.14em] text-encre/80"
                >
                  {headerActions.info.label}
                </Link>
              </li>
            </ul>
            <div className="mt-5 flex flex-col gap-3">
              <Link
                href={headerActions.membre.href}
                onClick={() => setMenuOuvert(false)}
                className="rounded-sm bg-sable-100 px-5 py-3 text-center text-xs font-semibold uppercase tracking-[0.14em] text-club-950"
              >
                {headerActions.membre.label}
              </Link>
              <BoutonOr
                href={headerActions.reservation.href}
                className="justify-center"
              >
                {headerActions.reservation.label}
              </BoutonOr>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
