import "server-only";

import traductions from "@/traductions/traductions.json";
import { appliquerConstantes, LANGUE_PRINCIPALE, type Constantes, type Dictionnaire, type FichierTraductions, type Langue } from "@/lib/i18n";

/**
 * Textes traduits de chaque langue (src/traductions/traductions.json, publié
 * depuis le back-office). Lus côté serveur seulement : le navigateur ne reçoit
 * que le dictionnaire de la page affichée (cf. LangueProvider).
 */
const fichier = traductions as FichierTraductions;

const VIDE: Dictionnaire = { constantes: {}, interface: {} };

export const dictionnaire = (langue: Langue): Dictionnaire =>
  langue === LANGUE_PRINCIPALE ? VIDE : (fichier[langue] ?? VIDE);

export const constantes = (langue: Langue): Constantes => appliquerConstantes(dictionnaire(langue));
