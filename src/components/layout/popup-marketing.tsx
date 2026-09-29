"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { CartePopup } from "@/components/layout/carte-popup";
import type { Popup } from "@/lib/api/types";
import { aujourdhuiAParis } from "@/lib/format";

/**
 * Mémorise la dernière version vue. Une seule clé, dont la valeur est la
 * version : une nouvelle publication (version différente) se réaffiche, sans
 * accumuler une entrée par pop-up dans le navigateur.
 */
const CLE_STOCKAGE = "chateau-larc:popup-vue";

export function PopupMarketing({ popup }: { popup: Popup | null }) {
  const [ouverte, setOuverte] = useState(false);
  const boite = useRef<HTMLDivElement>(null);
  const focusPrecedent = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!popup) return;

    const jour = aujourdhuiAParis();
    if (popup.debut && jour < popup.debut) return;
    if (popup.fin && jour > popup.fin) return;

    try {
      if (window.localStorage.getItem(CLE_STOCKAGE) === popup.version) return;
    } catch {
      // Stockage indisponible (navigation privée stricte) : on affiche quand même.
    }

    // Léger délai : la pop-up n'arrive pas en même temps que la page.
    const minuteur = window.setTimeout(() => {
      focusPrecedent.current = document.activeElement as HTMLElement | null;
      setOuverte(true);
      // « Une fois par visiteur » : marquée vue dès l'affichage, qu'elle soit
      // fermée ou simplement ignorée, pour ne pas revenir à chaque page.
      try {
        window.localStorage.setItem(CLE_STOCKAGE, popup.version);
      } catch {
        // Voir plus haut.
      }
    }, 800);

    return () => window.clearTimeout(minuteur);
  }, [popup]);

  const fermer = useCallback(() => {
    setOuverte(false);
    focusPrecedent.current?.focus?.();
  }, []);

  useEffect(() => {
    if (!ouverte) return;
    boite.current?.focus();

    const surTouche = (evenement: KeyboardEvent) => {
      if (evenement.key === "Escape") fermer();
    };
    document.addEventListener("keydown", surTouche);
    return () => document.removeEventListener("keydown", surTouche);
  }, [ouverte, fermer]);

  if (!popup || !ouverte) return null;

  return (
    <div
      className="animation-popup fixed inset-0 z-[60] flex items-center justify-center bg-club-950/60 p-5"
      onClick={fermer}
    >
      <div
        ref={boite}
        role="dialog"
        aria-modal="true"
        aria-labelledby="popup-titre"
        tabIndex={-1}
        onClick={(evenement) => evenement.stopPropagation()}
        className="w-full max-w-sm outline-none"
      >
        <CartePopup
          titre={popup.titre}
          texte={popup.texte}
          boutonLibelle={popup.boutonLibelle}
          boutonLien={popup.boutonLien}
          afficheUrl={popup.afficheUrl}
          onFermer={fermer}
          onAction={fermer}
          idTitre="popup-titre"
        />
      </div>
    </div>
  );
}
