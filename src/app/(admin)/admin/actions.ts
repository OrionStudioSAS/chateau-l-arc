"use server";

import type { Route } from "next";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";

import { tags } from "@/lib/api/content";
import { LONGUEUR_MAX_BANDEAU, type EtatBandeau } from "@/lib/bandeau";
import type { EtatConnexion } from "@/lib/auth-etats";
import { LONGUEUR_MAX_PRECISION } from "@/lib/statut";
import {
  exigerUtilisateur,
  fermerSession,
  ouvrirSession,
  verifierIdentifiants,
} from "@/lib/admin/session";
import { commiter } from "@/lib/contenu/depot";
import { cheminsContenu, lireDans, versJson } from "@/lib/contenu/stockage";

/** Connexion par e-mail et mot de passe (comptes déclarés dans ADMIN_COMPTES). */
export async function seConnecter(
  _etat: EtatConnexion,
  formData: FormData,
): Promise<EtatConnexion> {
  const email = String(formData.get("email") ?? "").trim();
  const motDePasse = String(formData.get("motDePasse") ?? "");
  const suite = String(formData.get("suite") ?? "/admin");

  if (!email || !motDePasse) {
    return { statut: "erreur", message: "Renseignez votre e-mail et votre mot de passe." };
  }

  const compte = await verifierIdentifiants(email, motDePasse);

  if (!compte) {
    // Message volontairement générique : ne pas révéler si le compte existe.
    return { statut: "erreur", message: "E-mail ou mot de passe incorrect." };
  }

  try {
    await ouvrirSession(compte);
  } catch (erreur) {
    console.error("Ouverture de session impossible", erreur);
    return { statut: "erreur", message: "Back-office mal configuré : contactez Orion." };
  }

  // `suite` vient de l'URL : on n'autorise que les chemins internes du back-office.
  const destination = suite.startsWith("/admin") ? suite : "/admin";
  redirect(destination as Route);
}

export async function seDeconnecter(): Promise<void> {
  await fermerSession();
  redirect("/admin/connexion");
}

/**
 * Publie d'un coup l'état des installations et le message du bandeau, puis
 * rafraîchit le site public (en-tête et bandeau).
 */
export async function publierStatutEtBandeau(
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

  const maintenant = new Date().toISOString();
  let erreurSaisie = null as string | null;

  try {
    await commiter("Back-office : statut du golf et bandeau", async (lire) => {
      const statut = await lireDans(lire, "statut");

      // La liste des installations fait foi : on ne touche qu'aux clés connues.
      const installations = statut.installations.map((installation) => ({
        ...installation,
        actif: formData.get(`statut-${installation.cle}`) === "on",
        precision: String(formData.get(`precision-${installation.cle}`) ?? "").trim() || null,
        majLe: maintenant,
      }));

      if (installations.some((i) => i.precision && i.precision.length > LONGUEUR_MAX_PRECISION)) {
        erreurSaisie = `Une précision dépasse ${LONGUEUR_MAX_PRECISION} caractères.`;
        return null;
      }

      return [
        {
          chemin: cheminsContenu.statut,
          contenu: versJson({
            bandeau: { ...statut.bandeau, message, actif: message !== "", publieLe: maintenant },
            installations,
          }),
        },
      ];
    });
  } catch (erreur) {
    console.error("Publication du statut ou du bandeau impossible", erreur);
    return {
      statut: "erreur",
      message: "La publication a échoué. Réessayez dans un instant.",
    };
  }

  if (erreurSaisie) return { statut: "erreur", message: erreurSaisie };

  updateTag(tags.statut);
  updateTag(tags.bandeau);

  return { statut: "succes", message: "Statut et bandeau publiés sur le site." };
}
