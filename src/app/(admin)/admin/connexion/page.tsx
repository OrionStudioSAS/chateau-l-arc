import type { Metadata } from "next";

import { FormulaireConnexion } from "@/components/admin/formulaire-connexion";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: { absolute: "Connexion · Back-office" },
  robots: { index: false, follow: false },
};

/**
 * La page lit `searchParams` (le chemin d'où vient le visiteur) : elle ne peut
 * donc pas être prérendue. `instant` ne se propage pas depuis le layout parent,
 * chaque segment bloquant doit le déclarer.
 */
export const instant = false;

export default async function Page({ searchParams }: PageProps<"/admin/connexion">) {
  const { suite } = await searchParams;
  const destination = typeof suite === "string" ? suite : "/admin";

  return (
    <div className="flex min-h-screen items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="font-butler text-xl text-club-950">{site.shortName}</p>
          <p className="mt-1 text-sm text-neutral-500">Back-office</p>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
          <FormulaireConnexion suite={destination} />
        </div>

        <p className="mt-6 text-center text-xs text-neutral-500">
          Accès réservé à l&apos;équipe du club.
        </p>
      </div>
    </div>
  );
}
