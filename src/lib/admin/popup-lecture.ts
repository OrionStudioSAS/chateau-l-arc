import "server-only";

import { mapperPopup } from "@/lib/api/content";
import type { Popup } from "@/lib/api/types";
import { lireContenu } from "@/lib/contenu/stockage";

/** Pop-up telle qu'enregistrée, active ou non (réservé au back-office, sans cache). */
export async function lirePopupAdmin(): Promise<Popup | null> {
  return mapperPopup(await lireContenu("popup"));
}
