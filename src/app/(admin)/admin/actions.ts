"use server";

import type { Route } from "next";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";

import { tags } from "@/lib/api/content";
import { LONGUEUR_MAX_BANDEAU, type EtatBandeau } from "@/lib/bandeau";
import type { EtatConnexion } from "@/lib/auth-etats";
import { creerClientServeur } from "@/lib/supabase/server";

/** Connexion par e-mail et mot de passe (comptes créés dans Supabase). */
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

  const supabase = await creerClientServeur();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password: motDePasse,
  });

  if (error) {
    // Message volontairement générique : ne pas révéler si le compte existe.
    return { statut: "erreur", message: "E-mail ou mot de passe incorrect." };
  }

  // Un compte peut exister sans être administrateur (l'inscription publique
  // reste possible côté Supabase) : on referme la session dans ce cas.
  const { data: fiche } = await supabase
    .from("administrateurs")
    .select("id")
    .maybeSingle();

  if (!fiche) {
    await supabase.auth.signOut();
    return {
      statut: "erreur",
      message: "Ce compte n'a pas accès au back-office.",
    };
  }

  // `suite` vient de l'URL : on n'autorise que les chemins internes du back-office.
  const destination = suite.startsWith("/admin") ? suite : "/admin";
  redirect(destination as Route);
}

export async function seDeconnecter(): Promise<void> {
  const supabase = await creerClientServeur();
  await supabase.auth.signOut();
  redirect("/admin/connexion");
}

/**
 * Publie le message du bandeau dans Supabase, puis rafraîchit le cache
 * du site public.
 */
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

  const supabase = await creerClientServeur();
  const { data } = await supabase.auth.getClaims();
  const identifiant = data?.claims?.sub;

  if (!identifiant) {
    return {
      statut: "erreur",
      message: "Votre session a expiré. Reconnectez-vous pour publier.",
    };
  }

  const { error } = await supabase
    .from("bandeau")
    .update({
      message,
      actif: message !== "",
      publie_le: new Date().toISOString(),
      publie_par: identifiant,
    })
    .eq("id", "principal");

  if (error) {
    return {
      statut: "erreur",
      message: "La publication a échoué. Réessayez dans un instant.",
    };
  }

  updateTag(tags.bandeau);

  return { statut: "succes", message: "Bandeau publié sur le site." };
}
