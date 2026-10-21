"use server";

import { listesExtensibles } from "@/config/pages-cms";
import { exigerUtilisateur } from "@/lib/admin/session";
import { analyser, appliquer, CHEMIN_CONSTANTES, type MiseAJourCms } from "@/lib/cms/constantes";
import { commiter, type Changement } from "@/lib/contenu/depot";
import { slugifier } from "@/lib/admin/formulaire-competition";
import { versJson } from "@/lib/contenu/stockage";
import type { FichierTraductions } from "@/lib/i18n";
import { CHEMINS_TRADUCTIONS } from "@/lib/traductions/depot";
import { reindexerTraductions } from "@/lib/traductions/reindexer";

/** Trie les clés d'un objet (diffs GitHub stables). */
const trier = <T,>(objet: Record<string, T>) =>
  Object.fromEntries(Object.entries(objet).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)));

const TYPES_IMAGE = ["image/jpeg", "image/png", "image/webp"];
const TAILLE_MAX_IMAGE = 2 * 1024 * 1024;
/** Marqueur d'une image envoyée avec la publication : « fichier:<champ> ». */
const PREFIXE_FICHIER = "fichier:";

/**
 * Publie les modifications d'une page : un commit de src/constants.ts (et des
 * nouvelles images dans public/images/). Le site se reconstruit ensuite sur
 * Vercel : la page est à jour en ligne une à deux minutes plus tard.
 */
export async function publierPage(
  formData: FormData,
): Promise<{ ok: boolean; message: string }> {
  await exigerUtilisateur();

  let mises: MiseAJourCms[];
  try {
    mises = JSON.parse(String(formData.get("mises") ?? "[]")) as MiseAJourCms[];
  } catch {
    return { ok: false, message: "Données illisibles. Rechargez la page." };
  }
  const titrePage = String(formData.get("page") ?? "une page").slice(0, 60);
  if (mises.length === 0) return { ok: false, message: "Aucune modification à publier." };

  // Images jointes : validées puis rangées dans public/images/ (nom unique).
  const images = new Map<string, { chemin: string; contenu: Uint8Array }>();
  for (const [cle, fichier] of formData.entries()) {
    if (!cle.startsWith(PREFIXE_FICHIER) || !(fichier instanceof File)) continue;
    if (!TYPES_IMAGE.includes(fichier.type)) return { ok: false, message: "Image : JPEG, PNG ou WebP uniquement." };
    if (fichier.size > TAILLE_MAX_IMAGE) return { ok: false, message: "Une image dépasse 2 Mo." };
    const nom = `cms-${slugifier(fichier.name.replace(/\.[^.]+$/, "")).slice(0, 40) || "image"}-${Date.now()}-${images.size}.jpg`;
    images.set(cle, {
      chemin: `public/images/${nom}`,
      contenu: new Uint8Array(await fichier.arrayBuffer()),
    });
  }

  const remplacer = (valeur: string) => {
    const image = valeur.startsWith(PREFIXE_FICHIER) ? images.get(valeur) : undefined;
    return image ? image.chemin.replace(/^public/, "") : valeur;
  };
  const resolues = mises.map((m): MiseAJourCms => {
    if (m.type === "texte") return { ...m, valeur: remplacer(String(m.valeur)) };
    if (m.type === "liste") return { ...m, valeur: m.valeur.map((v) => remplacer(String(v))) };
    return {
      ...m,
      valeur: m.valeur.map((objet) =>
        Object.fromEntries(Object.entries(objet).map(([k, v]) => [k, remplacer(String(v))])),
      ),
    };
  });

  let inconnu = null as string | null;
  try {
    const resultat = await commiter(`Back-office : textes de la page ${titrePage}`, async (lire) => {
      const contenu = await lire(CHEMIN_CONSTANTES);
      if (contenu === null) throw new Error("constants.ts introuvable");

      // Seules les constantes existantes (et de même nature) peuvent changer ;
      // le nombre d'éléments, seulement pour les listes extensibles.
      const connus = new Map(analyser(contenu).flatMap((s) => s.champs.map((c) => [c.nom, c])));
      const refuse = resolues.find((m) => {
        const champ = connus.get(m.nom);
        if (!champ || champ.type !== m.type) return true;
        if (m.type !== "objets" || champ.type !== "objets" || m.valeur.length === champ.valeur.length) return false;
        const regle = listesExtensibles[m.nom];
        return !regle || m.valeur.length < regle.min || m.valeur.length > regle.max;
      });
      if (refuse) {
        inconnu = refuse.nom;
        return null;
      }

      // Listes extensibles : éléments complets, clés connues seulement ; les
      // traductions suivent les éléments déplacés par un retrait.
      const deplacements: { nom: string; provenance: (number | null)[] }[] = [];
      const finales = resolues.map((m): MiseAJourCms => {
        const champ = connus.get(m.nom);
        if (m.type !== "objets" || champ?.type !== "objets" || !listesExtensibles[m.nom]) return m;
        const valeur = m.valeur.map((o) => Object.fromEntries(champ.cles.map((cle) => [cle, String(o[cle] ?? "")])));
        const provenance =
          Array.isArray(m.provenance) && m.provenance.length === valeur.length
            ? m.provenance.map((r) => (Number.isInteger(r) && r! >= 0 && r! < champ.valeur.length ? r : null))
            : valeur.map((_, i) => (i < champ.valeur.length ? i : null));
        if (provenance.some((r, i) => r !== i)) deplacements.push({ nom: m.nom, provenance });
        return { nom: m.nom, type: "objets", valeur };
      });

      const changements: Changement[] = [{ chemin: CHEMIN_CONSTANTES, contenu: appliquer(contenu, finales) }];
      for (const image of images.values()) changements.push(image);

      if (deplacements.length) {
        const [texteTraductions, texteOrigines] = await Promise.all([
          lire(CHEMINS_TRADUCTIONS.traductions),
          lire(CHEMINS_TRADUCTIONS.origines),
        ]);
        const traductions: FichierTraductions = texteTraductions ? JSON.parse(texteTraductions) : {};
        const origines: Record<string, Record<string, string>> = texteOrigines ? JSON.parse(texteOrigines) : {};
        let change = false;
        for (const { nom, provenance } of deplacements) change = reindexerTraductions(nom, provenance, traductions, origines) || change;
        if (change) {
          for (const dico of Object.values(traductions)) dico.constantes = trier(dico.constantes);
          changements.push(
            { chemin: CHEMINS_TRADUCTIONS.traductions, contenu: versJson(traductions) },
            { chemin: CHEMINS_TRADUCTIONS.origines, contenu: versJson(Object.fromEntries(Object.entries(origines).map(([l, o]) => [l, trier(o)]))) },
          );
        }
      }
      return changements;
    });
    if (inconnu) return { ok: false, message: `Champ inconnu : ${inconnu}. Rechargez la page.` };
    if (!resultat) return { ok: true, message: "Rien n'a changé : la page est déjà à jour." };
  } catch (erreur) {
    console.error("Publication de la page impossible", erreur);
    return { ok: false, message: "La publication a échoué. Réessayez dans un instant." };
  }

  return {
    ok: true,
    message: "Publié : la page sera à jour en ligne d'ici une à deux minutes (reconstruction du site).",
  };
}
