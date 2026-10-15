import type { Metadata } from "next";
import { connection } from "next/server";

import { StatutInstallations } from "@/components/admin/statut-installations";
import { lireContenu } from "@/lib/contenu/stockage";
import { normaliserInstallation } from "@/lib/statut";

export const metadata: Metadata = {
  title: { absolute: "Statut des installations · Back-office" },
};

// Lecture directe du dépôt, sans cache : l'accueil voit sa dernière publication.
export const instant = false;

const heure = new Intl.DateTimeFormat("fr-FR", {
  hour: "numeric",
  minute: "2-digit",
  timeZone: "Europe/Paris",
});
const jour = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "short",
  timeZone: "Europe/Paris",
});
const cleJour = new Intl.DateTimeFormat("fr-CA", { timeZone: "Europe/Paris" });

/** « Mis à jour aujourd'hui à 6h42 » ou « Mis à jour le 9 oct. ». */
function miseAJour(iso: string): string {
  const date = new Date(iso);
  return cleJour.format(date) === cleJour.format(new Date())
    ? `Mis à jour aujourd'hui à ${heure.format(date).replace(":", "h")}`
    : `Mis à jour le ${jour.format(date)}`;
}

export default async function Page() {
  // Rendu à la requête : les dates « Mis à jour aujourd'hui » dépendent de l'heure.
  await connection();
  const { installations } = await lireContenu("statut");
  const normalisees = installations.map(normaliserInstallation);

  return (
    <StatutInstallations
      installations={normalisees}
      reperes={Object.fromEntries(
        normalisees.map((i) => [i.cle, i.description || miseAJour(i.majLe)]),
      )}
    />
  );
}
