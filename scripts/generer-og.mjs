// Images de partage (Open Graph, 1200 × 630) des pages principales, recadrées
// depuis leur photo de bannière. À relancer si une bannière change :
//   node scripts/generer-og.mjs
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const racine = process.cwd();
const sources = {
  accueil: "banner.jpg",
  parcours: "parcours.png",
  histoire: "notre-histoire.png",
  competitions: "competitions.png",
  tarifs: "tarifs.png",
  academie: "academie.png",
};

mkdirSync(join(racine, "public/og"), { recursive: true });
for (const [nom, fichier] of Object.entries(sources)) {
  await sharp(join(racine, "public/images", fichier))
    .resize(1200, 630, { fit: "cover", position: "attention" })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(join(racine, "public/og", `${nom}.jpg`));
  console.log(`og/${nom}.jpg`);
}
