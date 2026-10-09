// Génère, avant `dev` et `build`, des versions WebP de chaque photo de
// public/images aux largeurs de src/lib/images-optimisees.ts, dans
// public/optimise. next/image les sert via src/lib/chargeur-images.ts, sans
// dépendre du service d'optimisation de Vercel (quota mensuel).
//
// Une version déjà à jour (plus récente que sa source) n'est pas refaite.
import { mkdirSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, parse } from "node:path";
import sharp from "sharp";

const racine = process.cwd();
const sources = join(racine, "public/images");
const destination = join(racine, "public/optimise");

// Les largeurs sont définies côté TypeScript : on les relit ici pour n'avoir
// qu'une seule liste.
const largeurs = JSON.parse(
  readFileSync(join(racine, "src/lib/images-optimisees.ts"), "utf8").match(/\[([\d,\s]+)\]/)[0],
);

mkdirSync(destination, { recursive: true });

const aJour = (cible, source) => {
  try {
    return statSync(cible).mtimeMs >= statSync(source).mtimeMs;
  } catch {
    return false;
  }
};

let generees = 0;
for (const fichier of readdirSync(sources)) {
  if (!/\.(jpe?g|png|webp)$/i.test(fichier)) continue;

  const source = join(sources, fichier);
  const { name } = parse(fichier);
  const manquantes = largeurs.filter(
    (largeur) => !aJour(join(destination, `${name}-${largeur}.webp`), source),
  );
  if (manquantes.length === 0) continue;

  const original = sharp(source).rotate();
  await Promise.all(
    manquantes.map((largeur) =>
      original
        .clone()
        // Jamais d'agrandissement : une petite image garde sa taille réelle.
        .resize({ width: largeur, withoutEnlargement: true })
        .webp({ quality: 78 })
        .toFile(join(destination, `${name}-${largeur}.webp`)),
    ),
  );
  generees += manquantes.length;
}

console.log(`Images optimisées : ${generees} version(s) générée(s).`);
