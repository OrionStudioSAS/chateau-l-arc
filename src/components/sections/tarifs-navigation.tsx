"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/cn";
import { saisonDu, saisons, type CleSaison } from "@/lib/tarifs";

/** Ancres des sections de la page, dans l'ordre d'affichage. */
const rubriquesTarifs = [
  { id: "green-fees", libelle: "Green fees" },
  { id: "carnets", libelle: "Carnets" },
  { id: "locations", libelle: "Locations & practice" },
  { id: "abonnements", libelle: "Abonnements" },
  { id: "avantages", libelle: "Avantages membres" },
  { id: "questions", libelle: "Questions" },
] as const;

function Pictogramme({ saison }: { saison: CleSaison }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-3.5 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    >
      {saison === "haute" ? (
        <>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </>
      ) : (
        <path d="M12 2v20M4 6l16 12M4 18 20 6M9 3l3 3 3-3M9 21l3-3 3 3" />
      )}
    </svg>
  );
}

/**
 * Bas de la bannière Tarifs : onglets d'ancrage vers chaque section (le
 * soulignement suit la section à l'écran) et saison en cours.
 *
 * La saison dépend de la date du visiteur : elle n'est mise en avant qu'une
 * fois la page chargée, pour que le HTML prérendu reste valable toute l'année.
 */
export function TarifsNavigation() {
  const [active, setActive] = useState<string>(rubriquesTarifs[0].id);
  const [saison, setSaison] = useState<CleSaison | null>(null);

  useEffect(() => {
    // Mise à jour d'état asynchrone (après le premier rendu), pas en cascade.
    const minuteur = window.setTimeout(() => setSaison(saisonDu(new Date())), 0);

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
      window.clearTimeout(minuteur);
      window.removeEventListener("scroll", surDefilement);
      if (demande) window.cancelAnimationFrame(demande);
    };
  }, []);

  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <nav aria-label="Rubriques de la page" className="sans-barre -mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
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
                {libelle}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <p
        aria-label="Saisons"
        className="flex w-fit shrink-0 items-center gap-1 rounded-full bg-white p-1 text-[12px] sm:text-[13px]"
      >
        {(Object.keys(saisons) as CleSaison[]).map((cle) => (
          <span
            key={cle}
            aria-current={saison === cle ? "true" : undefined}
            className={cn(
              "flex items-center gap-2 rounded-full px-3 py-2 transition-colors sm:px-4",
              saison === cle ? "bg-club-950 text-sable-50" : "text-encre/70",
            )}
          >
            <Pictogramme saison={cle} />
            {saisons[cle].libelle} · {saisons[cle].periode}
            {saison === cle ? <span className="sr-only"> (saison en cours)</span> : null}
          </span>
        ))}
      </p>
    </div>
  );
}
