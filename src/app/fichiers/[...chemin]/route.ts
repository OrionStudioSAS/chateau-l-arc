import { readFile } from "node:fs/promises";
import path from "node:path";

import { depotConfigure, lireBinaire } from "@/lib/contenu/depot";
import { DOSSIER_FICHIERS } from "@/lib/contenu/stockage";

const TYPES: Record<string, string> = {
  pdf: "application/pdf",
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

/**
 * Fichiers déposés depuis le back-office (PDF de résultats, affiches), stockés
 * dans contenu/fichiers/ du dépôt. Ils sont lus sur GitHub, donc en ligne dès
 * le commit, sans attendre de redéploiement. Les noms étant horodatés, un
 * fichier ne change jamais : le CDN le garde aussi longtemps que possible.
 */
export async function GET(_requete: Request, ctx: RouteContext<"/fichiers/[...chemin]">) {
  const { chemin } = await ctx.params;
  const extension = chemin.at(-1)?.split(".").pop()?.toLowerCase() ?? "";

  if (
    !TYPES[extension] ||
    chemin.some((segment) => !/^[a-z0-9][a-z0-9._-]*$/i.test(segment) || segment.includes(".."))
  ) {
    return new Response("Introuvable", { status: 404 });
  }

  const relatif = `${DOSSIER_FICHIERS}/${chemin.join("/")}`;
  let contenu: ArrayBuffer | Buffer | null = null;

  try {
    contenu = depotConfigure()
      ? await lireBinaire(relatif)
      : await readFile(path.join(process.cwd(), relatif));
  } catch (erreur) {
    console.error(`Lecture du fichier ${relatif} impossible`, erreur);
  }

  if (!contenu) return new Response("Introuvable", { status: 404 });

  return new Response(new Uint8Array(contenu), {
    headers: {
      "Content-Type": TYPES[extension],
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
