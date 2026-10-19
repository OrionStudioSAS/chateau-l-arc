"use client";

import { useState } from "react";

import { classeChamp } from "@/components/admin/competitions/champs";
import { IconeAdmin } from "@/components/admin/icone-admin";
import { libelleLien, liensRapides, pagesDuSite } from "@/lib/admin/popup";
import { cn } from "@/lib/cn";

export type PropositionLien = { href: string; libelle: string };

/**
 * Lien d'un bouton : pages du site proposées (et propositions propres à
 * l'écran, comme les compétitions), ou toute adresse (https, tel, mailto).
 * Hors saisie, le nom de la page s'affiche à côté du chemin.
 */
export function ChampLien({
  id,
  valeur,
  onChange,
  propositions: supplementaires = [],
  aide,
}: {
  id: string;
  valeur: string;
  onChange: (lien: string) => void;
  propositions?: PropositionLien[];
  /** Identifiant du texte d'aide (aria-describedby). */
  aide?: string;
}) {
  const [focus, setFocus] = useState(false);
  const toutes = [
    ...supplementaires,
    ...pagesDuSite.map((p) => ({ ...p, libelle: `Page ${p.libelle}` })),
    ...liensRapides,
  ];
  const libelle = supplementaires.find((p) => p.href === valeur)?.libelle ?? libelleLien(valeur);
  const prefixe = pagesDuSite.some((p) => p.href === valeur) ? "Page " : "";
  const terme = valeur.trim().toLowerCase();
  const propositions = toutes.filter(
    (p) => !terme || p.href.toLowerCase().includes(terme) || p.libelle.toLowerCase().includes(terme),
  );

  return (
    <div className="relative">
      <IconeAdmin nom="lien" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
      <input
        id={id}
        value={focus || !libelle ? valeur : `${valeur} — ${prefixe}${libelle}`}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => window.setTimeout(() => setFocus(false), 150)}
        placeholder="/une-page, https://…, tel:…"
        aria-describedby={aide}
        className={cn(classeChamp, "pl-9 pr-8")}
      />
      <IconeAdmin nom="chevronHaut" className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 rotate-180 text-neutral-400" />
      {focus && propositions.length ? (
        <ul className="absolute inset-x-0 top-full z-20 mt-1 max-h-60 overflow-y-auto rounded-lg border border-neutral-200 bg-white p-1 shadow-lg">
          {propositions.map((p) => (
            <li key={p.href}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onChange(p.href);
                  (document.activeElement as HTMLElement | null)?.blur();
                }}
                className="flex w-full items-baseline gap-2 rounded-md px-2.5 py-1.5 text-left text-[14px] hover:bg-neutral-100"
              >
                <span className="text-neutral-900">{p.libelle}</span>
                <span className="truncate text-[12px] text-neutral-400">{p.href}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
