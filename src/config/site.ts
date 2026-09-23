import type { Route } from "next";

/**
 * URL publique du site.
 *
 * `??` ne rattrape qu'une variable absente, pas une variable définie mais
 * vide — cas d'une variable créée sans valeur sur Vercel, qui faisait échouer
 * `new URL()` au build. On valide donc chaque candidat avant de le retenir, et
 * on se rabat sur le domaine fourni par Vercel quand rien n'est renseigné.
 */
const URL_PAR_DEFAUT = "https://www.golfchateaularc.com";

function resoudreUrlSite(): string {
  const candidats = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_URL,
    URL_PAR_DEFAUT,
  ];

  for (const candidat of candidats) {
    const valeur = candidat?.trim();
    if (!valeur) continue;

    const avecProtocole = /^https?:\/\//.test(valeur) ? valeur : `https://${valeur}`;

    try {
      return new URL(avecProtocole).origin;
    } catch {
      // Valeur inexploitable : on essaie le candidat suivant.
    }
  }

  return URL_PAR_DEFAUT;
}

/**
 * Informations institutionnelles du club.
 * TODO : faire valider chaque valeur par le client (adresse, téléphone, horaires, réseaux).
 */
export const site = {
  name: "Golf Château l'Arc",
  shortName: "Château l'Arc",
  baseline: "Golf 18 trous au cœur de la Provence",
  /** Ligne affichée au-dessus du titre, en bas de la bannière d'accueil. */
  heroAccroche:
    "Parcours 18 trous dessiné par Robert Trent Jones II · Aux portes d'Aix-en-Provence",
  description:
    "Parcours 18 trous, académie, restaurant et événements privés au Golf Château l'Arc, à Fuveau, entre Aix-en-Provence et la Sainte-Victoire.",
  url: resoudreUrlSite(),
  contact: {
    adresse: "Domaine Château l'Arc",
    codePostalVille: "13710 Fuveau",
    telephone: "+33 (0)4 42 298 341",
    // TODO : orthographe du domaine à confirmer.
    email: "golf@chateaularcgolfclub.com",
  },
} as const;

export type NavItem = {
  label: string;
  href: Route;
};

/** Liens de gauche dans l'en-tête, dans l'ordre de la maquette. */
export const headerNav: NavItem[] = [
  { label: "Parcours", href: "/le-parcours" },
  { label: "Compétitions", href: "/competitions" },
  { label: "Tarifs", href: "/tarifs" },
  { label: "Histoire", href: "/histoire" },
  { label: "Nous appeler", href: "/contact" },
];

/** Bloc de droite dans l'en-tête : un lien texte puis deux boutons. */
export const headerActions = {
  info: { label: "Informations sur le parcours", href: "/informations-parcours" as Route },
  membre: { label: "Devenir membre", href: "/devenir-membre" as Route },
  reservation: { label: "Réserver un départ", href: "/reserver" as Route },
};

/** Réseaux sociaux du club. TODO : renseigner les URL, sinon le libellé reste inerte. */
export const reseaux: { label: string; url: string }[] = [
  { label: "Linkedin", url: "" },
  { label: "Instagram", url: "" },
  { label: "TikTok", url: "" },
  { label: "Youtube", url: "" },
];

export const liensInstitutionnels: NavItem[] = [
  { label: "À propos", href: "/a-propos" },
  { label: "Groupe & Privatisation", href: "/groupe-privatisation" },
  { label: "Recrutement", href: "/recrutement" },
  { label: "FAQ", href: "/faq" },
];

export const liensLegaux: NavItem[] = [
  { label: "CGV", href: "/cgv" },
  { label: "Mentions légales", href: "/mentions-legales" },
  { label: "Politique de confidentialité", href: "/politique-de-confidentialite" },
];

/** Accueils téléphoniques affichés en pied de page. TODO : numéros à confirmer. */
export const servicesContact = [
  { nom: "S.C.I", horaires: "Lundi - Dimanche | 12h-1h", telephone: "+33 1 34 76 74 70" },
  {
    nom: "Bar / Restaurant",
    horaires: "Lundi - Dimanche | 12h-1h",
    telephone: "+33 1 30 93 95 59",
  },
  { nom: "Pro-shop", horaires: "Lundi - Dimanche | 12h-1h", telephone: "+33 1 34 76 65 57" },
];

/** Toutes les pages publiques, pour le plan du site. */
export const routesPubliques: NavItem[] = [
  ...headerNav,
  { label: "Académie", href: "/academie" },
  { label: "Actualités", href: "/actualites" },
  { label: "Devenir membre", href: "/devenir-membre" },
  { label: "Réserver un départ", href: "/reserver" },
  { label: "Informations sur le parcours", href: "/informations-parcours" },
  ...liensInstitutionnels,
  ...liensLegaux,
];

/**
 * Pages dont la première section est sombre : l'en-tête y est transparent
 * tant que la page n'a pas défilé. Partout ailleurs il reste blanc.
 */
export const routesHeroSombre: string[] = ["/"];
