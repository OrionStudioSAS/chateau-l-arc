import type { Installation } from "@/lib/api/types";

/**
 * États possibles d'une installation. Le premier est l'état normal (celui que
 * rétablit « Tout ouvrir » dans le back-office) ; le ton colore la pastille.
 */
export type TonStatut = "vert" | "ambre" | "rouge" | "gris";
export type OptionStatut = { cle: string; libelle: string; ton: TonStatut };

const specifiques: Record<string, OptionStatut[]> = {
  parcours: [
    { cle: "ouvert", libelle: "Ouvert", ton: "vert" },
    { cle: "restreint", libelle: "Restreint", ton: "ambre" },
    { cle: "ferme", libelle: "Fermé", ton: "rouge" },
  ],
  "greens-hiver": [
    { cle: "non", libelle: "Non", ton: "gris" },
    { cle: "oui", libelle: "Oui", ton: "ambre" },
  ],
  voiturette: [
    { cle: "autorisees", libelle: "Autorisées", ton: "vert" },
    { cle: "chemins", libelle: "Chemins", ton: "ambre" },
    { cle: "interdites", libelle: "Interdites", ton: "rouge" },
  ],
};

export function optionsStatut(installation: Pick<Installation, "cle" | "type" | "feminin">) {
  const propres = specifiques[installation.cle];
  if (propres) return propres;

  const e = installation.feminin ? "e" : "";
  return installation.type === "ouverture"
    ? [
        { cle: "ouvert", libelle: `Ouvert${e}`, ton: "vert" as const },
        { cle: "ferme", libelle: `Fermé${e}`, ton: "rouge" as const },
      ]
    : [
        { cle: "autorise", libelle: `Autorisé${e}`, ton: "vert" as const },
        { cle: "interdit", libelle: `Interdit${e}`, ton: "rouge" as const },
      ];
}

/**
 * État courant. Les données antérieures aux états multiples n'ont que
 * `actif` : actif → état normal, sinon le dernier (fermé, interdit…).
 */
export function optionCourante(installation: Installation): OptionStatut {
  const options = optionsStatut(installation);
  return (
    options.find((option) => option.cle === installation.etat) ??
    (installation.actif ? options[0] : options[options.length - 1])
  );
}

/** « Fermée », « Autorisées », « Restreint »… */
export function libelleEtat(installation: Installation): string {
  return optionCourante(installation).libelle;
}

/** Ouvert ou utilisable, même partiellement (tout sauf rouge). */
export const estDisponible = (installation: Installation) =>
  optionCourante(installation).ton !== "rouge";

/** Longueur maximale d'une précision. */
export const LONGUEUR_MAX_PRECISION = 30;

/**
 * Valeur affichée en face de l'installation : la précision saisie par
 * l'accueil si l'installation est dans son état normal (« 8h – 19h »),
 * sinon l'état.
 */
export function valeurStatut(installation: Installation): string {
  const option = optionCourante(installation);
  return option.ton === "vert" && installation.precision ? installation.precision : option.libelle;
}

/** Complète une installation lue dans un fichier ancien (sans `etat` ni `description`). */
export function normaliserInstallation(installation: Installation): Installation {
  const option = optionCourante(installation);
  return {
    ...installation,
    etat: option.cle,
    actif: option.ton !== "rouge",
    description: installation.description ?? null,
  };
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
