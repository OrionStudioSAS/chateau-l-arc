import type { Metadata } from "next";

import { TarifsAdmin } from "@/components/admin/tarifs-admin";
import { lireContenu } from "@/lib/contenu/stockage";

export const metadata: Metadata = { title: { absolute: "Tarifs · Back-office" } };

// Lecture directe du dépôt, sans cache : l'écran montre la dernière publication.
export const instant = false;

export default async function Page() {
  return <TarifsAdmin grille={await lireContenu("tarifs")} />;
}
