import type { Metadata } from "next";

import { PopupAdmin } from "@/components/admin/popup-admin";
import { lirePopupAdmin } from "@/lib/admin/popup-lecture";

export const metadata: Metadata = {
  title: { absolute: "Pop-up marketing · Back-office" },
};

// Lecture directe du dépôt, sans cache : l'écran montre la dernière publication.
export const instant = false;

export default async function Page() {
  const popup = await lirePopupAdmin();
  return <PopupAdmin popup={popup} />;
}
