import "server-only";

import { lang } from "next/root-params";

import { constantes, dictionnaire } from "@/lib/i18n/dictionnaires";
import {
  estLangue,
  formateurEuros,
  LANGUE_PRINCIPALE,
  localeIntl,
  traducteur,
  type Langue,
} from "@/lib/i18n";
import { cheminLocal } from "@/lib/i18n/chemins";

/** Langue de la page en cours de rendu (segment racine `[lang]`). */
export async function langue(): Promise<Langue> {
  try {
    const valeur = await lang();
    return estLangue(valeur) ? valeur : LANGUE_PRINCIPALE;
  } catch {
    // Hors du site public (back-office, routes techniques).
    return LANGUE_PRINCIPALE;
  }
}

/**
 * Outils de traduction des composants serveur :
 *   const { T, tr, lien } = await i18n();
 * `T` : textes de constants.ts ; `tr` : libellés de l'interface ;
 * `lien` : chemin français → adresse dans la langue de la page.
 */
export async function i18n() {
  const code = await langue();
  return {
    langue: code,
    T: constantes(code),
    tr: traducteur(dictionnaire(code)),
    lien: (chemin: string) => cheminLocal(chemin, code),
    locale: localeIntl(code),
    euros: formateurEuros(code),
  };
}
