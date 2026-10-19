// Recense, avant `dev` et `build`, les textes français de l'interface du site
// public à traduire (Orion Translate), dans src/traductions/interface.json :
//   - chaque `tr("…")` du code ;
//   - les titres et descriptions des pages (métadonnées), les fils d'Ariane ;
//   - les libellés de données écrits dans le code (trous, repères, académie,
//     menus, états des compétitions…) ;
//   - les contenus du back-office lus dans contenu/ (tarifs, statut, bandeau,
//     pop-up, compétitions). Le back-office relit leur version en ligne.
//
// Les textes de src/constants.ts ne sont pas listés ici : l'écran de
// traduction les lit directement (mêmes champs que l'éditeur visuel).
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const racine = process.cwd();
const src = join(racine, "src");

/** groupe → Map(texte → fichier d'origine) */
const groupes = new Map();
const ajouter = (groupe, texte, origine) => {
  if (typeof texte !== "string") return;
  const t = texte.trim();
  // Rien à traduire : vide, nombre, chemin, adresse, code.
  if (!t || !/[A-Za-zÀ-ÿ]{2}/.test(t) || /^(\/|https?:|tel:|mailto:|#)/.test(t)) return;
  if (!groupes.has(groupe)) groupes.set(groupe, new Map());
  if (!groupes.get(groupe).has(t)) groupes.get(groupe).set(t, origine);
};

const decoder = (s) => s.replace(/\\"/g, '"').replace(/\\\\/g, "\\").replace(/\\n/g, "\n");

function fichiers(dossier) {
  return readdirSync(dossier).flatMap((nom) => {
    const chemin = join(dossier, nom);
    return statSync(chemin).isDirectory() ? fichiers(chemin) : /\.(tsx?|mjs)$/.test(nom) ? [chemin] : [];
  });
}

const groupeDe = (chemin) =>
  chemin.includes("/app/[lang]/contact/") || chemin.includes("/sections/contact/")
    ? "Page Contact"
    : chemin.includes("/app/[lang]/")
      ? "Pages"
      : chemin.includes("/components/layout/")
        ? "En-tête, pied de page et bandeau"
        : "Sections des pages";

for (const chemin of fichiers(src)) {
  const rel = relative(racine, chemin);
  if (rel.includes("/admin") || rel.includes("(admin)") || rel.includes("/traductions/")) continue;
  const texte = readFileSync(chemin, "utf8");
  const groupe = groupeDe(chemin);

  // 1. tr("…")
  for (const m of texte.matchAll(/\btr\(\s*"((?:[^"\\]|\\.)*)"\s*\)/g)) ajouter(groupe, decoder(m[1]), rel);

  // 2. Pages : métadonnées, fil d'Ariane, en-têtes simples.
  if (rel.startsWith("src/app/[lang]/")) {
    for (const m of texte.matchAll(/\b(titre|titreAbsolu|description):\s*"((?:[^"\\]|\\.)*)"/g))
      ajouter("Référencement (titres et descriptions Google)", decoder(m[2]), rel);
    for (const m of texte.matchAll(/\blabel:\s*"((?:[^"\\]|\\.)*)"/g)) ajouter("Pages", decoder(m[1]), rel);
    for (const m of texte.matchAll(/\b(imageAlt|surtitre|titre|chapo)="([^"]+)"/g)) ajouter("Pages", m[2], rel);
  }
}

// 3. Libellés de données écrits dans le code (affichés via tr()).
const donnees = [
  ["src/config/site.ts", /\b(label|nom|horaires|heroAccroche):\s*"((?:[^"\\]|\\.)*)"/g, "Menus et pied de page"],
  ["src/lib/academie.ts", /\b(titre|libelle|rythme|description|etiquette|texte|noteJuniors|notePrestige)\s*[:=]\s*"((?:[^"\\]|\\.)*)"/g, "L'Académie (formules)"],
  ["src/lib/academie.ts", /points:\s*\[([^\]]*)\]/g, "L'Académie (formules)"],
  ["src/lib/parcours.ts", /\b(description|conseilDuPro):\s*"((?:[^"\\]|\\.)*)"/g, "Le parcours (trou par trou)"],
  ["src/lib/reperes.ts", /\b(nom):\s*"((?:[^"\\]|\\.)*)"/g, "Le parcours (trou par trou)"],
  ["src/lib/tarifs.ts", /\b(question|reponse):\s*"((?:[^"\\]|\\.)*)"/g, "Tarifs (questions)"],
  ["src/lib/statut.ts", /\b(libelle):\s*[`"]((?:[^"`\\]|\\.)*)[`"]/g, "État du parcours"],
  ["src/lib/meteo.ts", /"([A-ZÀ-Ü][^"]*[a-zà-ü][^"]*)"/g, "État du parcours"],
  ["src/lib/competitions.ts", /\b(libelle|action):\s*"((?:[^"\\]|\\.)*)"/g, "Compétitions"],
  ["src/lib/competitions.ts", /\b(club|"grand-prix"|seniors):\s*"((?:[^"\\]|\\.)*)"/g, "Compétitions"],
  ["src/lib/admin/popup.ts", /"(Hiver|Printemps|Été|Automne)"/g, "Pop-up marketing"],
  ["src/lib/demandes.ts", /\bequipe:\s*"((?:[^"\\]|\\.)*)"/g, "Page Contact"],
  ["src/components/layout/panneau-statut.tsx", /\blibelle:\s*"((?:[^"\\]|\\.)*)"/g, "État du parcours"],
  ["src/components/layout/not-found-content.tsx", /\b(titre|texte):\s*"((?:[^"\\]|\\.)*)"/g, "Page 404"],
  ["src/components/sections/frise-histoire.tsx", /\b(alt|note|date):\s*"((?:[^"\\]|\\.)*)"/g, "Sections des pages"],
  ["src/components/sections/tarifs-navigation.tsx", /\blibelle:\s*"((?:[^"\\]|\\.)*)"/g, "Sections des pages"],
  ["src/components/sections/tarifs-apercu.tsx", /\blibelle:\s*"((?:[^"\\]|\\.)*)"/g, "Sections des pages"],
  ["src/components/sections/competitions-liste.tsx", /\blibelle:\s*"((?:[^"\\]|\\.)*)"/g, "Compétitions"],
  ["src/components/sections/contact/sections-contact.tsx", /\blibelle:\s*"((?:[^"\\]|\\.)*)"/g, "Page Contact"],
];
for (const [fichier, motif, groupe] of donnees) {
  const texte = readFileSync(join(racine, fichier), "utf8");
  for (const m of texte.matchAll(motif)) {
    const valeur = m[2] ?? m[1];
    if (motif.source.startsWith("points")) {
      for (const p of valeur.matchAll(/"((?:[^"\\]|\\.)*)"/g)) ajouter(groupe, decoder(p[1]), fichier);
    } else if (!valeur.includes("${")) {
      ajouter(groupe, decoder(valeur), fichier);
    }
  }
}

// 4. Contenus du back-office (version du dépôt local).
const lire = (nom) => JSON.parse(readFileSync(join(racine, "contenu", `${nom}.json`), "utf8"));
const contenus = "Contenus du back-office";
const tarifs = lire("tarifs");
for (const ligne of [...tarifs.greenFees, ...tarifs.carnets, ...tarifs.locations, ...tarifs.abonnements]) {
  ajouter(contenus, ligne.libelle, "contenu/tarifs.json");
  ajouter(contenus, ligne.detail, "contenu/tarifs.json");
}
const statut = lire("statut");
ajouter(contenus, statut.bandeau?.message, "contenu/statut.json");
ajouter(contenus, statut.bandeau?.lien?.label, "contenu/statut.json");
for (const i of statut.installations) {
  ajouter(contenus, i.libelle, "contenu/statut.json");
  ajouter(contenus, i.description, "contenu/statut.json");
  ajouter(contenus, i.precision, "contenu/statut.json");
}
try {
  const popup = lire("popup");
  for (const p of Array.isArray(popup) ? popup : [popup]) {
    for (const cle of ["titre", "texte", "boutonLibelle"]) ajouter(contenus, p?.[cle], "contenu/popup.json");
  }
} catch {
  // Pas de pop-up enregistrée.
}
for (const c of lire("competitions")) {
  if (c.statut !== "publie") continue;
  for (const cle of ["nom", "formule", "depart", "trous", "indexMaximum", "categories", "inclus", "modeInscription", "droitJeuMembres", "droitJeuVisiteurs", "description"]) {
    ajouter(contenus, c[cle], "contenu/competitions.json");
  }
}

const sortie = [...groupes.entries()]
  .map(([groupe, textes]) => ({
    groupe,
    textes: [...textes.entries()].map(([texte, origine]) => ({ texte, origine })),
  }))
  .sort((a, b) => a.groupe.localeCompare(b.groupe, "fr"));

const cible = join(src, "traductions", "interface.json");
const json = `${JSON.stringify(sortie, null, 1)}\n`;
let avant = "";
try {
  avant = readFileSync(cible, "utf8");
} catch {
  // Premier passage.
}
if (json !== avant) writeFileSync(cible, json);
console.log(`Textes à traduire : ${sortie.reduce((n, g) => n + g.textes.length, 0)} libellés d'interface.`);
