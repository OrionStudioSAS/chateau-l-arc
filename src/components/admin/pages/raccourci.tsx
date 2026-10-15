"use client";

import { useEffect } from "react";

/** Touche N : déclenche le bouton « Demander une nouvelle page » (hors saisie). */
export function RaccourciNouvellePage({ cible }: { cible: string }) {
  useEffect(() => {
    const surTouche = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (e.metaKey || e.ctrlKey || e.altKey || /INPUT|TEXTAREA|SELECT/.test(el.tagName)) return;
      if (e.key.toLowerCase() === "n") document.getElementById(cible)?.click();
    };
    document.addEventListener("keydown", surTouche);
    return () => document.removeEventListener("keydown", surTouche);
  }, [cible]);
  return null;
}
