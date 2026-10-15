"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { CartePopup } from "@/components/layout/carte-popup";
import { JOURS_AVANT_RETOUR, surtitrePopup } from "@/lib/admin/popup";
import { evenements, suivre } from "@/lib/analytics/evenements";
import type { Popup } from "@/lib/api/types";
import { aujourdhuiAParis } from "@/lib/format";

/**
 * Mémorise la version fermée et la date de fermeture. Une seule clé : une
 * nouvelle publication (version différente) se réaffiche aussitôt ; la même
 * revient après JOURS_AVANT_RETOUR jours.
 */
const CLE_STOCKAGE = "chateau-larc:popup-fermee";

function dejaFermee(version: string): boolean {
  try {
    const memo = JSON.parse(window.localStorage.getItem(CLE_STOCKAGE) ?? "null");
    return (
      memo?.version === version &&
      Date.now() - Number(memo.le) < JOURS_AVANT_RETOUR * 86_400_000
    );
  } catch {
    // Stockage indisponible (navigation privée stricte) : on affiche quand même.
    return false;
  }
}

export function PopupMarketing({ popup }: { popup: Popup | null }) {
  const [ouverte, setOuverte] = useState(false);
  const boite = useRef<HTMLDivElement>(null);
  const focusPrecedent = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Pas de pop-up dans l'aperçu de l'éditeur visuel du back-office.
    if (!popup || new URLSearchParams(window.location.search).has("edit")) return;

    const jour = aujourdhuiAParis();
    if (popup.debut && jour < popup.debut) return;
    if (popup.fin && jour > popup.fin) return;

    if (dejaFermee(popup.version)) return;

    // Léger délai : la pop-up n'arrive pas en même temps que la page.
    const minuteur = window.setTimeout(() => {
      focusPrecedent.current = document.activeElement as HTMLElement | null;
      setOuverte(true);
      suivre(evenements.popupAffichage, popup.version);
    }, 800);

    return () => window.clearTimeout(minuteur);
  }, [popup]);

  const fermer = useCallback(() => {
    // Fermée (ou bouton cliqué) : elle ne revient pas avant 30 jours.
    if (popup) {
      try {
        window.localStorage.setItem(CLE_STOCKAGE, JSON.stringify({ version: popup.version, le: Date.now() }));
      } catch {
        // Voir plus haut.
      }
    }
    setOuverte(false);
    focusPrecedent.current?.focus?.();
  }, [popup]);

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
        className="max-h-full w-full max-w-sm overflow-y-auto rounded-xl outline-none"
      >
        <CartePopup
          surtitre={surtitrePopup(popup.boutonLien, popup.debut)}
          titre={popup.titre}
          texte={popup.texte}
          boutonLibelle={popup.boutonLibelle}
          boutonLien={popup.boutonLien}
          afficheUrl={popup.afficheUrl}
          onFermer={fermer}
          onAction={() => {
            suivre(evenements.popupClic);
            fermer();
          }}
          idTitre="popup-titre"
        />
      </div>
    </div>
  );
}
