import * as FR from "@/constants";
import { localeIntl, type Dictionnaire, type Langue } from "@/lib/i18n/langues";

/**
 * Langues du site public (Orion Translate).
 *
 * Le français est la langue source : textes de constants.ts, libellés écrits
 * dans les composants (`tr("…")`) et contenus du back-office. Les autres
 * langues ne stockent que leurs traductions, dans src/traductions/
 * traductions.json (publié depuis le back-office › Orion Translate) ; un
 * texte non traduit s'affiche en français.
 *
 * Module partagé serveur / navigateur : aucune dépendance au rendu.
 */

export * from "@/lib/i18n/langues";

export type Constantes = typeof FR;

/* ─── Textes de constants.ts ─────────────────────────────────────────── */

const memoire = new WeakMap<Dictionnaire, Constantes>();

/**
 * Constantes du site dans la langue du dictionnaire : la version française,
 * où chaque texte traduit remplace l'original (sans toucher aux images ni
 * aux valeurs non textuelles).
 */
export function appliquerConstantes(dico: Dictionnaire): Constantes {
  const deja = memoire.get(dico);
  if (deja) return deja;

  const resultat: Record<string, unknown> = { ...FR };
  const copies = new Set<unknown>();
  const copier = <T,>(valeur: T): T => {
    if (copies.has(valeur)) return valeur;
    const copie = (Array.isArray(valeur) ? [...valeur] : { ...(valeur as object) }) as T;
    copies.add(copie);
    return copie;
  };

  for (const [chemin, texte] of Object.entries(dico.constantes)) {
    if (!texte) continue;
    const [nom, rang, cle] = chemin.split(".");
    const original = resultat[nom];
    if (rang === undefined) {
      if (typeof original === "string") resultat[nom] = texte;
      continue;
    }
    if (!Array.isArray(original)) continue;
    const tableau = copier(original);
    resultat[nom] = tableau;
    const i = Number(rang);
    if (cle === undefined) {
      if (typeof tableau[i] === "string") tableau[i] = texte;
    } else if (tableau[i] && typeof tableau[i] === "object" && typeof tableau[i][cle] === "string") {
      tableau[i] = { ...tableau[i], [cle]: texte };
    }
  }

  const constantes = resultat as Constantes;
  memoire.set(dico, constantes);
  return constantes;
}

/* ─── Prix ──────────────────────────────────────────────────────────── */

/** « 2 280 € » en français, « €2,280 » en anglais. */
export function formateurEuros(langue: Langue): (montant: number) => string {
  if (langue === "fr") {
    const nombre = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });
    return (montant) => `${nombre.format(montant)} €`;
  }
  const monnaie = new Intl.NumberFormat(localeIntl(langue), { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
  return (montant) => monnaie.format(montant);
}

/* ─── Textes de l'interface ──────────────────────────────────────────── */

export type Traducteur = (francais: string) => string;

/** `tr("Réserver un départ")` → « Book a tee time » (ou le français à défaut). */
export const traducteur =
  (dico: Dictionnaire): Traducteur =>
  (francais) =>
    dico.interface[francais] || francais;
