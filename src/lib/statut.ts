import type { Installation } from "@/lib/api/types";

/**
 * Libellé d'état accordé en genre : « Piscine fermée », « Voiturette
 * autorisée », « Chariot manuel autorisé ».
 */
export function libelleEtat(installation: Installation): string {
  const e = installation.feminin ? "e" : "";

  if (installation.type === "ouverture") {
    return installation.actif ? `Ouvert${e}` : `Fermé${e}`;
  }
  return installation.actif ? `Autorisé${e}` : `Interdit${e}`;
}

/** Regroupe les installations en conservant l'ordre reçu. */
export function parGroupe(installations: Installation[]): Installation[][] {
  const groupes = new Map<number, Installation[]>();
  for (const installation of installations) {
    groupes.set(installation.groupe, [
      ...(groupes.get(installation.groupe) ?? []),
      installation,
    ]);
  }
  return [...groupes.values()];
}
