// Copie le « worker » de MapLibre dans public/ avant `dev` et `build`.
// MapLibre 6 le charge depuis un fichier séparé que le bundler ne copie pas
// lui-même ; le copier ici le garde aligné sur la version installée.
import { copyFileSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

const require = createRequire(import.meta.url);
const source = join(dirname(require.resolve("maplibre-gl/package.json")), "dist/maplibre-gl-worker.mjs");
const destination = join(process.cwd(), "public/vendor/maplibre-gl-worker.mjs");

mkdirSync(dirname(destination), { recursive: true });
copyFileSync(source, destination);
