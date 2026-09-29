"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * En-tête du back-office sous 1024 px : la barre latérale y prendrait toute la
 * largeur. Marque à gauche, bouton « Menu » qui déplie la navigation et le
 * compte, rendus côté serveur et passés en `children`.
 */
export function BarreAdminMobile({
  marque,
  children,
}: {
  marque: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [ouvert, setOuvert] = useState(false);

  // Changement de rubrique : le menu se referme. Ajusté pendant le rendu
  // plutôt que dans un effet, pour éviter un rendu en cascade.
  const [cheminPrecedent, setCheminPrecedent] = useState(pathname);
  if (pathname !== cheminPrecedent) {
    setCheminPrecedent(pathname);
    setOuvert(false);
  }

  useEffect(() => {
    if (!ouvert) return;
    const surTouche = (evenement: KeyboardEvent) => {
      if (evenement.key === "Escape") setOuvert(false);
    };
    document.addEventListener("keydown", surTouche);
    return () => document.removeEventListener("keydown", surTouche);
  }, [ouvert]);

  return (
    <div className="sticky top-0 z-40 border-b border-neutral-200 bg-neutral-50 lg:hidden">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
        {marque}
        <button
          type="button"
          aria-expanded={ouvert}
          aria-controls="menu-admin"
          onClick={() => setOuvert((valeur) => !valeur)}
          className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-800"
        >
          {ouvert ? "Fermer" : "Menu"}
        </button>
      </div>

      {ouvert ? (
        <div
          id="menu-admin"
          className="max-h-[calc(100dvh-4rem)] space-y-4 overflow-y-auto border-t border-neutral-200 px-4 pb-5 pt-3 sm:px-6"
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}
