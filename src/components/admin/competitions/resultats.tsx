"use client";

import { useActionState, useEffect } from "react";

import { publierResultats } from "@/app/(admin)/admin/(tableau-de-bord)/competitions/actions";
import { classeChamp } from "@/components/admin/competitions/champs";
import { IconeAdmin } from "@/components/admin/icone-admin";
import type { EtatResultats } from "@/lib/admin/formulaire-competition";
import type { CompetitionAvecEtat } from "@/lib/api/types";

/** Dépôt du classement (PDF) d'une compétition terminée, et de ses vainqueurs. */
export function ModaleResultats({
  competition,
  onFermer,
  onPublie,
}: {
  competition: CompetitionAvecEtat;
  onFermer: () => void;
  onPublie: (message: string) => void;
}) {
  const [etat, action, enCours] = useActionState<EtatResultats, FormData>(publierResultats, {
    statut: "vide",
  });

  useEffect(() => {
    if (etat.statut === "succes") onPublie(etat.message);
  }, [etat, onPublie]);

  useEffect(() => {
    const surTouche = (e: KeyboardEvent) => e.key === "Escape" && onFermer();
    document.addEventListener("keydown", surTouche);
    return () => document.removeEventListener("keydown", surTouche);
  }, [onFermer]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-neutral-900/40 p-3 sm:p-10" onClick={onFermer}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="titre-resultats"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-xl bg-white shadow-2xl"
      >
        <header className="flex items-start justify-between gap-4 border-b border-neutral-200 px-5 py-4">
          <div>
            <h2 id="titre-resultats" className="text-[16px] font-semibold text-neutral-900">
              Publier les résultats
            </h2>
            <p className="mt-0.5 text-[13px] text-neutral-500">{competition.nom}</p>
          </div>
          <button type="button" aria-label="Fermer" onClick={onFermer} className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100">
            <IconeAdmin nom="fermer" className="size-4" />
          </button>
        </header>

        <form action={action} className="space-y-4 px-5 py-5">
          <input type="hidden" name="id" value={competition.id} />
          <input type="hidden" name="slug" value={competition.slug} />

          <div>
            <label htmlFor="fichier" className="mb-1.5 block text-[13px] font-medium text-neutral-700">
              Classement au format PDF <span className="text-red-600">*</span>
            </label>
            <input
              id="fichier"
              name="fichier"
              type="file"
              accept="application/pdf"
              required
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-[14px] file:mr-3 file:rounded-md file:border-0 file:bg-neutral-100 file:px-3 file:py-1 file:text-[13px]"
            />
            <p className="mt-1.5 text-[12px] text-neutral-500">4 Mo maximum. Téléchargeable depuis la page de la compétition.</p>
          </div>

          <div>
            <label htmlFor="vainqueurs" className="mb-1.5 flex justify-between text-[13px] font-medium text-neutral-700">
              Vainqueurs <span className="font-normal text-neutral-400">Facultatif</span>
            </label>
            <input
              id="vainqueurs"
              name="vainqueurs"
              maxLength={120}
              defaultValue={competition.vainqueurs}
              placeholder="Équipe Mercier · 54,8 net"
              className={classeChamp}
            />
          </div>

          {competition.resultatsPublies && competition.resultatsUrl ? (
            <p className="text-[13px] text-neutral-500">
              Résultats en ligne :{" "}
              <a href={competition.resultatsUrl} target="_blank" rel="noopener" className="underline underline-offset-4">
                consulter le PDF actuel
              </a>
              . Un nouvel envoi le remplace.
            </p>
          ) : null}

          {etat.statut === "erreur" ? (
            <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-[14px] text-red-700">
              {etat.message}
            </p>
          ) : null}

          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={onFermer} className="rounded-lg border border-neutral-200 px-3 py-2 text-[14px] font-medium text-neutral-800 hover:bg-neutral-50">
              Annuler
            </button>
            <button type="submit" disabled={enCours} className="flex items-center gap-2 rounded-lg bg-club-950 px-3.5 py-2 text-[14px] font-medium text-white hover:bg-club-800 disabled:opacity-60">
              <IconeAdmin nom="envoi" className="size-4" />
              {enCours ? "Envoi…" : "Publier les résultats"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
