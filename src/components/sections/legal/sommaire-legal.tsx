"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/cn";
import { useI18n } from "@/lib/i18n/client";

/**
 * Sommaire des pages légales : suit la lecture (la rubrique visible est mise
 * en avant) et mène à chaque rubrique.
 */
export function SommaireLegal({ rubriques }: { rubriques: { id: string; libelle: string }[] }) {
  const { tr } = useI18n();
  const [active, setActive] = useState(rubriques[0]?.id ?? "");

  useEffect(() => {
    const cibles = rubriques
      .map((r) => document.getElementById(r.id))
      .filter((el): el is HTMLElement => Boolean(el));
    // Rubrique active : la dernière dont le haut a franchi le tiers de l'écran.
    const surDefilement = () => {
      const seuil = window.innerHeight / 3;
      let courante = cibles[0]?.id ?? "";
      for (const cible of cibles) if (cible.getBoundingClientRect().top <= seuil) courante = cible.id;
      setActive(courante);
    };
    surDefilement();
    window.addEventListener("scroll", surDefilement, { passive: true });
    return () => window.removeEventListener("scroll", surDefilement);
  }, [rubriques]);

  return (
    <nav aria-label={tr("Sommaire")}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-club-950">{tr("Sommaire")}</p>
      <ul className="mt-4 border-l border-encre/10">
        {rubriques.map((r) => (
          <li key={r.id}>
            <a
              href={`#${r.id}`}
              aria-current={active === r.id ? "location" : undefined}
              className={cn(
                "-ml-px block border-l-2 px-3 py-2 text-[13px] transition-colors",
                active === r.id
                  ? "border-or-500 bg-sable-100 font-medium text-club-950"
                  : "border-transparent text-encre/60 hover:text-club-950",
              )}
            >
              {r.libelle}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
