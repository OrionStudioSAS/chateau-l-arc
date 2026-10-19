"use client";

import { useEffect, useState } from "react";

import { IconeAdmin } from "@/components/admin/icone-admin";
import type { EntreeHistorique } from "@/lib/admin/historique";

const quand = new Intl.DateTimeFormat("fr-FR", {
  weekday: "short",
  day: "numeric",
  month: "short",
  hour: "numeric",
  minute: "2-digit",
  timeZone: "Europe/Paris",
});

/**
 * Panneau latéral « Historique des publications » : les dernières
 * publications d'un écran et ce qui a changé à chacune. `charger` est une
 * action serveur (lue à l'ouverture) ; `onFermer` doit rester stable.
 */
export function HistoriquePublications({
  charger,
  onFermer,
}: {
  charger: () => Promise<EntreeHistorique[]>;
  onFermer: () => void;
}) {
  const [entrees, setEntrees] = useState<EntreeHistorique[] | null>(null);

  useEffect(() => {
    let actif = true;
    charger().then((liste) => actif && setEntrees(liste));
    const surTouche = (e: KeyboardEvent) => e.key === "Escape" && onFermer();
    document.addEventListener("keydown", surTouche);
    return () => {
      actif = false;
      document.removeEventListener("keydown", surTouche);
    };
  }, [charger, onFermer]);

  return (
    <div className="fixed inset-0 z-50">
      <div aria-hidden="true" className="absolute inset-0 bg-neutral-900/30" onClick={onFermer} />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Historique des publications"
        className="absolute inset-y-0 right-0 flex w-[min(26rem,100vw)] flex-col bg-white shadow-xl"
      >
        <header className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
          <h2 className="text-[15px] font-semibold text-neutral-900">Historique des publications</h2>
          <button
            type="button"
            onClick={onFermer}
            aria-label="Fermer l'historique"
            className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100"
          >
            <IconeAdmin nom="fermer" className="size-4" />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {entrees === null ? (
            <p className="text-[14px] text-neutral-500">Chargement…</p>
          ) : entrees.length === 0 ? (
            <p className="text-[14px] text-neutral-500">Aucune publication trouvée.</p>
          ) : (
            <ol className="space-y-5">
              {entrees.map((entree) => (
                <li key={entree.date} className="border-l-2 border-neutral-200 pl-4">
                  <p className="text-[12px] font-medium uppercase tracking-wide text-neutral-500">
                    {quand.format(new Date(entree.date))}
                  </p>
                  <ul className="mt-1.5 space-y-1">
                    {entree.changements.map((ligne) => (
                      <li key={ligne} className="text-[14px] text-neutral-800">
                        {ligne}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          )}
        </div>
      </aside>
    </div>
  );
}
