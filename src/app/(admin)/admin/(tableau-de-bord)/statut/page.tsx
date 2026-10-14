import type { Metadata } from "next";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { FormulaireStatutBandeau } from "@/components/admin/formulaire-statut-bandeau";
import { lireContenu } from "@/lib/contenu/stockage";
import { formatDateHeure } from "@/lib/format";

export const metadata: Metadata = {
  title: { absolute: "Statut des installations · Back-office" },
};

// Lecture directe du dépôt, sans cache : l'accueil voit sa dernière publication.
export const instant = false;

export default async function Page() {
  const { bandeau, installations } = await lireContenu("statut");

  return (
    <>
      <AdminPageHeader
        titre="Statut du golf & bandeau d'information"
        description="Ce que voient vos visiteurs en haut du site — mise à jour immédiate."
      />
      <FormulaireStatutBandeau
        installations={installations}
        messageInitial={bandeau.message}
        dernierePublication={
          bandeau.publieLe ? formatDateHeure(bandeau.publieLe) : undefined
        }
      />
    </>
  );
}
