import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";

import groupesInterface from "@/traductions/interface.json";
import { analyser, CHEMIN_CONSTANTES } from "@/lib/cms/constantes";
import { depotConfigure, lireTexte } from "@/lib/contenu/depot";
import { lireContenu } from "@/lib/contenu/stockage";
import type { FichierTraductions, InfoLangue } from "@/lib/i18n";
import { textesDesConstantes, textesInterface, type GroupeTextes, type GroupesInterface } from "@/lib/traductions/textes";

/** Fichiers d'Orion Translate dans le dépôt. */
export const CHEMINS_TRADUCTIONS = {
  langues: "src/traductions/langues.json",
  traductions: "src/traductions/traductions.json",
  /** Texte français de chaque champ de constants.ts au moment de sa traduction (« à revoir »). */
  origines: "src/traductions/origines.json",
} as const;

export type Origines = Record<string, Record<string, string>>;

export type EtatTraductions = {
  langues: InfoLangue[];
  traductions: FichierTraductions;
  origines: Origines;
  groupes: GroupeTextes[];
};

/** Dernière version publiée d'un fichier (GitHub), sinon la copie locale. */
async function lire(chemin: string): Promise<string> {
  if (depotConfigure()) {
    try {
      const texte = await lireTexte(chemin);
      if (texte !== null) return texte;
    } catch (erreur) {
      console.error(`Lecture de ${chemin} sur GitHub impossible`, erreur);
    }
  }
  return readFile(path.join(/* turbopackIgnore: true */ process.cwd(), chemin), "utf8").catch(() => "");
}

const json = <T,>(texte: string, secours: T): T => {
  try {
    return texte ? (JSON.parse(texte) as T) : secours;
  } catch {
    return secours;
  }
};

/** Textes des contenus du back-office en ligne (mêmes champs que scripts/extraire-textes.mjs). */
async function textesBackOffice(): Promise<string[] | null> {
  try {
    const [tarifs, statut, popup, competitions] = await Promise.all([
      lireContenu("tarifs"),
      lireContenu("statut"),
      lireContenu("popup"),
      lireContenu("competitions"),
    ]);
    const textes: (string | null | undefined)[] = [];
    for (const ligne of [...tarifs.greenFees, ...tarifs.carnets, ...tarifs.locations, ...tarifs.abonnements]) {
      textes.push(ligne.libelle, ligne.detail);
    }
    textes.push(statut.bandeau?.message, statut.bandeau?.lien?.label);
    for (const i of statut.installations) textes.push(i.libelle, i.description, i.precision);
    textes.push(popup?.titre, popup?.texte, popup?.boutonLibelle);
    for (const c of competitions) {
      if (c.statut !== "publie") continue;
      textes.push(
        c.nom, c.formule, c.depart, c.trous, c.indexMaximum, c.categories, c.inclus,
        c.modeInscription, c.droitJeuMembres, c.droitJeuVisiteurs, c.description,
      );
    }
    return [...new Set(textes.map((t) => t?.trim() ?? "").filter((t) => /[A-Za-zÀ-ÿ]{2}/.test(t)))];
  } catch (erreur) {
    console.error("Lecture des contenus du back-office impossible", erreur);
    return null;
  }
}

/** Langues, traductions et textes à traduire, dans leur dernière version publiée. */
export async function lireEtatTraductions(): Promise<EtatTraductions> {
  const [langues, traductions, origines, constantes, backOffice] = await Promise.all([
    lire(CHEMINS_TRADUCTIONS.langues),
    lire(CHEMINS_TRADUCTIONS.traductions),
    lire(CHEMINS_TRADUCTIONS.origines),
    lire(CHEMIN_CONSTANTES),
    textesBackOffice(),
  ]);
  return {
    langues: json<InfoLangue[]>(langues, []),
    traductions: json<FichierTraductions>(traductions, {}),
    origines: json<Origines>(origines, {}),
    groupes: [
      ...textesDesConstantes(analyser(constantes)),
      ...textesInterface(groupesInterface as GroupesInterface, backOffice),
    ],
  };
}
