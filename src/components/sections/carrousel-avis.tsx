"use client";

import { Children, useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/cn";
import { useI18n } from "@/lib/i18n/client";

function Fleche({ sens, disabled, onClick, libelle }: { sens: "gauche" | "droite"; disabled: boolean; onClick: () => void; libelle: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={libelle}
      className="flex size-11 items-center justify-center rounded-full border border-club-950/20 text-club-950 transition-colors hover:bg-sable-50 disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent"
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className={cn("size-4", sens === "gauche" && "rotate-180")} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14m-5-5 5 5-5 5" />
      </svg>
    </button>
  );
}

/**
 * Avis Google en carrousel (accueil) : la carte de la note reste fixe à
 * gauche, les avis défilent à droite (trois visibles sur grand écran), avec
 * deux flèches à côté du titre. Défilement natif : glisser au doigt ou au
 * pavé tactile fonctionne aussi.
 */
export function CarrouselAvis({
  entete,
  note,
  children,
}: {
  /** Surtitre, titre et éventuelle pastille d'exemple. */
  entete: React.ReactNode;
  /** Carte verte de la note. */
  note: React.ReactNode;
  /** Une carte (<li>) par avis. */
  children: React.ReactNode;
}) {
  const { tr } = useI18n();
  const piste = useRef<HTMLUListElement>(null);
  const [debut, setDebut] = useState(true);
  const [fin, setFin] = useState(true);
  const nombre = Children.count(children);

  const mesurer = useCallback(() => {
    const el = piste.current;
    if (!el) return;
    setDebut(el.scrollLeft <= 2);
    setFin(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2);
  }, []);

  useEffect(() => {
    mesurer();
    const el = piste.current;
    const observateur = new ResizeObserver(mesurer);
    if (el) observateur.observe(el);
    return () => observateur.disconnect();
  }, [mesurer]);

  /** Avance ou recule d'une carte. */
  const defiler = (sens: 1 | -1) => {
    const el = piste.current;
    const carte = el?.firstElementChild as HTMLElement | null;
    if (!el || !carte) return;
    const ecart = parseFloat(getComputedStyle(el).columnGap) || 0;
    el.scrollBy({ left: sens * (carte.offsetWidth + ecart), behavior: "smooth" });
  };

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>{entete}</div>
        {nombre > 1 ? (
          <div className={cn("flex gap-2", debut && fin && "hidden")}>
            <Fleche sens="gauche" disabled={debut} onClick={() => defiler(-1)} libelle={tr("Avis précédent")} />
            <Fleche sens="droite" disabled={fin} onClick={() => defiler(1)} libelle={tr("Avis suivant")} />
          </div>
        ) : null}
      </div>

      <div className="mt-12 grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,3fr)]">
        {note}
        <ul
          ref={piste}
          onScroll={mesurer}
          aria-label={tr("Avis Google")}
          className="sans-barre flex snap-x snap-mandatory gap-6 overflow-x-auto overscroll-x-contain"
        >
          {children}
        </ul>
      </div>
    </>
  );
}
