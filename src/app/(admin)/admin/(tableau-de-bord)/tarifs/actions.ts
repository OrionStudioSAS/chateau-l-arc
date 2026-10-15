"use server";

import { updateTag } from "next/cache";

import { tags } from "@/lib/api/content";
import { exigerUtilisateur } from "@/lib/admin/session";
import { commiter } from "@/lib/contenu/depot";
import { cheminsContenu, versJson } from "@/lib/contenu/stockage";
import type { GrilleTarifs, LigneTarif } from "@/lib/tarifs";

const MMJJ = /^(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
const JJMM = /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])$/;
const prixValide = (p: unknown) => typeof p === "number" && Number.isFinite(p) && p >= 0 && p <= 100_000;

function verifierLigne(ligne: LigneTarif, rubrique: string): string | null {
  if (!ligne.id || typeof ligne.id !== "string") return `${rubrique} : identifiant manquant.`;
  if (!ligne.libelle?.trim()) return `${rubrique} : un tarif n'a pas d'intitulé.`;
  if (ligne.libelle.length > 80) return `${rubrique} : intitulé trop long (« ${ligne.libelle.slice(0, 30)}… »).`;
  if (ligne.detail && ligne.detail.length > 120) return `${rubrique} : précision trop longue pour « ${ligne.libelle} ».`;
  if (!prixValide(ligne.prix)) return `${rubrique} : prix invalide pour « ${ligne.libelle} ».`;
  return null;
}

/** Contrôle complet de la grille reçue du navigateur (types, bornes, doublons). */
function verifier(g: GrilleTarifs): string | null {
  if (!g || !MMJJ.test(g.saisons?.hauteDebut) || !MMJJ.test(g.saisons?.hauteFin)) return "Dates de saison invalides.";
  if (g.saisons.hauteDebut >= g.saisons.hauteFin) return "La haute saison doit commencer avant de finir.";
  if (!(g.remiseComptant?.taux >= 0 && g.remiseComptant.taux <= 0.5)) return "Remise en paiement comptant invalide (0 à 50 %).";
  if (!JJMM.test(g.remiseComptant.jusquau)) return "Date limite de la remise invalide (JJ/MM).";

  const rubriques: [string, LigneTarif[]][] = [
    ["Green fees", g.greenFees],
    ["Carnets", g.carnets],
    ["Locations & practice", g.locations],
    ["Abonnements", g.abonnements],
  ];
  const ids = new Set<string>();
  for (const [nom, lignes] of rubriques) {
    if (!Array.isArray(lignes) || lignes.length > 50) return `${nom} : liste invalide.`;
    for (const ligne of lignes) {
      const erreur = verifierLigne(ligne, nom);
      if (erreur) return erreur;
      if (ids.has(ligne.id)) return `${nom} : tarif en double.`;
      ids.add(ligne.id);
    }
  }
  if (g.greenFees.some((l) => l.saison !== null && l.saison !== "haute" && l.saison !== "basse")) return "Green fees : saison invalide.";
  if (g.carnets.some((l) => !Number.isInteger(l.parties) || l.parties < 1 || l.parties > 100)) {
    return "Carnets : nombre de parties invalide.";
  }
  if (g.locations.some((l) => (l.membres !== null && !prixValide(l.membres)) || !["location", "practice"].includes(l.groupe))) {
    return "Locations : tarif membre invalide.";
  }
  return null;
}

/** Ne garde que les champs attendus (rien d'autre n'entre dans le dépôt). */
function nettoyer(g: GrilleTarifs): GrilleTarifs {
  const base = (l: LigneTarif) => ({
    id: l.id,
    libelle: l.libelle.trim(),
    detail: l.detail?.trim() || null,
    prix: Math.round(l.prix * 100) / 100,
  });
  return {
    saisons: { hauteDebut: g.saisons.hauteDebut, hauteFin: g.saisons.hauteFin },
    remiseComptant: { taux: g.remiseComptant.taux, jusquau: g.remiseComptant.jusquau },
    greenFees: g.greenFees.map((l) => ({ ...base(l), saison: l.saison, miseEnAvant: Boolean(l.miseEnAvant) })),
    carnets: g.carnets.map((l) => ({ ...base(l), parties: l.parties })),
    locations: g.locations.map((l) => ({
      ...base(l),
      membres: l.membres === null ? null : Math.round(l.membres * 100) / 100,
      groupe: l.groupe,
    })),
    abonnements: g.abonnements.map((l) => ({ ...base(l), miseEnAvant: Boolean(l.miseEnAvant) })),
  };
}

/** Publie la grille tarifaire : un commit, puis toutes les pages qui l'affichent sont à jour. */
export async function publierTarifs(grille: GrilleTarifs): Promise<{ ok: boolean; message: string }> {
  await exigerUtilisateur();

  const erreur = verifier(grille);
  if (erreur) return { ok: false, message: erreur };

  try {
    await commiter("Back-office : tarifs", async () => [
      { chemin: cheminsContenu.tarifs, contenu: versJson(nettoyer(grille)) },
    ]);
  } catch (e) {
    console.error("Publication des tarifs impossible", e);
    return { ok: false, message: "La publication a échoué. Réessayez dans un instant." };
  }

  updateTag(tags.tarifs);
  return { ok: true, message: "Tarifs publiés : le site est à jour." };
}
