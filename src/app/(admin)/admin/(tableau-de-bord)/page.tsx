import type { Metadata } from "next";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { FormulaireStatutBandeau } from "@/components/admin/formulaire-statut-bandeau";
import { getBandeau, getStatutInstallations } from "@/lib/api/content";
import { formatDateHeure } from "@/lib/format";

export const metadata: Metadata = {
  title: { absolute: "Statut & bandeau · Back-office" },
};

export default async function Page() {
  const [bandeau, installations] = await Promise.all([
    getBandeau(),
    getStatutInstallations(),
  ]);

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
