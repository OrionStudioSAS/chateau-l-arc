import type { InfoLangue } from "@/lib/i18n";

/** Langues comprises dans l'abonnement (le français compris). */
export const LANGUES_INCLUSES = 2;
/** Prix d'une langue supplémentaire, en euros HT par mois. */
export const PRIX_LANGUE_SUPPLEMENTAIRE = 9;

/**
 * Langues proposées par « Ajouter une langue ». Écritures de gauche à droite
 * seulement : l'arabe ou l'hébreu demanderaient une mise en page miroir.
 */
export const catalogueLangues: Pick<InfoLangue, "code" | "nom" | "natif" | "locale">[] = [
  { code: "en", nom: "Anglais", natif: "English", locale: "en_GB" },
  { code: "de", nom: "Allemand", natif: "Deutsch", locale: "de_DE" },
  { code: "es", nom: "Espagnol", natif: "Español", locale: "es_ES" },
  { code: "it", nom: "Italien", natif: "Italiano", locale: "it_IT" },
  { code: "nl", nom: "Néerlandais", natif: "Nederlands", locale: "nl_NL" },
  { code: "pt", nom: "Portugais", natif: "Português", locale: "pt_PT" },
  { code: "sv", nom: "Suédois", natif: "Svenska", locale: "sv_SE" },
  { code: "da", nom: "Danois", natif: "Dansk", locale: "da_DK" },
  { code: "nb", nom: "Norvégien", natif: "Norsk", locale: "nb_NO" },
  { code: "pl", nom: "Polonais", natif: "Polski", locale: "pl_PL" },
  { code: "ru", nom: "Russe", natif: "Русский", locale: "ru_RU" },
  { code: "zh", nom: "Chinois", natif: "中文", locale: "zh_CN" },
  { code: "ja", nom: "Japonais", natif: "日本語", locale: "ja_JP" },
  { code: "ko", nom: "Coréen", natif: "한국어", locale: "ko_KR" },
];
