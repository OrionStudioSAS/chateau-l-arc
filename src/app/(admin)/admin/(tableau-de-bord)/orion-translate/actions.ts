"use server";

import { exigerUtilisateur } from "@/lib/admin/session";
import { analyser, CHEMIN_CONSTANTES } from "@/lib/cms/constantes";
import { commiter, type Changement } from "@/lib/contenu/depot";
import { versJson } from "@/lib/contenu/stockage";
import type { Dictionnaire, FichierTraductions, InfoLangue } from "@/lib/i18n";
import { catalogueLangues, LANGUES_INCLUSES } from "@/lib/traductions/catalogue";
import { CHEMINS_TRADUCTIONS, type Origines } from "@/lib/traductions/depot";
import { textesDesConstantes } from "@/lib/traductions/textes";

export type ResultatTraduction = { ok: boolean; message: string };

const PUBLIE = "Publié : le site sera à jour d'ici une à deux minutes (reconstruction).";
const ECHEC = "La publication a échoué. Réessayez dans un instant.";

type Fichiers = { langues: InfoLangue[]; traductions: FichierTraductions; origines: Origines };

/**
 * Lit les trois fichiers d'Orion Translate dans le dépôt, applique `modifier`
 * et les commite ensemble. `modifier` renvoie un message d'erreur pour annuler.
 */
async function publier(message: string, modifier: (f: Fichiers, lire: (chemin: string) => Promise<string | null>) => Promise<string | null> | string | null): Promise<ResultatTraduction> {
  await exigerUtilisateur();
  let refus: string | null = null;
  try {
    const resultat = await commiter(message, async (lire) => {
      const [langues, traductions, origines] = await Promise.all([
        lire(CHEMINS_TRADUCTIONS.langues),
        lire(CHEMINS_TRADUCTIONS.traductions),
        lire(CHEMINS_TRADUCTIONS.origines),
      ]);
      if (langues === null) throw new Error("langues.json introuvable");
      const fichiers: Fichiers = {
        langues: JSON.parse(langues),
        traductions: traductions ? JSON.parse(traductions) : {},
        origines: origines ? JSON.parse(origines) : {},
      };
      refus = await modifier(fichiers, lire);
      if (refus) return null;
      const changements: Changement[] = [
        { chemin: CHEMINS_TRADUCTIONS.langues, contenu: versJson(fichiers.langues) },
        { chemin: CHEMINS_TRADUCTIONS.traductions, contenu: versJson(fichiers.traductions) },
        { chemin: CHEMINS_TRADUCTIONS.origines, contenu: versJson(fichiers.origines) },
      ];
      return changements;
    });
    if (refus) return { ok: false, message: refus };
    if (!resultat) return { ok: true, message: "Rien n'a changé : tout est déjà à jour." };
  } catch (erreur) {
    console.error("Publication des traductions impossible", erreur);
    return { ok: false, message: ECHEC };
  }
  return { ok: true, message: PUBLIE };
}

const langueModifiable = (langues: InfoLangue[], code: string) => {
  const langue = langues.find((l) => l.code === code);
  return langue && !langue.principale ? langue : null;
};

/** Trie les clés : diffs GitHub lisibles et stables. */
const trier = (objet: Record<string, string>) =>
  Object.fromEntries(Object.entries(objet).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)));

const MAX_TEXTES = 3000;
const MAX_LONGUEUR = 5000;

/**
 * Enregistre des traductions d'une langue (texte vide : traduction retirée,
 * le français s'affiche). Pour les champs de constants.ts, on garde aussi le
 * texte français traduit, pour signaler plus tard une traduction « à revoir ».
 */
