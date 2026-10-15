import type { Metadata } from "next";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { FormulaireBandeau } from "@/components/admin/formulaire-bandeau";
import { lireContenu } from "@/lib/contenu/stockage";
import { formatDateHeure } from "@/lib/format";

export const metadata: Metadata = {
  title: { absolute: "Bandeau d'information · Back-office" },
};

// Lecture directe du dépôt, sans cache : l'accueil voit sa dernière publication.
export const instant = false;

export default async function Page() {
  const { bandeau } = await lireContenu("statut");

  return (
    <>
      <AdminPageHeader
        titre="Bandeau d'information"
        description="Le message affiché tout en haut du site public."
      />
      <FormulaireBandeau
        messageInitial={bandeau.message}
        dernierePublication={bandeau.publieLe ? formatDateHeure(bandeau.publieLe) : undefined}
      />
    </>
  );
}
