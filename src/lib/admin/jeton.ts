import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Jeton de session du back-office, sans base de données : un cookie signé
 * (HMAC-SHA256) qui porte l'e-mail et l'échéance. Partagé par le proxy et les
 * pages, d'où l'absence de « server-only » (le proxy tourne sous Node.js).
 */
export const COOKIE_SESSION = "admin_session";
export const DUREE_SESSION_S = 60 * 60 * 24 * 7;

type Charge = { email: string; exp: number };

function secret(): string | null {
  const valeur = process.env.ADMIN_SECRET_SESSION;
  if (valeur && valeur.length >= 32) return valeur;
  // En local seulement, une clé fixe évite d'avoir à en générer une.
  return process.env.NODE_ENV === "development" ? "developpement-local-uniquement-0000" : null;
}

const signer = (donnees: string, cle: string) =>
  createHmac("sha256", cle).update(donnees).digest("base64url");

export function creerJeton(email: string): string {
  const cle = secret();
  if (!cle) throw new Error("ADMIN_SECRET_SESSION manquante (32 caractères minimum).");

  const charge: Charge = { email, exp: Math.floor(Date.now() / 1000) + DUREE_SESSION_S };
  const donnees = Buffer.from(JSON.stringify(charge)).toString("base64url");
  return `${donnees}.${signer(donnees, cle)}`;
}

/** E-mail porté par un jeton valide et non expiré, sinon null. */
export function lireJeton(jeton: string | undefined): string | null {
  const cle = secret();
  if (!jeton || !cle) return null;

  const [donnees, signature] = jeton.split(".");
  if (!donnees || !signature) return null;

  const attendue = Buffer.from(signer(donnees, cle));
  const recue = Buffer.from(signature);
  if (attendue.length !== recue.length || !timingSafeEqual(attendue, recue)) return null;

  try {
    const charge = JSON.parse(Buffer.from(donnees, "base64url").toString()) as Charge;
    if (typeof charge.email !== "string" || charge.exp * 1000 < Date.now()) return null;
    return charge.email;
  } catch {
    return null;
  }
}
