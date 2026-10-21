import { pagesAdminMasquees } from "@/config/visibilite";
import type { NomIconeAdmin } from "@/components/admin/icone-admin";

export type AdminNavItem = {
  label: string;
  /** Rubrique interne, ou URL externe (ouverte dans un nouvel onglet). */
  href: string | null;
  icone: NomIconeAdmin;
  /** Compteur affiché à droite (cf. layout du tableau de bord). */
  compteur?: "competitions" | "demandes";
};

export type AdminNavGroupe = { titre: string | null; items: AdminNavItem[] };

/**
 * Navigation du back-office, par groupes (maquette « Accueil »).
 * `href: null` : application externe dont le lien reste à fournir.
 */
const groupes: AdminNavGroupe[] = [
  {
    titre: null,
    items: [
      { label: "Accueil", href: "/admin", icone: "maison" },
      { label: "Demandes", href: "/admin/demandes", icone: "courrier", compteur: "demandes" },
    ],
  },
  {
    titre: "Module Golf",
    items: [
      { label: "Statut des installations", href: "/admin/statut", icone: "drapeau" },
      {
        label: "Compétitions",
        href: "/admin/competitions",
        icone: "trophee",
        compteur: "competitions",
      },
      { label: "Tarifs", href: "/admin/tarifs", icone: "etiquette" },
      // TODO : lien de l'outil de calendrier de publication.
      { label: "Calendrier de publication", href: null, icone: "calendrier" },
    ],
  },
  {
    titre: "CMS",
    items: [
      { label: "Bandeau d'information", href: "/admin/bandeau", icone: "bandeau" },
      { label: "Pop-up marketing", href: "/admin/popup-marketing", icone: "megaphone" },
      { label: "Pages", href: "/admin/pages", icone: "page" },
      { label: "Blog", href: "/admin/blog", icone: "livre" },
    ],
  },
  {
    titre: "Extensions",
    items: [
      { label: "Swing Call", href: "https://app.swingcall.fr", icone: "swingcall" },
      { label: "Orion Translate", href: "/admin/orion-translate", icone: "traduction" },
    ],
  },
];

const visible = (item: AdminNavItem) =>
  !item.href || !pagesAdminMasquees.includes(item.href);

export const adminNav: AdminNavGroupe[] = groupes.map((groupe) => ({
  ...groupe,
  items: groupe.items.filter(visible),
}));

export const adminNavPied: AdminNavItem[] = [
  { label: "Aide & support", href: "/admin/aide", icone: "bouee" },
];

/** Rubriques sans écran pour l'instant : servies par admin/[rubrique]. */
export const rubriquesAVenir: Record<string, { titre: string; description: string }> = {
  blog: { titre: "Blog", description: "Actualités et articles du club." },
  "orion-faq": { titre: "Orion FAQ", description: "Questions fréquentes du centre d'aide." },
  "orion-reviews": {
    titre: "Orion Reviews",
    description: "Avis Google du golf, affichés et suivis depuis le back-office.",
  },
};

/** Libellé d'une rubrique à partir de son chemin (fil d'Ariane). */
export function libelleRubrique(chemin: string): string {
  return filAriane(chemin).at(-1) ?? "Back-office";
}

/** Fil d'Ariane d'une rubrique : son groupe (« CMS ») puis son nom (« Pages »). */
export function filAriane(chemin: string): string[] {
  const groupes = [...adminNav, { titre: null, items: adminNavPied }];
  for (const groupe of groupes) {
    for (const item of groupe.items) {
      if (!item.href || item.href.startsWith("https://")) continue;
      const base = item.href.split("#")[0];
      if (base === "/admin" ? chemin === "/admin" : chemin.startsWith(base)) {
        return groupe.titre === "CMS" ? [groupe.titre, item.label] : [item.label];
      }
    }
  }
  return ["Back-office"];
}

/**
 * Équipe Orion Studio affichée sur l'accueil.
 * TODO : liens de prise de rendez-vous visio et adresses e-mail.
 */
export const equipeOrion: {
  initiales: string;
  nom: string;
  visio: string;
  ecrire: string;
}[] = [
  { initiales: "JB", nom: "Julien", visio: "https://orion-studio.io", ecrire: "https://orion-studio.io" },
  {
    initiales: "TM",
    nom: "Théophile",
    visio: "https://orion-studio.io",
    ecrire: "https://orion-studio.io",
  },
];
