"use server";

import { updateTag } from "next/cache";

import { tags } from "@/lib/api/content";
import {
  lienAutorise,
  TAILLE_MAX_AFFICHE,
  TYPES_AFFICHE,
  type EtatPopup,
} from "@/lib/admin/popup";
import { aujourdhuiAParis, formatDate } from "@/lib/format";
import { creerClientServeur } from "@/lib/supabase/server";

const texte = (formData: FormData, champ: string) =>
  String(formData.get(champ) ?? "").trim();

/** Chemin d'un fichier du bucket « affiches » à partir de son URL publique. */
function cheminDansAffiches(url: string | null): string | null {
  if (!url) return null;
  const repere = "/storage/v1/object/public/affiches/";
  const index = url.indexOf(repere);
  return index === -1 ? null : decodeURIComponent(url.slice(index + repere.length));
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

  const supabase = await creerClientServeur();
  const { data: session } = await supabase.auth.getClaims();
  const identifiant = session?.claims?.sub;

  if (!identifiant) {
    return { statut: "erreur", message: "Session expirée. Reconnectez-vous." };
  }

  const { data: actuelle } = await supabase
    .from("popup")
    .select("affiche_url")
    .eq("id", "principal")
    .maybeSingle();

  let afficheUrl: string | null = actuelle?.affiche_url ?? null;
  const ancienneAffiche = cheminDansAffiches(afficheUrl);

  // Nouvelle affiche : validation, dépôt, puis l'ancienne est retirée.
  if (affiche instanceof File && affiche.size > 0) {
    if (!TYPES_AFFICHE.includes(affiche.type)) {
      return { statut: "erreur", message: "L'affiche doit être en JPEG, PNG ou WebP." };
    }
    if (affiche.size > TAILLE_MAX_AFFICHE) {
      return { statut: "erreur", message: "L'affiche dépasse 5 Mo." };
    }

    const extension = affiche.type.split("/")[1].replace("jpeg", "jpg");
    const chemin = `popup-${Date.now()}.${extension}`;

    const { error: erreurDepot } = await supabase.storage
      .from("affiches")
      .upload(chemin, affiche, { contentType: affiche.type, upsert: false });

    if (erreurDepot) {
      console.error("Dépôt de l'affiche impossible", erreurDepot);
      return { statut: "erreur", message: "L'envoi de l'affiche a échoué." };
    }

    afficheUrl = supabase.storage.from("affiches").getPublicUrl(chemin).data.publicUrl;
  } else if (retirerAffiche) {
    afficheUrl = null;
  }

  const { error } = await supabase
    .from("popup")
    .update({
      actif,
      titre,
      texte: corps,
      bouton_libelle: boutonLibelle || null,
      bouton_lien: boutonLien || null,
      debut,
      fin,
      affiche_url: afficheUrl,
      // Nouvelle version : les visiteurs qui avaient vu l'ancienne la reverront.
      maj_le: new Date().toISOString(),
      maj_par: identifiant,
    })
    .eq("id", "principal");

  if (error) {
    console.error("Enregistrement de la pop-up impossible", error);
    return { statut: "erreur", message: "L'enregistrement a échoué." };
  }

  // Fichier remplacé ou retiré : on nettoie le bucket (sans bloquer si ça échoue).
  if (ancienneAffiche && afficheUrl !== actuelle?.affiche_url) {
    await supabase.storage.from("affiches").remove([ancienneAffiche]);
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
