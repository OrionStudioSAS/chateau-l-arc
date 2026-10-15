import { pagesAdminMasquees } from "@/config/visibilite";
import type { NomIconeAdmin } from "@/components/admin/icone-admin";

export type AdminNavItem = {
  label: string;
  /** Rubrique interne, ou URL externe (ouverte dans un nouvel onglet). */
  href: string | null;
  icone: NomIconeAdmin;
  /** Compteur affiché à droite (cf. layout du tableau de bord). */
  compteur?: "competitions";
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
      { label: "Demandes", href: "/admin/demandes", icone: "courrier" },
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
      { label: "Médiathèque", href: "/admin/mediatheque", icone: "image" },
    ],
  },
  {
    titre: "Extensions",
    items: [
      { label: "Intégrations", href: "/admin/integrations", icone: "prise" },
      // TODO : lien Swing Call.
      { label: "Swing Call", href: null, icone: "swingcall" },
      { label: "Orion Translate", href: "/admin/orion-translate", icone: "traduction" },
      { label: "Orion Forms", href: "/admin/orion-forms", icone: "formulaire" },
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
  demandes: {
    titre: "Demandes",
    description: "Les demandes reçues depuis les formulaires du site, suivies au même endroit.",
  },
  tarifs: {
    titre: "Tarifs",
    description: "Grille des green fees, carnets et abonnements de la saison.",
  },
  pages: { titre: "Pages", description: "Les textes et images des pages du site." },
  blog: { titre: "Blog", description: "Actualités et articles du club." },
  mediatheque: { titre: "Médiathèque", description: "Photos, vidéos et documents du site." },
  integrations: {
    titre: "Intégrations",
    description: "Outils branchés sur le site : réservation, statistiques, réseaux sociaux.",
  },
  "orion-translate": {
    titre: "Orion Translate",
    description: "Traduction du site en anglais et dans d'autres langues.",
  },
  "orion-forms": {
    titre: "Orion Forms",
    description: "Formulaires du site (séminaires, contact, inscriptions), suivis dans Demandes.",
  },
  "orion-faq": { titre: "Orion FAQ", description: "Questions fréquentes du centre d'aide." },
  "orion-reviews": {
    titre: "Orion Reviews",
    description: "Avis Google du golf, affichés et suivis depuis le back-office.",
  },
};

/** Libellé d'une rubrique à partir de son chemin (fil d'Ariane). */
export function libelleRubrique(chemin: string): string {
  for (const item of [...adminNav.flatMap((g) => g.items), ...adminNavPied]) {
    if (!item.href || item.href.startsWith("https://")) continue;
    const base = item.href.split("#")[0];
    if (base === "/admin" ? chemin === "/admin" : chemin.startsWith(base)) return item.label;
  }
  return "Back-office";
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
