"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { IconeAdmin } from "@/components/admin/icone-admin";
import { filAriane } from "@/config/admin";
import { site } from "@/config/site";

/**
 * Barre du haut du back-office : fil d'Ariane, dernière publication et lien
 * vers le site. Sous 1024 px, elle porte aussi le bouton du menu, qui déplie
 * la barre latérale (passée en `tiroir`) par-dessus la page.
 */
export function BarreHaute({
  publication,
  tiroir,
}: {
  publication: string | null;
  tiroir: React.ReactNode;
}) {
  const chemin = usePathname();
  const [ouvert, setOuvert] = useState(false);

  // Changement de rubrique : le tiroir se referme (ajusté pendant le rendu).
  const [cheminPrecedent, setCheminPrecedent] = useState(chemin);
  if (chemin !== cheminPrecedent) {
    setCheminPrecedent(chemin);
    setOuvert(false);
  }

  useEffect(() => {
    if (!ouvert) return;
    const surTouche = (evenement: KeyboardEvent) => {
      if (evenement.key === "Escape") setOuvert(false);
    };
    document.addEventListener("keydown", surTouche);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", surTouche);
      document.documentElement.style.overflow = "";
    };
  }, [ouvert]);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-neutral-200 bg-white/90 px-4 backdrop-blur sm:px-6 lg:static lg:h-[52px] lg:rounded-t-xl lg:bg-white">
        <button
          type="button"
          aria-label="Ouvrir le menu"
          aria-expanded={ouvert}
          aria-controls="tiroir-admin"
          onClick={() => setOuvert(true)}
          className="-ml-1.5 rounded-md p-1.5 text-neutral-700 hover:bg-neutral-100 lg:hidden"
        >
          <IconeAdmin nom="menu" className="size-5" />
        </button>

        <nav aria-label="Fil d'Ariane" className="min-w-0 flex-1">
          <ol className="flex items-center gap-2 text-[14px]">
            <li className="hidden text-neutral-500 sm:block">{site.shortName}</li>
            <li aria-hidden="true" className="hidden text-neutral-300 sm:block">
              <IconeAdmin nom="chevronDroite" className="size-3.5" />
            </li>
            {filAriane(chemin).map((libelle, i, liste) =>
              i < liste.length - 1 ? (
                <li key={libelle} className="hidden items-center gap-2 text-neutral-500 sm:flex">
                  {libelle}
                  <IconeAdmin nom="chevronDroite" className="size-3.5 text-neutral-300" />
                </li>
              ) : (
                <li key={libelle} aria-current="page" className="truncate font-medium text-neutral-900">
                  {libelle}
                </li>
              ),
            )}
          </ol>
        </nav>

        {publication ? (
          <p className="hidden items-center gap-1.5 rounded-full border border-neutral-200 px-2.5 py-1 text-[12px] text-neutral-600 sm:flex">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-emerald-500" />
            Publié · {publication}
          </p>
        ) : null}

        <a
          href="/"
          target="_blank"
          rel="noopener"
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[14px] text-neutral-700 hover:bg-neutral-100"
        >
          Voir le site
          <IconeAdmin nom="fleche" className="size-3.5" />
        </a>
      </header>

      {ouvert ? (
        <div className="fixed inset-0 z-50 lg:hidden" id="tiroir-admin">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-neutral-900/30"
            onClick={() => setOuvert(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Menu du back-office"
            className="absolute inset-y-0 left-0 w-[min(18rem,85vw)] overflow-y-auto bg-[#f4f4f1] px-3 py-4 shadow-xl"
          >
            <div className="mb-3 flex justify-end">
              <button
                type="button"
                aria-label="Fermer le menu"
                onClick={() => setOuvert(false)}
                className="rounded-md p-1.5 text-neutral-600 hover:bg-neutral-200/60"
              >
                <IconeAdmin nom="fermer" className="size-5" />
              </button>
            </div>
            {tiroir}
          </div>
        </div>
      ) : null}
    </>
  );
}
