"use server";

import { updateTag } from "next/cache";

import { tags } from "@/lib/api/content";
import { exigerUtilisateur } from "@/lib/admin/session";
import { historiqueStatut, type EntreeHistorique } from "@/lib/admin/historique";
import { commiter } from "@/lib/contenu/depot";
import {
  cheminsContenu,
  lireDans,
  versJson,
  type FichierStatut,
} from "@/lib/contenu/stockage";
import {
  LONGUEUR_MAX_PRECISION,
  normaliserInstallation,
  optionsStatut,
  valeurStatut,
} from "@/lib/statut";

export type ChangementStatut = { etat: string; precision: string | null };
export type ResultatPublication = { ok: true; message: string } | { ok: false; message: string };

/**
 * Publie l'état des installations modifiées (un seul commit), puis rafraîchit
 * l'en-tête du site public. Seules les clés connues et les états prévus pour
 * chaque installation sont acceptés.
 */
export async function publierStatut(
  changements: Record<string, ChangementStatut>,
): Promise<ResultatPublication> {
  await exigerUtilisateur();

  let erreur = null as string | null;
  const maintenant = new Date().toISOString();

  try {
    await commiter("Back-office : statut des installations", async (lire) => {
      const statut = await lireDans(lire, "statut");

      const installations = statut.installations.map((brute) => {
        const installation = normaliserInstallation(brute);
        const changement = changements[installation.cle];
        if (!changement) return installation;

        const option = optionsStatut(installation).find((o) => o.cle === changement.etat);
        const precision = changement.precision?.trim() || null;
        if (!option) erreur = `État inconnu pour ${installation.libelle}.`;
        if (precision && precision.length > LONGUEUR_MAX_PRECISION) {
          erreur = `La précision de ${installation.libelle} dépasse ${LONGUEUR_MAX_PRECISION} caractères.`;
        }
        if (!option || erreur) return installation;

        const inchange = installation.etat === option.cle && installation.precision === precision;
        return inchange
          ? installation
          : {
              ...installation,
              etat: option.cle,
              actif: option.ton !== "rouge",
              precision,
              majLe: maintenant,
            };
      });

      if (erreur) return null;
      return [
        { chemin: cheminsContenu.statut, contenu: versJson({ ...statut, installations }) },
      ];
    });
  } catch (e) {
    console.error("Publication du statut impossible", e);
    return { ok: false, message: "La publication a échoué. Réessayez dans un instant." };
  }

  if (erreur) return { ok: false, message: erreur };

  updateTag(tags.statut);
  return { ok: true, message: "Statut publié sur le site." };
}

/** Changements des installations entre deux versions du fichier. */
function differences(avant: FichierStatut, apres: FichierStatut): string[] {
  const lignes: string[] = [];
  const precedentes = new Map(avant.installations.map((i) => [i.cle, normaliserInstallation(i)]));

  for (const brute of apres.installations) {
    const installation = normaliserInstallation(brute);
    const ancienne = precedentes.get(installation.cle);
    const valeur = valeurStatut(installation);
    if (!ancienne) {
      lignes.push(`${installation.libelle} : ajouté (${valeur})`);
      continue;
    }
    const valeurAvant = valeurStatut(ancienne);
    if (valeurAvant !== valeur) lignes.push(`${installation.libelle} : ${valeurAvant} → ${valeur}`);
  }
  return lignes;
}

/** Dix dernières publications du statut, avec ce qui a changé à chacune. */
export async function lireHistoriqueStatut(): Promise<EntreeHistorique[]> {
  await exigerUtilisateur();

  try {
    return await historiqueStatut(differences);
  } catch (e) {
    console.error("Historique du statut illisible", e);
    return [];
  }
}
