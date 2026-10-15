"use server";

import type { Route } from "next";
import { redirect } from "next/navigation";

import type { EtatConnexion } from "@/lib/auth-etats";
import {
  fermerSession,
  ouvrirSession,
  verifierIdentifiants,
} from "@/lib/admin/session";

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
