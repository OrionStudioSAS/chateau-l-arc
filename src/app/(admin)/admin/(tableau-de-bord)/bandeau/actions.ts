"use server";

import { updateTag } from "next/cache";

import { tags } from "@/lib/api/content";
import { historiqueStatut, type EntreeHistorique } from "@/lib/admin/historique";
import { lienAutorise } from "@/lib/admin/popup";
import { exigerUtilisateur } from "@/lib/admin/session";
import { LONGUEUR_MAX_BANDEAU, LONGUEUR_MAX_BOUTON_BANDEAU } from "@/lib/bandeau";
import { commiter } from "@/lib/contenu/depot";
import { cheminsContenu, lireDans, versJson, type FichierStatut } from "@/lib/contenu/stockage";

export type BrouillonBandeau = {
  actif: boolean;
  message: string;
  lienHref: string;
  lienLabel: string;
};

export type ResultatPublication = { ok: boolean; message: string };

/** Erreur de saisie, ou null si le brouillon est publiable. */
function verifier(b: BrouillonBandeau): string | null {
  if (b.actif && !b.message) return "Saisissez un message, ou masquez le bandeau.";
  if (b.message.length > LONGUEUR_MAX_BANDEAU) {
    return `Le message ne doit pas dépasser ${LONGUEUR_MAX_BANDEAU} caractères.`;
  }
  if (b.lienLabel.length > LONGUEUR_MAX_BOUTON_BANDEAU) {
    return `Le texte du bouton ne doit pas dépasser ${LONGUEUR_MAX_BOUTON_BANDEAU} caractères.`;
  }
  if (b.lienHref && !b.lienLabel) return "Indiquez le texte du bouton.";
  if (b.lienLabel && !b.lienHref) return "Indiquez le lien du bouton.";
  if (b.lienHref && !lienAutorise(b.lienHref)) {
    return "Lien non valide : une page du site (/…), une adresse https://, tel: ou mailto:.";
  }
  return null;
}

/** Publie le bandeau d'information (un commit), puis rafraîchit le site public. */
export async function publierBandeau(brouillon: BrouillonBandeau): Promise<ResultatPublication> {
  await exigerUtilisateur();

  const b: BrouillonBandeau = {
    actif: Boolean(brouillon.actif),
    message: String(brouillon.message ?? "").trim(),
    lienHref: String(brouillon.lienHref ?? "").trim(),
    lienLabel: String(brouillon.lienLabel ?? "").trim(),
  };
  const erreur = verifier(b);
  if (erreur) return { ok: false, message: erreur };

  try {
    await commiter("Back-office : bandeau d'information", async (lire) => {
      const statut = await lireDans(lire, "statut");
      return [
        {
          chemin: cheminsContenu.statut,
          contenu: versJson({
            ...statut,
            bandeau: {
              actif: b.actif,
              message: b.message,
              lien: b.lienHref ? { label: b.lienLabel, href: b.lienHref } : null,
              publieLe: new Date().toISOString(),
            },
          }),
        },
      ];
    });
  } catch (e) {
    console.error("Publication du bandeau impossible", e);
    return { ok: false, message: "La publication a échoué. Réessayez dans un instant." };
  }

  updateTag(tags.bandeau);
  return { ok: true, message: b.actif ? "Bandeau publié sur le site." : "Bandeau masqué sur le site." };
}

/** Changements du bandeau entre deux versions du fichier. */
function differences(avant: FichierStatut, apres: FichierStatut): string[] {
  const [a, b] = [avant.bandeau, apres.bandeau];
  const lignes: string[] = [];
  if (a.actif !== b.actif) lignes.push(b.actif ? "Bandeau affiché" : "Bandeau masqué");
  if (a.message !== b.message) lignes.push(`Message : « ${b.message} »`);
  if (a.lien?.href !== b.lien?.href || a.lien?.label !== b.lien?.label) {
    lignes.push(b.lien ? `Bouton : « ${b.lien.label} » → ${b.lien.href}` : "Bouton retiré");
  }
  return lignes;
}

/** Dix dernières publications du bandeau, avec ce qui a changé à chacune. */
export async function lireHistoriqueBandeau(): Promise<EntreeHistorique[]> {
  await exigerUtilisateur();

  try {
    return await historiqueStatut(differences);
  } catch (e) {
    console.error("Historique du bandeau illisible", e);
    return [];
  }
}
