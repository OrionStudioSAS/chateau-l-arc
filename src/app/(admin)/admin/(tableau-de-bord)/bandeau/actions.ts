"use server";

import { updateTag } from "next/cache";

import { tags } from "@/lib/api/content";
import { exigerUtilisateur } from "@/lib/admin/session";
import { LONGUEUR_MAX_BANDEAU, type EtatBandeau } from "@/lib/bandeau";
import { commiter } from "@/lib/contenu/depot";
import { cheminsContenu, lireDans, versJson } from "@/lib/contenu/stockage";

/** Publie le message du bandeau d'information (vide : bandeau masqué). */
export async function publierBandeau(
  _etat: EtatBandeau,
  formData: FormData,
): Promise<EtatBandeau> {
  const message = String(formData.get("message") ?? "").trim();

  if (message.length > LONGUEUR_MAX_BANDEAU) {
    return {
      statut: "erreur",
      message: `Le message ne doit pas dépasser ${LONGUEUR_MAX_BANDEAU} caractères.`,
    };
  }

  await exigerUtilisateur();

  try {
    await commiter("Back-office : bandeau d'information", async (lire) => {
      const statut = await lireDans(lire, "statut");
      return [
        {
          chemin: cheminsContenu.statut,
          contenu: versJson({
            ...statut,
            bandeau: {
              ...statut.bandeau,
              message,
              actif: message !== "",
              publieLe: new Date().toISOString(),
            },
          }),
        },
      ];
    });
  } catch (erreur) {
    console.error("Publication du bandeau impossible", erreur);
    return { statut: "erreur", message: "La publication a échoué. Réessayez dans un instant." };
  }

  updateTag(tags.bandeau);
  return {
    statut: "succes",
    message: message ? "Bandeau publié sur le site." : "Bandeau masqué sur le site.",
  };
}
