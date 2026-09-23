"use client";

import { useActionState } from "react";

import { publierBandeau } from "@/app/(admin)/admin/actions";
import { AdminCard } from "@/components/admin/admin-card";
import { LONGUEUR_MAX_BANDEAU, type EtatBandeau } from "@/lib/bandeau";

export function BandeauForm({
  messageInitial,
  dernierePublication,
}: {
  messageInitial: string;
  dernierePublication?: string;
}) {
  const [etat, action, enCours] = useActionState<EtatBandeau, FormData>(
    publierBandeau,
    { statut: "vide" },
  );

  return (
    <form action={action}>
      <AdminCard>
        <label
          htmlFor="message"
          className="block text-sm font-semibold text-neutral-900"
        >
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

      <div className="mt-6 flex flex-wrap items-center gap-4">
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
          className={
            etat.statut === "succes"
              ? "mt-4 text-sm text-club-800"
              : "mt-4 text-sm text-red-700"
          }
        >
          {etat.message}
        </p>
      ) : null}
    </form>
  );
}
