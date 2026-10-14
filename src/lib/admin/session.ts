import "server-only";

import { scrypt, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { COOKIE_SESSION, DUREE_SESSION_S, creerJeton, lireJeton } from "@/lib/admin/jeton";

export type Utilisateur = { email: string };

/**
 * Comptes du back-office, déclarés dans la variable ADMIN_COMPTES (Vercel et
 * .env.local) : une entrée par compte, séparées par des virgules, au format
 * produit par `node scripts/creer-compte-admin.mjs` :
 *   prenom@golf.fr:scrypt:<sel>:<empreinte>
 * Retirer une entrée coupe l'accès, y compris aux sessions déjà ouvertes.
 */
function comptes(): Map<string, { sel: Buffer; empreinte: Buffer }> {
  const liste = new Map<string, { sel: Buffer; empreinte: Buffer }>();

  for (const entree of (process.env.ADMIN_COMPTES ?? "").split(",")) {
    const [email, algo, sel, empreinte] = entree.trim().split(":");
    if (!email || algo !== "scrypt" || !sel || !empreinte) continue;
    liste.set(email.toLowerCase(), {
      sel: Buffer.from(sel, "base64url"),
      empreinte: Buffer.from(empreinte, "base64url"),
    });
  }
  return liste;
}

const hacher = (motDePasse: string, sel: Buffer) =>
  new Promise<Buffer>((resoudre, rejeter) =>
    scrypt(motDePasse, sel, 64, (erreur, cle) => (erreur ? rejeter(erreur) : resoudre(cle))),
  );

/** Vérifie le couple e-mail / mot de passe ; renvoie l'e-mail normalisé, ou null. */
export async function verifierIdentifiants(
  email: string,
  motDePasse: string,
): Promise<string | null> {
  const normalise = email.trim().toLowerCase();
  const compte = comptes().get(normalise);

  // Même calcul que le compte existe ou non : la durée ne trahit rien.
  const calcule = await hacher(motDePasse, compte?.sel ?? Buffer.alloc(16));
  if (!compte || calcule.length !== compte.empreinte.length) return null;

  return timingSafeEqual(calcule, compte.empreinte) ? normalise : null;
}

export async function ouvrirSession(email: string): Promise<void> {
  (await cookies()).set(COOKIE_SESSION, creerJeton(email), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    maxAge: DUREE_SESSION_S,
  });
}

export async function fermerSession(): Promise<void> {
  (await cookies()).delete({ name: COOKIE_SESSION, path: "/admin" });
}

/** Administrateur de la requête courante, ou null. */
export async function getUtilisateur(): Promise<Utilisateur | null> {
  const email = lireJeton((await cookies()).get(COOKIE_SESSION)?.value);
  return email && comptes().has(email) ? { email } : null;
}

/** Variante bloquante : redirige vers la connexion si la session manque. */
export async function exigerUtilisateur(): Promise<Utilisateur> {
  const utilisateur = await getUtilisateur();
  if (!utilisateur) redirect("/admin/connexion");
  return utilisateur;
}
