/**
 * Repères de départ du parcours.
 * Les couleurs sont celles des marques sur le terrain : elles ne viennent pas
 * de la palette du site et sont partagées par les sections qui les affichent.
 */
export const REPERES = [
  { cle: "blanc", nom: "Blanc", couleur: "#ffffff", bordure: true },
  { cle: "jaune", nom: "Jaune", couleur: "#e0c04a" },
  { cle: "bleu", nom: "Bleu", couleur: "#2f6ba0" },
  { cle: "rouge", nom: "Rouge", couleur: "#b32d2e" },
  { cle: "violet", nom: "Violet", couleur: "#7d3c98" },
  { cle: "orange", nom: "Orange", couleur: "#e1791e" },
] as const;

export type CleRepere = (typeof REPERES)[number]["cle"];
