import { pagesCms } from "@/config/pages-cms";
import { estImage, type SectionCms } from "@/lib/cms/constantes";
import type { Dictionnaire } from "@/lib/i18n";

/**
 * Textes à traduire (Orion Translate), groupés pour l'écran « Gérer » :
 *   - les champs de constants.ts, par section (mêmes textes que l'éditeur
 *     visuel des pages) ; clé : « CONSTANTE », « CONSTANTE.2 », « CONSTANTE.2.cle » ;
 *   - les libellés de l'interface (src/traductions/interface.json) et les
 *     contenus du back-office ; clé : le texte français lui-même.
 * Module sans dépendance serveur : partagé avec l'écran (navigateur).
 */

export type SourceTexte = keyof Dictionnaire;

export type TexteATraduire = {
  cle: string;
  source: SourceTexte;
  francais: string;
  /** Nom du champ (« Titre », « Questions 3 · réponse »), vide pour l'interface. */
  libelle: string;
};

export type CategorieTextes = "Pages" | "Interface du site" | "Contenus du back-office";

export type GroupeTextes = {
  id: string;
  titre: string;
  categorie: CategorieTextes;
  /** Page de l'éditeur visuel (Pages › …) où modifier le français. */
  page: string | null;
  textes: TexteATraduire[];
};

/** Interface : groupes de src/traductions/interface.json. */
export type GroupesInterface = { groupe: string; textes: { texte: string; origine: string }[] }[];

const CONSTANTES_IGNOREES = /_(IMAGE|VIDEO|PHOTOS|LIEN|URL|ID)$/;
// « lien » est parfois le texte du bouton (PROFITER_CARTES) : les adresses sont écartées par aTraduire.
// « nom » : noms propres (enseignants), identiques dans toutes les langues.
const CLES_IGNOREES = new Set(["href", "url", "image", "photo", "video", "nom"]);

/** Vrai pour un texte lisible (ni image, ni adresse, ni nombre seul). */
export const aTraduire = (valeur: string) =>
  /[A-Za-zÀ-ÿ]/.test(valeur) && !estImage(valeur) && !/^(\/|https?:|tel:|mailto:|#)/.test(valeur.trim());

const pageDeSection = (section: string) => {
  const titre = section.split(" · ")[0];
  return pagesCms.find((p) => p.titre === titre)?.cle ?? null;
};

/** Champs textuels de constants.ts, une entrée par section. */
export function textesDesConstantes(sections: SectionCms[]): GroupeTextes[] {
  return sections
    .map((section): GroupeTextes => {
      const textes: TexteATraduire[] = [];
      const ajouter = (cle: string, francais: string, libelle: string) => {
        if (aTraduire(francais)) textes.push({ cle, source: "constantes", francais, libelle });
      };
      for (const champ of section.champs) {
        if (CONSTANTES_IGNOREES.test(champ.nom)) continue;
        if (champ.type === "texte") ajouter(champ.nom, champ.valeur, champ.libelle);
        else if (champ.type === "liste") champ.valeur.forEach((v, i) => ajouter(`${champ.nom}.${i}`, v, `${champ.libelle} ${i + 1}`));
        else
          champ.valeur.forEach((objet, i) =>
            Object.entries(objet).forEach(([cle, v]) => {
              if (!CLES_IGNOREES.has(cle)) ajouter(`${champ.nom}.${i}.${cle}`, v, `${champ.libelle} ${i + 1} · ${cle}`);
            }),
          );
      }
      return { id: `page:${section.nom}`, titre: section.nom, categorie: "Pages", page: pageDeSection(section.nom), textes };
    })
    .filter((g) => g.textes.length > 0);
}

/**
 * Libellés de l'interface, sans doublon (un texte présent dans deux groupes
 * n'est listé que dans le premier). `contenus` remplace le groupe « Contenus
 * du back-office » du fichier (version du dernier build) par la version en ligne.
 */
export function textesInterface(groupes: GroupesInterface, contenus: string[] | null): GroupeTextes[] {
  const vus = new Set<string>();
  const resultat: GroupeTextes[] = [];
  const ajouter = (titre: string, categorie: CategorieTextes, liste: string[]) => {
    const textes = liste
      .filter((t) => !vus.has(t) && vus.add(t))
      .map((francais): TexteATraduire => ({ cle: francais, source: "interface", francais, libelle: "" }));
    if (textes.length) resultat.push({ id: `interface:${titre}`, titre, categorie, page: null, textes });
  };
  for (const { groupe, textes } of groupes) {
    if (groupe === "Contenus du back-office") continue;
    ajouter(groupe, "Interface du site", textes.map((t) => t.texte));
  }
  const backOffice = contenus ?? groupes.find((g) => g.groupe === "Contenus du back-office")?.textes.map((t) => t.texte) ?? [];
  ajouter("Tarifs, compétitions, statut et pop-up", "Contenus du back-office", backOffice);
  return resultat;
}

export const estTraduit = (texte: TexteATraduire, dico: Dictionnaire | undefined) =>
  Boolean(dico?.[texte.source][texte.cle]?.trim());

/**
 * Traduction faite sur un texte français modifié depuis (champs de
 * constants.ts seulement : l'interface est indexée par le texte français).
 */
export const estARevoir = (texte: TexteATraduire, dico: Dictionnaire | undefined, origines: Record<string, string> | undefined) =>
  texte.source === "constantes" && estTraduit(texte, dico) && origines?.[texte.cle] !== undefined && origines[texte.cle] !== texte.francais;

/** Nombre de textes traduits et total, pour une langue. */
export function avancement(groupes: GroupeTextes[], dico: Dictionnaire | undefined) {
  let total = 0;
  let traduits = 0;
  for (const groupe of groupes) {
    for (const texte of groupe.textes) {
      total += 1;
      if (estTraduit(texte, dico)) traduits += 1;
    }
  }
  return { total, traduits, pourcentage: total ? Math.floor((traduits / total) * 100) : 100 };
}
