import type { Metadata } from "next";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { FormulairePopup } from "@/components/admin/formulaire-popup";
import { lirePopupAdmin } from "@/lib/admin/popup-lecture";

export const metadata: Metadata = {
  title: { absolute: "Pop-up marketing · Back-office" },
};

// Lecture de la pop-up non publiée : propre à la session, donc bloquante.
export const instant = false;

export default async function Page() {
  const popup = await lirePopupAdmin();

  return (
    <>
      <AdminPageHeader
        titre="Pop-up marketing"
        description="Une seule pop-up active à la fois. Elle s'affiche une fois par visiteur."
      />
      <FormulairePopup popup={popup} />
    </>
  );
}
