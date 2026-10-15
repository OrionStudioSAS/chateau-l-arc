"use client";

import Link from "next/link";
import type { Route } from "next";
import { useEffect, useState } from "react";

import { IconeAdmin, type NomIconeAdmin } from "@/components/admin/icone-admin";
import { cn } from "@/lib/cn";

export type Recommandation = {
  id: string;
  icone: NomIconeAdmin;
  titre: string;
  texte: string;
  action: { libelle: string; href: string };
  /** Mise en avant d'une application Orion (bouton doré). */
  promotion?: boolean;
};

const CLE = "chateau-larc:recommandations-masquees";

/** Recommandations de l'accueil ; une recommandation masquée ne revient pas. */
export function Recommandations({ liste }: { liste: Recommandation[] }) {
  const [masquees, setMasquees] = useState<string[]>([]);

  useEffect(() => {
    try {
      const enregistrees = JSON.parse(window.localStorage.getItem(CLE) ?? "[]");
      // Lecture unique du stockage du navigateur, après l'hydratation.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (Array.isArray(enregistrees)) setMasquees(enregistrees);
    } catch {
      // Stockage indisponible : tout reste affiché.
    }
  }, []);

  const masquer = (id: string) => {
    const suivantes = [...masquees, id];
    setMasquees(suivantes);
    try {
      window.localStorage.setItem(CLE, JSON.stringify(suivantes));
    } catch {
      // Voir plus haut.
    }
  };

  const visibles = liste.filter((r) => !masquees.includes(r.id));

  return (
    <section className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
      <h2 className="border-b border-neutral-200 px-5 py-4 text-[15px] font-semibold text-neutral-900 sm:px-6">
        Recommandations
      </h2>
      {visibles.length === 0 ? (
        <p className="px-5 py-6 text-[14px] text-neutral-500 sm:px-6">
          Rien à signaler : le site est à jour.
        </p>
      ) : (
        <ul className="divide-y divide-neutral-200">
          {visibles.map((r) => (
            <li key={r.id} className="relative flex gap-4 px-5 py-5 sm:px-6">
              <span
                aria-hidden="true"
                className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#f6efe2] text-or-600"
              >
                <IconeAdmin nom={r.icone} className="size-4" />
              </span>
              <div className="min-w-0 flex-1 pr-6">
                <p className="text-[14px] font-semibold text-neutral-900">{r.titre}</p>
                <p className="mt-1 text-[13px] text-neutral-500">{r.texte}</p>
                <Link
                  href={r.action.href as Route}
                  className={cn(
                    "mt-3 inline-flex rounded-lg px-3 py-1.5 text-[14px] font-medium transition-colors",
                    r.promotion
                      ? "bg-[#f6efe2] text-or-600 hover:bg-[#efe3cc]"
                      : "border border-neutral-200 text-neutral-800 hover:bg-neutral-50",
                  )}
                >
                  {r.action.libelle}
                </Link>
              </div>
              <button
                type="button"
                aria-label={`Masquer « ${r.titre} »`}
                onClick={() => masquer(r.id)}
                className="absolute right-4 top-4 rounded p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
              >
                <IconeAdmin nom="fermer" className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
