import type { Metadata } from "next";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { BandeauForm } from "@/components/admin/bandeau-form";
import { getBandeau } from "@/lib/api/content";
import { formatDateHeure } from "@/lib/format";

export const metadata: Metadata = {
  title: { absolute: "Statut & bandeau · Back-office" },
};

export default async function Page() {
  const bandeau = await getBandeau();

  return (
    <>
      <AdminPageHeader
        titre="Statut du golf & bandeau d'information"
        description="Ce que voient vos visiteurs en haut du site — mise à jour immédiate."
      />
      {/* TODO : bloc « Statut du golf » (parcours, greens d'hiver, voiturettes, practice,
          restaurant, tennis) à ajouter au-dessus du bandeau. */}
      <BandeauForm
        messageInitial={bandeau.message}
        dernierePublication={
          bandeau.publieLe ? formatDateHeure(bandeau.publieLe) : undefined
        }
      />
    </>
  );
}
