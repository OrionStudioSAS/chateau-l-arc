/**
 * Lecture et réécriture de src/constants.ts, même format qu'Orion admin :
 * des sections `// ─── Nom ───` suivies de constantes exportées (chaîne,
 * tableau de chaînes ou tableau d'objets aux valeurs textuelles). Un commentaire
 * `/** Libellé *\/` juste au-dessus d'une constante donne son nom dans l'éditeur.
 *
 * Les pages de l'éditeur visuel regroupent les sections nommées
 * « Page · Bloc » (cf. config/pages-cms.ts).
 */
export const CHEMIN_CONSTANTES = "src/constants.ts";

export type ChampCms =
  | { nom: string; libelle: string; type: "texte"; valeur: string }
  | { nom: string; libelle: string; type: "liste"; valeur: string[] }
  | { nom: string; libelle: string; type: "objets"; cles: string[]; valeur: Record<string, string>[] };

export type SectionCms = { nom: string; champs: ChampCms[] };

const decoder = (s: string) => s.replace(/\\"/g, '"').replace(/\\\\/g, "\\");
const echapper = (s: string) => s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');

function humaniser(nom: string): string {
  const mots = nom.toLowerCase().split("_");
  const texte = mots.slice(mots.length > 1 ? 1 : 0).join(" ");
  return texte.charAt(0).toUpperCase() + texte.slice(1);
}

export function analyser(contenu: string): SectionCms[] {
  const sections: SectionCms[] = [];
  let courante: SectionCms | null = null;
  const lignes = contenu.split("\n");
  let libelle: string | null = null;

  for (let i = 0; i < lignes.length; i++) {
    const ligne = lignes[i];

    const entete = ligne.match(/\/\/\s*[─—]+\s*(.+?)\s*[─—]+/);
    if (entete) {
      courante = { nom: entete[1].trim(), champs: [] };
      sections.push(courante);
      libelle = null;
      continue;
    }

    const commentaire = ligne.match(/^\s*\/\*\*\s*(.+?)\s*\*\/\s*$/);
    if (commentaire) {
      libelle = commentaire[1];
      continue;
    }

    const exporte = ligne.match(/^export const (\w+)/);
    if (!exporte || !courante) continue;
    const nom = exporte[1];
    const titre = libelle ?? humaniser(nom);
    libelle = null;

    const simple = ligne.match(/^export const \w+[^=]*=\s*"((?:[^"\\]|\\.)*)"\s*;/);
    if (simple) {
      courante.champs.push({ nom, libelle: titre, type: "texte", valeur: decoder(simple[1]) });
      continue;
    }

    if (/^export const \w+[^=]*=\s*`/.test(ligne)) {
      let valeur = ligne.replace(/^export const \w+[^=]*=\s*`/, "");
      if (valeur.includes("`")) {
        valeur = valeur.replace(/`\s*;?\s*$/, "");
      } else {
        valeur += "\n";
        for (let j = i + 1; j < lignes.length; j++) {
          if (lignes[j].includes("`")) {
            valeur += lignes[j].replace(/`\s*;?\s*$/, "");
            i = j;
            break;
          }
          valeur += `${lignes[j]}\n`;
        }
      }
      courante.champs.push({ nom, libelle: titre, type: "texte", valeur });
      continue;
    }

    if (/=\s*\[/.test(ligne)) {
      let texte = "";
      let profondeur = 0;
      for (let j = i; j < lignes.length; j++) {
        texte += `${lignes[j]}\n`;
        for (const c of lignes[j]) {
          if (c === "[") profondeur++;
          if (c === "]") profondeur--;
        }
        if (profondeur === 0) {
          i = j;
          break;
        }
      }

      if (texte.includes("{")) {
        const valeur: Record<string, string>[] = [];
        const cles = new Set<string>();
        for (const objet of texte.matchAll(/\{([^{}]*)\}/g)) {
          const element: Record<string, string> = {};
          for (const [, cle, v] of objet[1].matchAll(/(\w+)\s*:\s*"((?:[^"\\]|\\.)*)"/g)) {
            element[cle] = decoder(v);
            cles.add(cle);
          }
          if (Object.keys(element).length) valeur.push(element);
        }
        if (valeur.length) courante.champs.push({ nom, libelle: titre, type: "objets", cles: [...cles], valeur });
      } else {
        const valeur = [...texte.matchAll(/"((?:[^"\\]|\\.)*)"/g)].map((m) => decoder(m[1]));
        courante.champs.push({ nom, libelle: titre, type: "liste", valeur });
      }
    }
  }

  return sections.filter((s) => s.champs.length > 0);
}

export type MiseAJourCms =
  | { nom: string; type: "texte"; valeur: string }
  | { nom: string; type: "liste"; valeur: string[] }
  | {
      nom: string;
      type: "objets";
      valeur: Record<string, string>[];
      /**
       * Listes extensibles (config/pages-cms) : rang d'origine de chaque élément,
       * null pour un ajout. Sert à suivre les traductions quand un élément est retiré.
       */
      provenance?: (number | null)[];
    };

function remplacerTexte(contenu: string, nom: string, valeur: string): string {
  const litteral = valeur.includes("\n") ? `\`${valeur.replace(/`/g, "'")}\`` : `"${echapper(valeur)}"`;
  const guillemets = new RegExp(`(export const ${nom}[^=]*=\\s*)"(?:[^"\\\\]|\\\\.)*"`);
  if (guillemets.test(contenu)) return contenu.replace(guillemets, (_, debut) => debut + litteral);
  const gabarit = new RegExp(`(export const ${nom}[^=]*=\\s*)\`[\\s\\S]*?\``);
  return contenu.replace(gabarit, (_, debut) => debut + litteral);
}

/** Bornes [début, fin[ du contenu du tableau `nom` (entre ses crochets). */
function bornesTableau(contenu: string, nom: string): [number, number] | null {
  const debut = contenu.match(new RegExp(`export const ${nom}[^=]*=\\s*\\[`));
  if (!debut || debut.index === undefined) return null;
  const ouverture = debut.index + debut[0].length;
  let profondeur = 1;
  let fin = ouverture;
  while (profondeur > 0 && fin < contenu.length) {
    if (contenu[fin] === "[") profondeur++;
    if (contenu[fin] === "]") profondeur--;
    if (profondeur > 0) fin++;
  }
  return [ouverture, fin];
}

function remplacerListe(contenu: string, nom: string, valeur: string[]): string {
  const bornes = bornesTableau(contenu, nom);
  if (!bornes) return contenu;
  const corps = `\n${valeur.map((v) => `  "${echapper(v)}"`).join(",\n")},\n`;
  return contenu.slice(0, bornes[0]) + corps + contenu.slice(bornes[1]);
}

/**
 * Met à jour les valeurs textuelles des objets, un à un. Si le nombre
 * d'éléments change (liste extensible), le tableau est réécrit en entier.
 */
function remplacerObjets(contenu: string, nom: string, valeur: Record<string, string>[]): string {
  const bornes = bornesTableau(contenu, nom);
  if (!bornes) return contenu;
  let tableau = contenu.slice(bornes[0], bornes[1]);

  if ((tableau.match(/\{[^{}]*\}/g) ?? []).length !== valeur.length) {
    const lignes = valeur.map(
      (element) => `  { ${Object.entries(element).map(([cle, v]) => `${cle}: "${echapper(v)}"`).join(", ")} },`,
    );
    return contenu.slice(0, bornes[0]) + `\n${lignes.join("\n")}\n` + contenu.slice(bornes[1]);
  }

  let curseur = 0;

  for (const element of valeur) {
    const debut = tableau.indexOf("{", curseur);
    if (debut === -1) break;
    const fin = tableau.indexOf("}", debut);
    let objet = tableau.slice(debut, fin + 1);
    for (const [cle, v] of Object.entries(element)) {
      objet = objet.replace(
        new RegExp(`(\\b${cle}\\s*:\\s*)"(?:[^"\\\\]|\\\\.)*"`),
        (_, prefixe) => `${prefixe}"${echapper(v)}"`,
      );
    }
    tableau = tableau.slice(0, debut) + objet + tableau.slice(fin + 1);
    curseur = debut + objet.length;
  }
  return contenu.slice(0, bornes[0]) + tableau + contenu.slice(bornes[1]);
}

export function appliquer(contenu: string, mises: MiseAJourCms[]): string {
  return mises.reduce((texte, m) => {
    if (!/^\w+$/.test(m.nom)) return texte;
    if (m.type === "texte") return remplacerTexte(texte, m.nom, m.valeur);
    if (m.type === "liste") return remplacerListe(texte, m.nom, m.valeur);
    return remplacerObjets(texte, m.nom, m.valeur);
  }, contenu);
}

/** Valeur ressemblant à une image du site (champ affiché avec un sélecteur d'image). */
export const estImage = (valeur: string) => /^\/images\/.+\.(jpe?g|png|webp|avif|gif)$/i.test(valeur);
