"use client";

import { createContext, useContext, useMemo } from "react";

import {
  appliquerConstantes,
  formateurEuros,
  LANGUE_PRINCIPALE,
  localeIntl,
  traducteur,
  type Dictionnaire,
  type Langue,
} from "@/lib/i18n";
import { cheminLocal } from "@/lib/i18n/chemins";

const VIDE: Dictionnaire = { constantes: {}, interface: {} };

const Contexte = createContext<{ langue: Langue; dico: Dictionnaire }>({
  langue: LANGUE_PRINCIPALE,
  dico: VIDE,
});

/**
 * Langue de la page pour les composants client. Le dictionnaire de la seule
 * langue affichée est transmis par le layout (rien pour le français).
 */
export function LangueProvider({
  langue,
  dico,
  children,
}: {
  langue: Langue;
  dico: Dictionnaire;
  children: React.ReactNode;
}) {
  const valeur = useMemo(() => ({ langue, dico }), [langue, dico]);
  return <Contexte.Provider value={valeur}>{children}</Contexte.Provider>;
}

/** Équivalent client de `i18n()` (lib/i18n/serveur). */
export function useI18n() {
  const { langue, dico } = useContext(Contexte);
  return useMemo(
    () => ({
      langue,
      T: appliquerConstantes(dico),
      tr: traducteur(dico),
      lien: (chemin: string) => cheminLocal(chemin, langue),
      locale: localeIntl(langue),
      euros: formateurEuros(langue),
    }),
    [langue, dico],
  );
}
