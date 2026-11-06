import type { Route } from "next";

/**
 * URL publique du site.
 *
 * `??` ne rattrape qu'une variable absente, pas une variable définie mais
 * vide — cas d'une variable créée sans valeur sur Vercel, qui faisait échouer
 * `new URL()` au build. On valide donc chaque candidat avant de le retenir, et
 * on se rabat sur le domaine fourni par Vercel quand rien n'est renseigné.
 */
/** Domaine de production (avec www) : canonicals, sitemap, données structurées. */
export const DOMAINE_CANONIQUE = "https://www.chateaularcgolfclub.com";
const URL_PAR_DEFAUT = DOMAINE_CANONIQUE;

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
  /** Nom de marque utilisé par Google (titres, données structurées) : celui du domaine. */
  nomMarque: "Château l'Arc Golf Club",
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
    telephone: "04 42 29 83 41",
    /** Format international pour les liens `tel:` (sans le 0 après +33). */
    telephoneLien: "tel:+33442298341",
    /** Club-house de Château l'Arc Golf Club (OpenStreetMap). */
    coordonnees: { latitude: 43.4627, longitude: 5.5971 },
    // TODO : orthographe du domaine à confirmer.
    email: "golf@chateaularcgolfclub.com",
  },
} as const;

/** Itinéraire vers le golf dans Google Maps (pied de page, page Histoire). */
export const urlItineraire = `https://www.google.com/maps/dir/?${new URLSearchParams({
  api: "1",
  destination: "Château l'Arc Golf Club, 13710 Fuveau",
})}`;

/** Réservation des départs en ligne (Prima Golf), ouverte dans un nouvel onglet. */
export const urlReservation = "https://prima.golf/sainte-victoire/home";

/** Sainte-Victoire International School, installée sur le domaine. */
export const urlSvis = "https://www.svis.fr/";

/** Restaurant « La Table du Golf » sur Tripadvisor (avis et réservation). */
export const urlRestaurant =
  "https://www.tripadvisor.fr/Restaurant_Review-g675388-d21110116-Reviews-La_Table_Du_Golf-Fuveau_Bouches_du_Rhone_Provence_Alpes_Cote_d_Azur.html";

export type NavItem = {
  label: string;
  href: string;
  /** En-tête : lien masqué sous 1440 px, pour libérer la place (il reste dans le menu mobile). */
  grandEcran?: boolean;
};

/** Liens de gauche dans l'en-tête, dans l'ordre de la maquette. */
export const headerNav: NavItem[] = [
  { label: "Parcours", href: "/le-parcours" },
  { label: "Tarifs", href: "/tarifs" },
  { label: "Compétitions", href: "/competitions" },
  { label: "Histoire", href: "/histoire", grandEcran: true },
  { label: "Vie académie", href: "/academie" },
  { label: "Contact", href: "/contact" },
];

/**
 * Page Contact ouverte sur le bon formulaire (cf. FormulaireContact) : ces
 * liens remplacent les pages qui n'existent pas (groupes, recrutement, proshop).
 */
export const liensContact = {
  evenement: "/contact?demande=evenement#formulaire",
  question: "/contact?demande=autre#formulaire",
} as const;

/** Carte de score à télécharger. TODO : PDF à fournir ; sans adresse, les boutons sont masqués. */
export const urlCarteDeScore: string | null = null;

/**
 * Bloc de droite dans l'en-tête : état du parcours, téléphone, deux boutons.
 * `info` reste la page complète de l'état des installations (menu mobile).
 */
export const headerActions = {
  // Le formulaire de la page Contact s'ouvre sur la demande d'adhésion.
  membre: { label: "Devenir membre", href: "/contact" as Route },
  reservation: { label: "Réserver un départ", href: urlReservation as Route },
};

/** Réseaux sociaux du club. TODO : URL LinkedIn, TikTok et YouTube à fournir ; sans URL, le libellé reste inerte. */
export const reseaux: { label: string; url: string }[] = [
  { label: "Linkedin", url: "" },
  { label: "Instagram", url: "https://www.instagram.com/chateaularcgolfclub/" },
  { label: "Facebook", url: "https://www.facebook.com/Chateaularcgolfclubprovence/" },
  { label: "TikTok", url: "" },
  { label: "Youtube", url: "" },
];

export const liensInstitutionnels: NavItem[] = [
  { label: "À propos", href: "/histoire" },
  { label: "Histoire", href: "/histoire" },
  { label: "Groupe & Privatisation", href: liensContact.evenement },
  { label: "Recrutement", href: liensContact.question },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export const liensLegaux: NavItem[] = [
  { label: "Mentions légales", href: "/mentions-legales" },
  { label: "Politique de confidentialité", href: "/politique-de-confidentialite" },
];

/** Accueils affichés en pied de page : un seul numéro, celui du golf. */
const TELEPHONE_INTERNATIONAL = "+33 4 42 29 83 41";

export const servicesContact = [
  { nom: "S.C.I", horaires: "Lundi - Dimanche | 12h-1h", telephone: TELEPHONE_INTERNATIONAL },
  {
    nom: "Bar / Restaurant",
    horaires: "Lundi - Dimanche | 12h-1h",
    telephone: TELEPHONE_INTERNATIONAL,
  },
  { nom: "Pro-shop", horaires: "Lundi - Dimanche | 12h-1h", telephone: TELEPHONE_INTERNATIONAL },
];

/**
 * Partenaires du club.
 * Liens repris de l'ancien site ; les autres restent vides tant que leur adresse n'est pas connue.
 */
export const partenaires: { nom: string; logo: string; url?: string }[] = [
  { nom: "Les Masques", logo: "/images/logo1.png" },
  { nom: "Golf d'Aix-en-Provence — Set Club", logo: "/images/logo2.png" },
  { nom: "La Cabre d'Or Golf", logo: "/images/logo3.png" },
  { nom: "Le Club Golf", logo: "/images/logo4.png" },
  { nom: "Les Alchimistes", logo: "/images/logo5.png", url: "https://lesalchimistes-joaillerie.com/" },
  { nom: "Golf des Marques", logo: "/images/logo6.png", url: "https://www.golfdesmarques.com/" },
  { nom: "Autosprinter Toyota Aix-en-Provence", logo: "/images/logo7.png" },
];

/** Pages publiques existantes (statistiques et ciblage de la pop-up dans le back-office). */
export const routesPubliques: NavItem[] = [
  ...headerNav,
  { label: "Résultats des compétitions", href: "/competitions/resultats" },
  { label: "Actualités", href: "/actualites" },
  { label: "FAQ", href: "/faq" },
];

/**
 * Pages dont la première section est sombre : l'en-tête y est transparent
 * tant que la page n'a pas défilé. Partout ailleurs il reste blanc.
 */
export const routesHeroSombre: string[] = [
  "/",
  "/le-parcours",
  "/histoire",
  "/competitions",
  "/tarifs",
  "/academie",
  "/faq",
  "/contact",
];
