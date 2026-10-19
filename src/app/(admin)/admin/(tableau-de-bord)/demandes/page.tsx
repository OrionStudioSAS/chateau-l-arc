import type { Metadata } from "next";
import { connection } from "next/server";

import { DemandesAdmin } from "@/components/admin/demandes-admin";
import { emailsComptes, exigerUtilisateur } from "@/lib/admin/session";
import { demandesDisponibles, listerDemandes } from "@/lib/demandes-stockage";

export const metadata: Metadata = {
  title: { absolute: "Demandes · Back-office" },
};

// Lecture directe, sans cache : les nouvelles demandes apparaissent à l'ouverture.
export const instant = false;

export default async function Page() {
  await connection();
  const utilisateur = await exigerUtilisateur();

  let demandes: Awaited<ReturnType<typeof listerDemandes>> = [];
  let indisponible = !demandesDisponibles;
  if (demandesDisponibles) {
    try {
      demandes = await listerDemandes();
    } catch (erreur) {
      console.error("Lecture des demandes impossible", erreur);
      indisponible = true;
    }
  }

  return (
    <DemandesAdmin
      demandes={demandes}
      comptes={emailsComptes()}
      moi={utilisateur.email}
      maintenant={new Date().toISOString()}
      indisponible={indisponible}
    />
  );
}
