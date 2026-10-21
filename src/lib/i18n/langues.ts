import donnees from "@/traductions/langues.json";

/**
 * Langues du site (sans les textes) : partagé par le proxy, le site et le
 * back-office. Les textes traduits sont dans traductions.json, lus côté
 * serveur seulement (lib/i18n/dictionnaires) pour ne pas alourdir le navigateur.
 */

export type Langue = string;
export type InfoLangue = {
  code: string;
  /** Nom en français (« Anglais »). */
  nom: string;
  /** Nom dans la langue (« English »), pour le sélecteur du site. */
  natif: string;
  /** Locale Open Graph (« en_GB »). */
  locale: string;
  principale: boolean;
  /** Visible sur le site (sélecteur, hreflang, sitemap). */
  publiee: boolean;
  /** Comprise dans l'abonnement (sinon langue supplémentaire facturée). */
  incluse: boolean;
  /** Traduction confiée à l'équipe Orion. */
  demandeOrion?: boolean;
};

export type Dictionnaire = {
  /** « CONSTANTE », « CONSTANTE.2 » ou « CONSTANTE.2.cle » → texte traduit. */
  constantes: Record<string, string>;
  /** Texte français de l'interface → texte traduit. */
  interface: Record<string, string>;
};

/** Contenu de src/traductions/traductions.json : code de langue → textes. */
export type FichierTraductions = Record<string, Dictionnaire>;

export const LANGUE_PRINCIPALE = "fr";
export const langues: InfoLangue[] = donnees as InfoLangue[];
/** Langues servies par le site (la principale comprise). */
export const codesLangues = langues.map((l) => l.code);
export const languesPubliees = langues.filter((l) => l.principale || l.publiee);

export const estLangue = (valeur: unknown): valeur is Langue =>
  typeof valeur === "string" && codesLangues.includes(valeur);

export const infoLangue = (langue: Langue) =>
  langues.find((l) => l.code === langue) ?? langues[0];

/** Locale des formats de date et de nombre (« en-GB »). */
export const localeIntl = (langue: Langue) => infoLangue(langue).locale.replace("_", "-");

