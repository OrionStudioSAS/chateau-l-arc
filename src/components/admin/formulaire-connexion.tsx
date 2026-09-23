"use client";

import { useActionState } from "react";

import { seConnecter } from "@/app/(admin)/admin/actions";
import type { EtatConnexion } from "@/lib/auth-etats";

export function FormulaireConnexion({ suite }: { suite: string }) {
  const [etat, action, enCours] = useActionState<EtatConnexion, FormData>(
    seConnecter,
    { statut: "vide" },
  );

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="suite" value={suite} />

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-neutral-800">
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          className="mt-2 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm outline-none transition-colors focus:border-club-600 focus:bg-white"
        />
      </div>

      <div>
        <label
          htmlFor="motDePasse"
          className="block text-sm font-medium text-neutral-800"
        >
          Mot de passe
        </label>
        <input
          id="motDePasse"
          name="motDePasse"
          type="password"
          autoComplete="current-password"
          required
          className="mt-2 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm outline-none transition-colors focus:border-club-600 focus:bg-white"
        />
      </div>

      <button
        type="submit"
        disabled={enCours}
        className="w-full rounded-xl bg-club-950 px-5 py-3 text-sm font-semibold text-sable-50 transition-colors hover:bg-club-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {enCours ? "Connexion…" : "Se connecter"}
      </button>

      {etat.statut === "erreur" ? (
        <p role="alert" className="text-sm text-red-700">
          {etat.message}
        </p>
      ) : null}
    </form>
  );
}
