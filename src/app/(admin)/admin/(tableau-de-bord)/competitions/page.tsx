import type { Metadata } from "next";
import { connection } from "next/server";

import { CompetitionsAdmin } from "@/components/admin/competitions/liste";
import { listerCompetitions } from "@/lib/admin/competitions";
import { lireContenu } from "@/lib/contenu/stockage";

export const metadata: Metadata = {
  title: { absolute: "Compétitions · Back-office" },
};

export const instant = false;

export default async function Page() {
  // Rendu à la requête : les états (ouverte, close, terminée) dépendent de l'heure.
  await connection();
  const [{ competitions, aujourdhui, maintenant }, evenements] = await Promise.all([
    listerCompetitions(),
    lireContenu("evenements"),
  ]);

  return (
    <CompetitionsAdmin competitions={competitions} evenements={evenements} aujourdhui={aujourdhui} maintenant={maintenant} />
  );
}
