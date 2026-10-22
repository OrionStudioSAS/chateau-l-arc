"use client";

import { useEffect, useRef, useState } from "react";

import { libelleBoutonStatut, libelleMiseAJour } from "@/components/layout/panneau-statut";
import { site, urlReservation } from "@/config/site";
import { cn } from "@/lib/cn";
import type { Installation } from "@/lib/api/types";
import { useI18n } from "@/lib/i18n/client";

const traits = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" } as const;

function Fleche() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="mt-1 size-4 shrink-0 text-encre/50 transition-transform group-hover:translate-x-0.5" {...traits}>
      <path d="M5 12h14m-5-5 5 5-5 5" />
    </svg>
  );
}

/**
 * « Réserver un départ » de l'en-tête (maquette) : un menu déroulant propose
 * la réservation en ligne (nouvel onglet) ou par téléphone, avec l'état du
 * parcours en pied.
 */
export function MenuReservation({ statut, className }: { statut: Installation[]; className?: string }) {
  const { tr, locale } = useI18n();
  const [ouvert, setOuvert] = useState(false);
  const zone = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ouvert) return;
    const surClic = (e: MouseEvent) => {
      if (!zone.current?.contains(e.target as Node)) setOuvert(false);
    };
    const surTouche = (e: KeyboardEvent) => e.key === "Escape" && setOuvert(false);
    document.addEventListener("mousedown", surClic);
    document.addEventListener("keydown", surTouche);
    return () => {
      document.removeEventListener("mousedown", surClic);
      document.removeEventListener("keydown", surTouche);
    };
  }, [ouvert]);

  // Pied du menu, rendu à l'ouverture (côté navigateur : heure du visiteur).
  const etat = libelleBoutonStatut(statut, tr);
  const miseAJour = ouvert ? libelleMiseAJour(statut, tr, locale) : null;

  return (
    <div ref={zone} className={cn("relative", className)}>
      <button
        type="button"
        aria-expanded={ouvert}
        aria-controls="menu-reservation"
        onClick={() => setOuvert((v) => !v)}
        className="inline-flex items-center gap-2 whitespace-nowrap rounded-sm bg-or-500 px-3 py-2.5 text-[12px] font-medium tracking-[-0.12px] text-white uppercase transition-colors hover:bg-or-600 xl:px-3.5"
      >
        {tr("Réserver un départ")}
        <svg aria-hidden="true" viewBox="0 0 12 12" className={cn("size-3 transition-transform duration-200", ouvert && "rotate-180")}>
          <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {ouvert ? (
        <div
          id="menu-reservation"
          className="absolute right-0 top-full z-20 mt-2.5 w-[370px] rounded-md border border-club-950/10 bg-white p-2 text-encre shadow-[0_18px_40px_rgba(16,24,40,0.18)]"
        >
          <p className="px-3 pb-2 pt-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-or-600">
            {tr("Réserver un départ")}
          </p>
          <a
            href={urlReservation}
            target="_blank"
            rel="noopener"
            onClick={() => setOuvert(false)}
            className="group flex gap-3.5 rounded-sm bg-sable-100 p-3.5 transition-colors hover:bg-sable-300/60"
          >
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-club-950 text-white">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" {...traits}>
                <rect x="4" y="5" width="16" height="15" rx="2" />
                <path d="M4 10h16M9 3v4m6-4v4m-6 8 2 2 4-4" />
              </svg>
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-butler text-[21px] font-medium leading-tight text-club-950">{tr("En ligne")}</span>
              <span className="mt-1 block text-[13px] leading-snug text-encre/70">
                {tr("Choisissez votre créneau et réglez en quelques clics.")}
              </span>
              <span className="mt-2 flex items-center gap-2 text-[12px] font-medium text-club-800">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-emerald-500" />
                {tr("Disponible 24 h/24")}
              </span>
            </span>
            <Fleche />
          </a>
          <a
            href={site.contact.telephoneLien}
            onClick={() => setOuvert(false)}
            className="group mt-1 flex gap-3.5 rounded-sm p-3.5 transition-colors hover:bg-sable-50"
          >
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-sable-100 text-club-950">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" {...traits}>
                <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
              </svg>
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-butler text-[21px] font-medium leading-tight text-club-950">{tr("Par téléphone")}</span>
              <span className="mt-1 block text-[13px] leading-snug text-encre/70">
                {tr("Notre accueil vous conseille et réserve pour vous.")}
              </span>
              <span className="mt-2 block text-[13px]">
                <span className="font-semibold text-club-950">{site.contact.telephone}</span>
                <span className="text-encre/50"> · {tr("tous les jours")}</span>
              </span>
            </span>
            <Fleche />
          </a>
          <p className="mx-1.5 mt-1 flex items-center gap-2 border-t border-encre/10 px-2 pb-1 pt-3 text-[12px] text-encre/55">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-3.5 shrink-0" {...traits}>
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </svg>
            {[etat.texte, miseAJour ? `${tr("statut")} ${miseAJour.charAt(0).toLowerCase()}${miseAJour.slice(1)}` : null]
              .filter(Boolean)
              .join(" · ")}
          </p>
        </div>
      ) : null}
    </div>
  );
}
