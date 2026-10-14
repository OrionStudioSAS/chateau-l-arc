import "server-only";

import { execFileSync } from "node:child_process";

/**
 * Accès au dépôt GitHub qui tient lieu de base de données (même principe
 * qu'Orion admin) : le contenu édité dans le back-office vit dans `contenu/`,
 * chaque publication est un commit sur la branche du site.
 *
 * Variables d'environnement :
 * - GITHUB_TOKEN : jeton « fine-grained » limité à ce dépôt (Contents: read & write).
 *   En développement, à défaut, le jeton de la GitHub CLI (`gh auth token`) est utilisé.
 * - GITHUB_DEPOT (facultatif) : « propriétaire/dépôt ».
 * - GITHUB_BRANCHE (facultatif) : branche lue et écrite.
 */
const DEPOT = process.env.GITHUB_DEPOT || "OrionStudioSAS/chateau-l-arc";
const BRANCHE = process.env.GITHUB_BRANCHE || "main";
const API = `https://api.github.com/repos/${DEPOT}`;

let jetonCli: string | null | undefined;

function jeton(): string | null {
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN;
  if (process.env.NODE_ENV !== "development") return null;

  if (jetonCli === undefined) {
    try {
      jetonCli =
        execFileSync("gh", ["auth", "token"], { encoding: "utf8", timeout: 5000 }).trim() ||
        null;
    } catch {
      jetonCli = null;
    }
  }
  return jetonCli;
}

/** Vrai si le dépôt est joignable avec un jeton (sinon : lecture des fichiers embarqués). */
export function depotConfigure(): boolean {
  return jeton() !== null;
}

export class ErreurDepot extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "ErreurDepot";
  }
}

async function github(chemin: string, init: RequestInit & { accept?: string } = {}) {
  const valeur = jeton();
  if (!valeur) throw new ErreurDepot("GITHUB_TOKEN manquant", 401);

  const { accept = "application/vnd.github+json", headers, ...reste } = init;
  const reponse = await fetch(`${API}${chemin}`, {
    ...reste,
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
    headers: {
      Accept: accept,
      Authorization: `Bearer ${valeur}`,
      "X-GitHub-Api-Version": "2022-11-28",
      ...headers,
    },
  });

  if (!reponse.ok) {
    throw new ErreurDepot(
      `GitHub ${reponse.status} sur ${chemin} : ${await reponse.text().catch(() => "")}`,
      reponse.status,
    );
  }
  return reponse;
}

const encoderChemin = (chemin: string) => chemin.split("/").map(encodeURIComponent).join("/");

/** Contenu brut d'un fichier, ou null s'il n'existe pas. `ref` : branche ou commit. */
async function lireBrut(chemin: string, ref = BRANCHE): Promise<Response | null> {
  try {
    return await github(`/contents/${encoderChemin(chemin)}?ref=${encodeURIComponent(ref)}`, {
      accept: "application/vnd.github.raw+json",
    });
  } catch (erreur) {
    if (erreur instanceof ErreurDepot && erreur.status === 404) return null;
    throw erreur;
  }
}

export async function lireTexte(chemin: string, ref?: string): Promise<string | null> {
  const reponse = await lireBrut(chemin, ref);
  return reponse ? reponse.text() : null;
}

export async function lireBinaire(chemin: string): Promise<ArrayBuffer | null> {
  const reponse = await lireBrut(chemin);
  return reponse ? reponse.arrayBuffer() : null;
}

/** Fichier à écrire (texte ou binaire) ; `null` le supprime. */
export type Changement = { chemin: string; contenu: string | Uint8Array | null };

/**
 * Lit, modifie et commite en une seule opération atomique (un seul commit, même
 * pour plusieurs fichiers). Si quelqu'un a publié entre la lecture et l'écriture,
 * la branche a bougé : tout est rejoué sur la nouvelle version, jusqu'à 3 fois.
 *
 * `preparer` reçoit un lecteur figé sur le commit de départ et renvoie les
 * changements, ou null pour ne rien commiter.
 */
export async function commiter(
  message: string,
  preparer: (lire: (chemin: string) => Promise<string | null>) => Promise<Changement[] | null>,
): Promise<{ commit: string } | null> {
  for (let essai = 1; ; essai += 1) {
    const ref = await (await github(`/git/ref/heads/${encodeURIComponent(BRANCHE)}`)).json();
    const parent: string = ref.object.sha;

    const changements = await preparer((chemin) => lireTexte(chemin, parent));
    if (!changements || changements.length === 0) return null;

    const commitParent = await (await github(`/git/commits/${parent}`)).json();

    const entrees = await Promise.all(
      changements.map(async ({ chemin, contenu }) => {
        if (contenu === null) {
          return { path: chemin, mode: "100644", type: "blob", sha: null };
        }
        const blob = await (
          await github("/git/blobs", {
            method: "POST",
            body: JSON.stringify(
              typeof contenu === "string"
                ? { content: contenu, encoding: "utf-8" }
                : { content: Buffer.from(contenu).toString("base64"), encoding: "base64" },
            ),
          })
        ).json();
        return { path: chemin, mode: "100644", type: "blob", sha: blob.sha as string };
      }),
    );

    const arbre = await (
      await github("/git/trees", {
        method: "POST",
        body: JSON.stringify({ base_tree: commitParent.tree.sha, tree: entrees }),
      })
    ).json();

    // Rien n'a changé (republication à l'identique) : pas de commit vide.
    if (arbre.sha === commitParent.tree.sha) return null;

    const commit = await (
      await github("/git/commits", {
        method: "POST",
        body: JSON.stringify({ message, tree: arbre.sha, parents: [parent] }),
      })
    ).json();

    try {
      await github(`/git/refs/heads/${encodeURIComponent(BRANCHE)}`, {
        method: "PATCH",
        body: JSON.stringify({ sha: commit.sha, force: false }),
      });
      return { commit: commit.sha };
    } catch (erreur) {
      // 422 : la branche a avancé entre-temps (publication concurrente).
      if (erreur instanceof ErreurDepot && erreur.status === 422 && essai < 3) continue;
      throw erreur;
    }
  }
}
