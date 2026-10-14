"use server";

import { updateTag } from "next/cache";

import { tags } from "@/lib/api/content";
import {
  lienAutorise,
  TAILLE_MAX_AFFICHE,
  TYPES_AFFICHE,
  type EtatPopup,
} from "@/lib/admin/popup";
import { exigerUtilisateur } from "@/lib/admin/session";
import { commiter, type Changement } from "@/lib/contenu/depot";
import { cheminsContenu, DOSSIER_FICHIERS, lireDans, versJson } from "@/lib/contenu/stockage";
import { aujourdhuiAParis, formatDate } from "@/lib/format";

const texte = (formData: FormData, champ: string) =>
  String(formData.get(champ) ?? "").trim();

/** Chemin dans le dépôt d'un fichier servi par /fichiers/…, ou null. */
function cheminDansDepot(url: string | null): string | null {
  return url?.startsWith("/fichiers/")
    ? `${DOSSIER_FICHIERS}/${url.slice("/fichiers/".length)}`
    : null;
}

export async function enregistrerPopup(
  _etat: EtatPopup,
  formData: FormData,
): Promise<EtatPopup> {
  const actif = formData.get("actif") === "on";
  const titre = texte(formData, "titre");
  const corps = texte(formData, "texte");
  const boutonLibelle = texte(formData, "boutonLibelle");
  const boutonLien = texte(formData, "boutonLien");
  const debut = texte(formData, "debut") || null;
  const fin = texte(formData, "fin") || null;
  const retirerAffiche = formData.get("retirerAffiche") === "on";
  const affiche = formData.get("affiche");

  if (actif && !titre) {
    return { statut: "erreur", message: "Un titre est nécessaire pour activer la pop-up." };
  }
  if (boutonLibelle && !boutonLien) {
    return { statut: "erreur", message: "Le bouton a besoin d'un lien." };
  }
  if (boutonLien && !lienAutorise(boutonLien)) {
    return {
      statut: "erreur",
      message: "Lien invalide : utilisez /une-page, https://…, tel:… ou mailto:…",
    };
  }
  if (debut && fin && debut > fin) {
    return { statut: "erreur", message: "La date de fin précède la date de début." };
  }
  if (actif && fin && fin < aujourdhuiAParis()) {
    return {
      statut: "erreur",
      message: `La période d'affichage s'est terminée le ${formatDate(fin)} : changez les dates pour publier.`,
    };
  }

  await exigerUtilisateur();

  // Nouvelle affiche : validation avant tout envoi.
  let nouvelleAffiche: { chemin: string; contenu: Uint8Array } | null = null;

  if (affiche instanceof File && affiche.size > 0) {
    if (!TYPES_AFFICHE.includes(affiche.type)) {
      return { statut: "erreur", message: "L'affiche doit être en JPEG, PNG ou WebP." };
    }
    if (affiche.size > TAILLE_MAX_AFFICHE) {
      return { statut: "erreur", message: "L'affiche dépasse 4 Mo." };
    }

    const extension = affiche.type.split("/")[1].replace("jpeg", "jpg");
    nouvelleAffiche = {
      chemin: `affiches/popup-${Date.now()}.${extension}`,
      contenu: new Uint8Array(await affiche.arrayBuffer()),
    };
  }

  try {
    await commiter("Back-office : pop-up marketing", async (lire) => {
      const actuelle = await lireDans(lire, "popup");
      const afficheUrl = nouvelleAffiche
        ? `/fichiers/${nouvelleAffiche.chemin}`
        : retirerAffiche
          ? null
          : actuelle.afficheUrl;

      const changements: Changement[] = [
        {
          chemin: cheminsContenu.popup,
          contenu: versJson({
            actif,
            titre,
            texte: corps,
            boutonLibelle: boutonLibelle || null,
            boutonLien: boutonLien || null,
            debut,
            fin,
            afficheUrl,
            // Nouvelle version : les visiteurs qui avaient vu l'ancienne la reverront.
            version: new Date().toISOString(),
          }),
        },
      ];

      if (nouvelleAffiche) {
        changements.push({
          chemin: `${DOSSIER_FICHIERS}/${nouvelleAffiche.chemin}`,
          contenu: nouvelleAffiche.contenu,
        });
      }

      // Affiche remplacée ou retirée : elle quitte le dépôt (reste dans l'historique).
      const ancienne = cheminDansDepot(actuelle.afficheUrl);
      if (ancienne && afficheUrl !== actuelle.afficheUrl) {
        changements.push({ chemin: ancienne, contenu: null });
      }

      return changements;
    });
  } catch (erreur) {
    console.error("Enregistrement de la pop-up impossible", erreur);
    return { statut: "erreur", message: "L'enregistrement a échoué." };
  }

  updateTag(tags.popup);

  return {
    statut: "succes",
    message: !actif
      ? "Pop-up enregistrée, mais désactivée : elle ne s'affiche pas sur le site."
      : debut && debut > aujourdhuiAParis()
        ? `Pop-up programmée : elle s'affichera à partir du ${formatDate(debut)}.`
        : "Pop-up publiée : elle s'affiche sur le site.",
  };
}
