"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/cn";
import { useI18n } from "@/lib/i18n/client";

/** Ancres des sections de la page, dans l'ordre d'affichage. */
const rubriquesTarifs = [
  { id: "green-fees", libelle: "Green fees" },
  { id: "carnets", libelle: "Carnets" },
  { id: "locations", libelle: "Locations & practice" },
  { id: "abonnements", libelle: "Abonnements" },
  { id: "avantages", libelle: "Avantages membres" },
  { id: "questions", libelle: "Questions" },
] as const;

/**
 * Bas de la bannière Tarifs : onglets d'ancrage vers chaque section (le
 * soulignement suit la section à l'écran).
 */
export function TarifsNavigation() {
  const { tr } = useI18n();
  const [active, setActive] = useState<string>(rubriquesTarifs[0].id);

  useEffect(() => {
    // Section active : la dernière dont le haut a franchi le tiers de l'écran.
    // Sections relues à chaque fois : la page peut arriver en flux, après
    // l'hydratation de la bannière.
    let demande = 0;
    const suivre = () => {
      demande = 0;
      const sections = rubriquesTarifs
        .map(({ id }) => document.getElementById(id))
        .filter((section): section is HTMLElement => section !== null);
      const repere = window.innerHeight / 3;
      const passees = sections.filter((section) => section.getBoundingClientRect().top <= repere);
      setActive((passees.at(-1) ?? sections[0])?.id ?? rubriquesTarifs[0].id);
    };
    const surDefilement = () => {
      if (!demande) demande = window.requestAnimationFrame(suivre);
    };
    window.addEventListener("scroll", surDefilement, { passive: true });

    return () => {
      window.removeEventListener("scroll", surDefilement);
      if (demande) window.cancelAnimationFrame(demande);
    };
  }, []);

  return (
    <nav aria-label={tr("Rubriques de la page")} className="sans-barre -mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
      <ul className="flex gap-6 whitespace-nowrap text-[13px] sm:gap-8">
        {rubriquesTarifs.map(({ id, libelle }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              aria-current={active === id ? "true" : undefined}
              className={cn(
                "block border-b-2 pb-2 transition-colors",
                active === id
                  ? "border-white font-medium text-white"
                  : "border-transparent text-white/70 hover:text-white",
              )}
            >
              {tr(libelle)}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