export async function enregistrerTraductions(
  code: string,
  modifications: Dictionnaire,
): Promise<ResultatTraduction> {
  const nombre = Object.keys(modifications.constantes ?? {}).length + Object.keys(modifications.interface ?? {}).length;
  if (nombre === 0) return { ok: false, message: "Aucune modification à publier." };
  if (nombre > MAX_TEXTES) return { ok: false, message: "Trop de modifications d'un coup." };

  return publier(`Back-office : traductions (${code}, ${nombre} texte${nombre > 1 ? "s" : ""})`, async (f, lire) => {
    const langue = langueModifiable(f.langues, code);
    if (!langue) return "Langue inconnue. Rechargez la page.";

    const source = await lire(CHEMIN_CONSTANTES);
    if (source === null) throw new Error("constants.ts introuvable");
    const francais = new Map(
      textesDesConstantes(analyser(source)).flatMap((g) => g.textes.map((t) => [t.cle, t.francais] as const)),
    );

    const dico: Dictionnaire = f.traductions[code] ?? { constantes: {}, interface: {} };
    const origines = f.origines[code] ?? {};
    for (const [cle, valeur] of Object.entries(modifications.constantes ?? {})) {
      if (!francais.has(cle)) return `Champ inconnu : ${cle}. Rechargez la page.`;
      const texte = String(valeur ?? "").trim().slice(0, MAX_LONGUEUR);
      if (texte) {
        dico.constantes[cle] = texte;
        origines[cle] = francais.get(cle)!;
      } else {
        delete dico.constantes[cle];
        delete origines[cle];
      }
    }
    for (const [cle, valeur] of Object.entries(modifications.interface ?? {})) {
      if (!cle.trim() || cle.length > MAX_LONGUEUR) continue;
      const texte = String(valeur ?? "").trim().slice(0, MAX_LONGUEUR);
      if (texte) dico.interface[cle] = texte;
      else delete dico.interface[cle];
    }
    f.traductions[code] = { constantes: trier(dico.constantes), interface: trier(dico.interface) };
    f.origines[code] = trier(origines);
    return null;
  });
}

/** Ajoute une langue, non publiée : le client la traduit, ou la confie à Orion. */
export async function ajouterLangue(code: string, parOrion: boolean): Promise<ResultatTraduction> {
  const modele = catalogueLangues.find((l) => l.code === code);
  if (!modele) return { ok: false, message: "Langue non proposée." };

  return publier(`Back-office : ajout de la langue ${modele.nom.toLowerCase()}`, (f) => {
    if (f.langues.some((l) => l.code === code)) return `${modele.nom} est déjà dans la liste.`;
    const incluses = f.langues.filter((l) => l.incluse).length;
    f.langues.push({
      ...modele,
      principale: false,
      publiee: false,
      incluse: incluses < LANGUES_INCLUSES,
      ...(parOrion ? { demandeOrion: true } : {}),
    });
    f.traductions[code] = f.traductions[code] ?? { constantes: {}, interface: {} };
    return null;
  });
}

/** Rend une langue visible sur le site (sélecteur, Google) ou la masque. */
export async function changerPublication(code: string, publiee: boolean): Promise<ResultatTraduction> {
  return publier(`Back-office : ${publiee ? "publication" : "retrait"} de la langue ${code}`, (f) => {
    const langue = langueModifiable(f.langues, code);
    if (!langue) return "Langue inconnue. Rechargez la page.";
    langue.publiee = publiee;
    return null;
  });
}

/** Retire une langue masquée et ses traductions. */
export async function supprimerLangue(code: string): Promise<ResultatTraduction> {
  return publier(`Back-office : suppression de la langue ${code}`, (f) => {
    const langue = langueModifiable(f.langues, code);
    if (!langue) return "Langue inconnue. Rechargez la page.";
    if (langue.publiee) return "Masquez d'abord la langue du site avant de la supprimer.";
    f.langues = f.langues.filter((l) => l.code !== code);
    delete f.traductions[code];
    delete f.origines[code];
    // Une place incluse libérée revient à la langue supplémentaire suivante.
    let places = LANGUES_INCLUSES;
    for (const l of f.langues) {
      l.incluse = l.principale || places > 0;
      if (l.incluse) places -= 1;
    }
    return null;
  });
}
