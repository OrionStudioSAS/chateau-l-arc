"use client";

import { useActionState, useState } from "react";

import { publierStatutEtBandeau } from "@/app/(admin)/admin/actions";
import { AdminCard } from "@/components/admin/admin-card";
import type { Installation } from "@/lib/api/types";
import { LONGUEUR_MAX_BANDEAU, type EtatBandeau } from "@/lib/bandeau";
import { cn } from "@/lib/cn";
import { libelleEtat } from "@/lib/statut";

/** Pictogrammes du back-office uniquement : le site public n'en affiche pas. */
const icones: Record<string, string> = {
  parcours: "⛳️",
  practice: "🏌️",
  voiturette: "🚗",
  "chariot-manuel": "🛒",
  "chariot-electrique": "🔋",
  "club-house": "🏛️",
  proshop: "🛍️",
  restaurant: "🍽️",
  piscine: "🏊",
  tennis: "🎾",
};

export function FormulaireStatutBandeau({
  installations,
  messageInitial,
  dernierePublication,
}: {
  installations: Installation[];
  messageInitial: string;
  dernierePublication?: string;
}) {
  const [etat, action, enCours] = useActionState<EtatBandeau, FormData>(
    publierStatutEtBandeau,
    { statut: "vide" },
  );

  // État local des interrupteurs : la pastille suit le clic avant publication.
  const [actifs, setActifs] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(installations.map((i) => [i.cle, i.actif])),
  );

  return (
    <form action={action} className="max-w-3xl space-y-5">
      <AdminCard className="py-3">
        {installations.length === 0 ? (
          <p className="py-4 text-sm text-neutral-500">
            Statut indisponible pour le moment.
          </p>
        ) : (
          <ul className="divide-y divide-neutral-200">
            {installations.map((installation) => {
              const actif = actifs[installation.cle];
              const libelle = libelleEtat({ ...installation, actif });

              return (
                <li
                  key={installation.cle}
                  className="flex items-center justify-between gap-3 py-3 sm:gap-4"
                >
                  <label
                    htmlFor={`statut-${installation.cle}`}
                    className="flex min-w-0 items-center gap-2 text-[14px] font-medium text-neutral-900 sm:gap-3 sm:text-[15px]"
                  >
                    <span aria-hidden="true">{icones[installation.cle] ?? "•"}</span>
                    {installation.libelle}
                  </label>

                  <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-1 text-xs font-semibold sm:px-3",
                        actif
                          ? "bg-club-600/15 text-club-800"
                          : "bg-amber-500/15 text-amber-800",
                      )}
                    >
                      {libelle}
                    </span>

                    {/* Case à cocher native, stylée en interrupteur. */}
                    <span className="relative inline-flex">
                      <input
                        id={`statut-${installation.cle}`}
                        name={`statut-${installation.cle}`}
                        type="checkbox"
                        role="switch"
                        checked={actif}
                        onChange={(evenement) =>
                          setActifs((precedent) => ({
                            ...precedent,
                            [installation.cle]: evenement.target.checked,
                          }))
                        }
                        className="peer sr-only"
                      />
                      <span
                        aria-hidden="true"
                        className="h-6 w-11 rounded-full bg-neutral-300 transition-colors peer-checked:bg-club-800 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-club-600"
                      />
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute left-0.5 top-0.5 size-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5"
                      />
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </AdminCard>

      <AdminCard>
        <label htmlFor="message" className="block text-sm font-semibold text-neutral-900">
          Message du bandeau (facultatif)
        </label>
        <input
          id="message"
          name="message"
          type="text"
          defaultValue={messageInitial}
          maxLength={LONGUEUR_MAX_BANDEAU}
          placeholder="Ex. : Abonnements 2027 ouverts : -5% paiement comptant"
          aria-describedby="message-aide"
          className="mt-3 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-club-600 focus:bg-white"
        />
        <p id="message-aide" className="mt-2 text-xs text-neutral-500">
          Laisser vide pour masquer le bandeau. {LONGUEUR_MAX_BANDEAU} caractères
          maximum.
        </p>
      </AdminCard>

      <div className="flex flex-wrap items-center gap-4 pt-1">
        <button
          type="submit"
          disabled={enCours}
          className="rounded-xl bg-club-950 px-5 py-3 text-sm font-semibold text-sable-50 transition-colors hover:bg-club-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {enCours ? "Publication…" : "Publier sur le site"}
        </button>

        {dernierePublication ? (
          <p className="text-sm text-neutral-500">
            Dernière publication : {dernierePublication}
          </p>
        ) : null}
      </div>

      {etat.statut !== "vide" ? (
        <p
          role="status"
          className={etat.statut === "succes" ? "text-sm text-club-800" : "text-sm text-red-700"}
        >
          {etat.message}
        </p>
      ) : null}
    </form>
  );
}
