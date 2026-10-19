import { LANGUE_PRINCIPALE, type Langue } from "@/lib/i18n/langues";

/**
 * Adresses traduites. Les pages sont rangées sous leur nom français
 * (app/[lang]/tarifs…) ; chaque langue peut donner à chaque segment un nom
 * dans sa langue, meilleur pour le référencement (« /en/rates »). Un segment
 * absent du tableau garde son nom français (slugs des compétitions…).
 *
 * Le français n'a pas de préfixe : « /tarifs », pas « /fr/tarifs ».
 */
const segments: Record<Langue, Record<string, string>> = {
  en: {
    "le-parcours": "the-course",
    tarifs: "rates",
    academie: "academy",
    resultats: "results",
    histoire: "history",
    actualites: "news",
  },
};

const inverses = Object.fromEntries(
  Object.entries(segments).map(([langue, table]) => [
    langue,
    Object.fromEntries(Object.entries(table).map(([fr, local]) => [local, fr])),
  ]),
) as Record<Langue, Record<string, string>>;

/** Sépare « /tarifs?x=1#carnets » en chemin et suffixe. */
function decouper(href: string): [string, string] {
  const i = href.search(/[?#]/);
  return i === -1 ? [href, ""] : [href.slice(0, i), href.slice(i)];
}

/** « /tarifs#carnets » en anglais → « /en/rates#carnets ». */
export function cheminLocal(cheminFrancais: string, langue: Langue): string {
  if (langue === LANGUE_PRINCIPALE || !cheminFrancais.startsWith("/")) return cheminFrancais;
  // Déjà localisé (« /en/rates ») : inchangé.
  const prefixe = `/${langue}`;
  if (cheminFrancais === prefixe || /^[/?#]/.test(cheminFrancais.slice(prefixe.length)) && cheminFrancais.startsWith(prefixe)) {
    return cheminFrancais;
  }
  const [chemin, suffixe] = decouper(cheminFrancais);
  const table = segments[langue] ?? {};
  const traduit = chemin
    .split("/")
    .filter(Boolean)
    .map((segment) => table[segment] ?? segment)
    .join("/");
  return `/${langue}${traduit ? `/${traduit}` : ""}${suffixe}`;
}

/** Chemin vu par le visiteur, sans la langue (« /rates ») → chemin des fichiers (« /tarifs »). */
export function cheminInterne(cheminTraduit: string, langue: Langue): string {
  const table = inverses[langue] ?? {};
  const interne = cheminTraduit
    .split("/")
    .filter(Boolean)
    .map((segment) => table[segment] ?? segment)
    .join("/");
  return `/${interne}`;
}

/** Vrai si un segment français a un nom traduit (« /en/tarifs » doit devenir « /en/rates »). */
export function aUnNomTraduit(cheminFrancais: string, langue: Langue): boolean {
  const table = segments[langue] ?? {};
  return cheminFrancais.split("/").some((segment) => segment in table);
}
