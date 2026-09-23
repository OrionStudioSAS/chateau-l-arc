import type { Route } from "next";

export type AdminNavItem = {
  label: string;
  href: Route;
  icone: string;
};

/**
 * Sections du back-office. Seule « Statut & bandeau » a du contenu pour l'instant ;
 * les autres sont des coquilles à remplir au fil des maquettes.
 */
export const adminNav: AdminNavItem[] = [
  { label: "Statut & bandeau", href: "/admin", icone: "⛳️" },
  { label: "Compétitions", href: "/admin/competitions", icone: "🏆" },
  { label: "Pop-up marketing", href: "/admin/popup-marketing", icone: "🚩" },
  { label: "Aide & contact", href: "/admin/aide", icone: "❓" },
];
