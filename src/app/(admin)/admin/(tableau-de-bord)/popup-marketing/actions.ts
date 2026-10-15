"use server";

import { updateTag } from "next/cache";

import { tags } from "@/lib/api/content";
import {
  lienAutorise,
  LONGUEUR_MAX_TEXTE,
  LONGUEUR_MAX_TITRE,
  TAILLE_MAX_AFFICHE,
  TYPES_AFFICHE,
} from "@/lib/admin/popup";
import { exigerUtilisateur } from "@/lib/admin/session";
import { commiter, type Changement } from "@/lib/contenu/depot";
import { cheminsContenu, DOSSIER_FICHIERS, lireDans, versJson } from "@/lib/contenu/stockage";
import { aujourdhuiAParis, formatDate } from "@/lib/format";

export type BrouillonPopup = {
  actif: boolean;
  titre: string;
  texte: string;
  boutonLibelle: string;
  boutonLien: string;
  debut: string;
  fin: string;
  /** Vrai pour retirer l'image publiée (sans en envoyer une nouvelle). */
  retirerAffiche: boolean;
};

/** Chemin dans le dépôt d'un fichier servi par /fichiers/…, ou null. */
function cheminDansDepot(url: string | null): string | null {
  return url?.startsWith("/fichiers/")
    ? `${DOSSIER_FICHIERS}/${url.slice("/fichiers/".length)}`
    : null;
}

/**
 * Publie la pop-up (contenu, période, image) en un seul commit, puis rafraîchit
 * le site. Chaque publication change la version : les visiteurs qui avaient
 * fermé l'ancienne voient la nouvelle.
 */
export async function publierPopup(formData: FormData): Promise<{ ok: boolean; message: string }> {
  await exigerUtilisateur();

  let b: BrouillonPopup;
  try {
    b = JSON.parse(String(formData.get("donnees") ?? "")) as BrouillonPopup;
  } catch {
    return { ok: false, message: "Données illisibles. Rechargez la page." };
  }

  const titre = b.titre.trim();
  const texte = b.texte.trim();
  const boutonLibelle = b.boutonLibelle.trim();
  const boutonLien = b.boutonLien.trim();
  const debut = b.debut || null;
  const fin = b.fin || null;
  const affiche = formData.get("affiche");

  if (b.actif && !titre) return { ok: false, message: "Un titre est nécessaire pour activer la pop-up." };
  if (titre.length > LONGUEUR_MAX_TITRE) return { ok: false, message: `Titre : ${LONGUEUR_MAX_TITRE} caractères maximum.` };
  if (texte.length > LONGUEUR_MAX_TEXTE) return { ok: false, message: `Texte : ${LONGUEUR_MAX_TEXTE} caractères maximum.` };
  if (boutonLibelle && !boutonLien) return { ok: false, message: "Le bouton a besoin d'un lien." };
  if (boutonLien && !lienAutorise(boutonLien)) {
    return { ok: false, message: "Lien invalide : utilisez /une-page, https://…, tel:… ou mailto:…" };
  }
  if (debut && fin && debut > fin) return { ok: false, message: "La date de fin précède la date de début." };
  if (b.actif && fin && fin < aujourdhuiAParis()) {
    return {
      ok: false,
      message: `La période s'est terminée le ${formatDate(fin)} : changez les dates pour publier.`,
    };
  }

  let nouvelle: { chemin: string; contenu: Uint8Array } | null = null;
  if (affiche instanceof File && affiche.size > 0) {
    if (!TYPES_AFFICHE.includes(affiche.type)) return { ok: false, message: "L'image doit être en JPEG, PNG ou WebP." };
    if (affiche.size > TAILLE_MAX_AFFICHE) return { ok: false, message: "L'image dépasse 2 Mo." };
    const extension = affiche.type.split("/")[1].replace("jpeg", "jpg");
    nouvelle = {
      chemin: `affiches/popup-${Date.now()}.${extension}`,
      contenu: new Uint8Array(await affiche.arrayBuffer()),
    };
  }

  try {
    await commiter("Back-office : pop-up marketing", async (lire) => {
      const actuelle = await lireDans(lire, "popup");
      const afficheUrl = nouvelle
        ? `/fichiers/${nouvelle.chemin}`
        : b.retirerAffiche
          ? null
          : actuelle.afficheUrl;

      const changements: Changement[] = [
        {
          chemin: cheminsContenu.popup,
          contenu: versJson({
            actif: b.actif,
            titre,
            texte,
            boutonLibelle: boutonLibelle || null,
            boutonLien: boutonLien || null,
            debut,
            fin,
            afficheUrl,
            version: new Date().toISOString(),
          }),
        },
      ];
      if (nouvelle) {
        changements.push({ chemin: `${DOSSIER_FICHIERS}/${nouvelle.chemin}`, contenu: nouvelle.contenu });
      }
      // Image remplacée ou retirée : elle quitte le dépôt (reste dans l'historique).
      const ancienne = cheminDansDepot(actuelle.afficheUrl);
      if (ancienne && afficheUrl !== actuelle.afficheUrl) changements.push({ chemin: ancienne, contenu: null });
      return changements;
    });
  } catch (erreur) {
    console.error("Publication de la pop-up impossible", erreur);
    return { ok: false, message: "La publication a échoué. Réessayez dans un instant." };
  }

  updateTag(tags.popup);

  return {
    ok: true,
    message: !b.actif
      ? "Pop-up désactivée : elle ne s'affiche plus sur le site."
      : debut && debut > aujourdhuiAParis()
        ? `Pop-up programmée : visible à partir du ${formatDate(debut)}.`
        : "Pop-up publiée sur le site.",
  };
}
