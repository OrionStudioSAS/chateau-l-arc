import "server-only";

import { redirect } from "next/navigation";

import { creerClientServeur } from "@/lib/supabase/server";

export type Utilisateur = {
  id: string;
  email: string;
};

/**
 * Administrateur de la requête courante, ou null.
 *
 * `getClaims` vérifie la signature du JWT : c'est la seule lecture de session
 * fiable côté serveur (`getSession` ne revalide pas le jeton). Être
 * authentifié ne suffit pas pour autant — l'inscription reste ouverte via la
 * clé publishable — d'où la vérification d'appartenance à `administrateurs`.
 */
export async function getUtilisateur(): Promise<Utilisateur | null> {
  const supabase = await creerClientServeur();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;

  if (!claims?.sub) return null;

  const { data: fiche } = await supabase
    .from("administrateurs")
    .select("id")
    .eq("id", claims.sub)
    .maybeSingle();

  if (!fiche) return null;

  return { id: claims.sub, email: (claims.email as string) ?? "" };
}

/** Variante bloquante : redirige vers la connexion si la session manque. */
export async function exigerUtilisateur(): Promise<Utilisateur> {
  const utilisateur = await getUtilisateur();
  if (!utilisateur) redirect("/admin/connexion");
  return utilisateur;
}
