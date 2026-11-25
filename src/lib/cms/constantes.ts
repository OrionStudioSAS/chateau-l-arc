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

/** Contenu d'une chaîne "…" du fichier → texte (\" \\ \n \t…). */
const decoder = (s: string) =>
  s.replace(/\\([\s\S])/g, (_, c: string) => (c === "n" ? "\n" : c === "t" ? "\t" : c === "r" ? "" : c));

/**
 * Texte → contenu d'une chaîne "…". Un retour à la ligne doit être échappé :
 * écrit tel quel, il casse la compilation du site (cf. verifierConstantes).
 */
const echapper = (s: string) =>
  s.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\r?\n/g, "\\n").replace(/\t/g, "\\t");

/** Contenu d'un gabarit `…` (texte sur plusieurs lignes) → texte. */
const decoderGabarit = (s: string) => s.replace(/\\([\\`$])/g, "$1");

/** Texte → contenu d'un gabarit `…` : ni accent grave, ni « ${ » interprété. */
const echapperGabarit = (s: string) => s.replace(/\\/g, "\\\\").replace(/`/g, "'").replace(/\$\{/g, "\\${");

/**
 * Saute un texte (« "…" », « '…' », « `…` ») ou un commentaire commençant en
 * `i` : renvoie l'index de son dernier caractère, ou `i` s'il n'y en a pas.
 * Les crochets et accolades écrits dans les textes ne comptent donc jamais.
 */
function sauter(s: string, i: number): number {
  const c = s[i];
  if (c === "/" && s[i + 1] === "/") {
    const fin = s.indexOf("\n", i);
    return fin === -1 ? s.length : fin;
  }
  if (c === "/" && s[i + 1] === "*") {
    const fin = s.indexOf("*/", i + 2);
    return fin === -1 ? s.length : fin + 1;
  }
  if (c !== '"' && c !== "'" && c !== "`") return i;
  for (let j = i + 1; j < s.length; j++) {
    if (s[j] === "\\") j++;
    else if (s[j] === c) return j;
  }
  return s.length;
}

/** Index du crochet ou de l'accolade qui ferme celui ouvert en `i`, ou -1. */
function fermeture(s: string, i: number): number {
  let profondeur = 0;
  for (let j = i; j < s.length; j++) {
    const saut = sauter(s, j);
    if (saut !== j) {
      j = saut;
      continue;
    }
    if (s[j] === "[" || s[j] === "{") profondeur++;
    else if (s[j] === "]" || s[j] === "}") {
      profondeur--;
      if (profondeur === 0) return j;
    }
  }
  return -1;
}

/** Bornes [« { », « } »] des objets de premier niveau d'un contenu de tableau. */
function objetsDe(tableau: string): [number, number][] {
  const objets: [number, number][] = [];
  for (let j = 0; j < tableau.length; j++) {
    const saut = sauter(tableau, j);
    if (saut !== j) {
      j = saut;
    } else if (tableau[j] === "{") {
      const fin = fermeture(tableau, j);
      if (fin === -1) break;
      objets.push([j, fin]);
      j = fin;
    }
  }
  return objets;
}

function humaniser(nom: string): string {
  const mots = nom.toLowerCase().split("_");
  const texte = mots.slice(mots.length > 1 ? 1 : 0).join(" ");
  return texte.charAt(0).toUpperCase() + texte.slice(1);
}

export function analyser(contenu: string): SectionCms[] {
  const sections: SectionCms[] = [];
  let courante: SectionCms | null = null;
  const lignes = contenu.split("\n");
  // Position de chaque début de ligne dans le fichier (lecture des tableaux).
  const debutsLignes: number[] = [];
  lignes.reduce((position, l) => (debutsLignes.push(position), position + l.length + 1), 0);
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
      courante.champs.push({ nom, libelle: titre, type: "texte", valeur: decoderGabarit(valeur) });
      continue;
    }

    const tableau = ligne.match(/=\s*\[/);
    if (tableau?.index !== undefined) {
      const ouverture = debutsLignes[i] + tableau.index + tableau[0].length - 1;
      const fin = fermeture(contenu, ouverture);
      if (fin === -1) continue;
      const texte = contenu.slice(ouverture + 1, fin);
      i = contenu.slice(0, fin).split("\n").length - 1;

      const objets = objetsDe(texte);
      if (objets.length) {
        const valeur: Record<string, string>[] = [];
        const cles = new Set<string>();
        for (const [debutObjet, finObjet] of objets) {
          const element: Record<string, string> = {};
          for (const [, cle, v] of texte.slice(debutObjet + 1, finObjet).matchAll(/(\w+)\s*:\s*"((?:[^"\\]|\\.)*)"/g)) {
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
  const litteral = valeur.includes("\n") ? `\`${echapperGabarit(valeur)}\`` : `"${echapper(valeur)}"`;
  const guillemets = new RegExp(`(export const ${nom}[^=]*=\\s*)"(?:[^"\\\\]|\\\\.)*"`);
  if (guillemets.test(contenu)) return contenu.replace(guillemets, (_, debut) => debut + litteral);
  const gabarit = new RegExp(`(export const ${nom}[^=]*=\\s*)\`[\\s\\S]*?\``);
  return contenu.replace(gabarit, (_, debut) => debut + litteral);
}

/** Bornes [début, fin[ du contenu du tableau `nom` (entre ses crochets). */
function bornesTableau(contenu: string, nom: string): [number, number] | null {
  const debut = contenu.match(new RegExp(`export const ${nom}[^=]*=\\s*\\[`));
  if (!debut || debut.index === undefined) return null;
  const crochet = debut.index + debut[0].length - 1;
  const fin = fermeture(contenu, crochet);
  return fin === -1 ? null : [crochet + 1, fin];
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

  const objets = objetsDe(tableau);
  if (objets.length !== valeur.length) {
    const lignes = valeur.map(
      (element) => `  { ${Object.entries(element).map(([cle, v]) => `${cle}: "${echapper(v)}"`).join(", ")} },`,
    );
    return contenu.slice(0, bornes[0]) + `\n${lignes.join("\n")}\n` + contenu.slice(bornes[1]);
  }

  // Du dernier objet au premier : les positions des précédents restent valables.
  for (let n = objets.length - 1; n >= 0; n--) {
    const element = valeur[n];
    const [debut, fin] = objets[n];
    let objet = tableau.slice(debut, fin + 1);
    for (const [cle, v] of Object.entries(element)) {
      objet = objet.replace(
        new RegExp(`(\\b${cle}\\s*:\\s*)"(?:[^"\\\\]|\\\\.)*"`),
        (_, prefixe) => `${prefixe}"${echapper(v)}"`,
      );
    }
    tableau = tableau.slice(0, debut) + objet + tableau.slice(fin + 1);
  }
  return contenu.slice(0, bornes[0]) + tableau + contenu.slice(bornes[1]);
}

/** Espaces et retours à la ligne en trop au début et à la fin d'un texte saisi. */
const net = (valeur: string) => String(valeur ?? "").replace(/\r\n?/g, "\n").trim();

export function appliquer(contenu: string, mises: MiseAJourCms[]): string {
  return mises.reduce((texte, m) => {
    if (!/^\w+$/.test(m.nom)) return texte;
    if (m.type === "texte") return remplacerTexte(texte, m.nom, net(m.valeur));
    if (m.type === "liste") return remplacerListe(texte, m.nom, m.valeur.map(net));
    return remplacerObjets(
      texte,
      m.nom,
      m.valeur.map((objet) => Object.fromEntries(Object.entries(objet).map(([cle, v]) => [cle, net(v)]))),
    );
  }, contenu);
}

/**
 * Garde-fou avant publication : le fichier produit doit rester du code
 * valide (chaînes et gabarits fermés, sans retour à la ligne brut dans une
 * chaîne, crochets et accolades équilibrés). Renvoie l'erreur, ou null.
 * Sans lui, un texte mal formé bloquerait toute mise en ligne du site.
 */
export function verifierConstantes(contenu: string): string | null {
  const pile: string[] = [];
  const paires: Record<string, string> = { ")": "(", "]": "[", "}": "{" };
  const ligne = (i: number) => contenu.slice(0, i).split("\n").length;
  for (let i = 0; i < contenu.length; i++) {
    const c = contenu[i];
    if (c === "/" && contenu[i + 1] === "/") {
      const fin = contenu.indexOf("\n", i);
      i = fin === -1 ? contenu.length : fin;
    } else if (c === "/" && contenu[i + 1] === "*") {
      const fin = contenu.indexOf("*/", i + 2);
      if (fin === -1) return `commentaire non fermé (ligne ${ligne(i)})`;
      i = fin + 1;
    } else if (c === '"' || c === "'" || c === "`") {
      const debut = i;
      for (i++; i < contenu.length && contenu[i] !== c; i++) {
        if (contenu[i] === "\\") i++;
        else if (c !== "`" && contenu[i] === "\n") return `retour à la ligne dans un texte (ligne ${ligne(i)})`;
        else if (c === "`" && contenu[i] === "$" && contenu[i + 1] === "{") return `« \${ » dans un texte (ligne ${ligne(i)})`;
      }
      if (i >= contenu.length) return `texte non fermé (ligne ${ligne(debut)})`;
    } else if (c === "(" || c === "[" || c === "{") {
      pile.push(c);
    } else if (c in paires) {
      if (pile.pop() !== paires[c]) return `crochet ou accolade en trop (ligne ${ligne(i)})`;
    }
  }
  return pile.length ? "crochet ou accolade non fermé" : null;
}

/** Valeur ressemblant à une image du site (champ affiché avec un sélecteur d'image). */
export const estImage = (valeur: string) => /^\/images\/.+\.(jpe?g|png|webp|avif|gif)$/i.test(valeur);
