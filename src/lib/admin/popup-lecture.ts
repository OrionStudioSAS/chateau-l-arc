import "server-only";

import { mapperPopup } from "@/lib/api/content";
import type { Popup } from "@/lib/api/types";
import { creerClientServeur } from "@/lib/supabase/server";

/** Pop-up telle qu'enregistrée, active ou non (réservé au back-office). */
export async function lirePopupAdmin(): Promise<Popup | null> {
  const supabase = await creerClientServeur();
  const { data, error } = await supabase
    .from("popup")
    .select("actif, titre, texte, bouton_libelle, bouton_lien, debut, fin, affiche_url, maj_le")
    .eq("id", "principal")
    .maybeSingle();

  if (error) console.error("Lecture de la pop-up (admin) impossible", error);
  return data ? mapperPopup(data) : null;
}
