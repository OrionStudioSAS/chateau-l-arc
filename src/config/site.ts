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

/** Restaurant « La Table du Golf » sur Tripadvisor (avis et réservation). */
export const urlRestaurant =
  "https://www.tripadvisor.fr/Restaurant_Review-g675388-d21110116-Reviews-La_Table_Du_Golf-Fuveau_Bouches_du_Rhone_Provence_Alpes_Cote_d_Azur.html";

export type NavItem = {
  label: string;
  href: Route;
};

/** Liens de gauche dans l'en-tête, dans l'ordre de la maquette. */
export const headerNav: NavItem[] = [
  { label: "Parcours", href: "/le-parcours" },
  { label: "Tarifs", href: "/tarifs" },
  { label: "Compétitions", href: "/competitions" },
  { label: "Histoire", href: "/histoire" },
  { label: "Vie académie", href: "/academie" },
];

/**
 * Pages pas encore construites (supprimées en attendant leur maquette) : les
 * liens restent en place et mènent à la page 404 jusqu'à leur création.
 * Une fois une page créée, retirer son `as Route` suffit.
 */
export const pagesAVenir = {
  devenirMembre: "/devenir-membre" as Route,
  restaurant: "/restaurant" as Route,
  proshop: "/proshop" as Route,
  aPropos: "/a-propos" as Route,
  groupePrivatisation: "/groupe-privatisation" as Route,
  recrutement: "/recrutement" as Route,
  carteDeScore: "/le-parcours/scorecard" as Route,
  cgv: "/cgv" as Route,
  mentionsLegales: "/mentions-legales" as Route,
  politiqueConfidentialite: "/politique-de-confidentialite" as Route,
};

/**
 * Bloc de droite dans l'en-tête : état du parcours, téléphone, deux boutons.
 * `info` reste la page complète de l'état des installations (menu mobile).
 */
export const headerActions = {
  membre: { label: "Devenir membre", href: pagesAVenir.devenirMembre },
  reservation: { label: "Réserver un départ", href: urlReservation as Route },
};

/** Réseaux sociaux du club. TODO : renseigner les URL, sinon le libellé reste inerte. */
export const reseaux: { label: string; url: string }[] = [
  { label: "Linkedin", url: "" },
  { label: "Instagram", url: "" },
  { label: "TikTok", url: "" },
  { label: "Youtube", url: "" },
];

export const liensInstitutionnels: NavItem[] = [
  { label: "À propos", href: pagesAVenir.aPropos },
  { label: "Groupe & Privatisation", href: pagesAVenir.groupePrivatisation },
  { label: "Recrutement", href: pagesAVenir.recrutement },
  { label: "FAQ", href: "/faq" },
];

export const liensLegaux: NavItem[] = [
  { label: "CGV", href: pagesAVenir.cgv },
  { label: "Mentions légales", href: pagesAVenir.mentionsLegales },
  { label: "Politique de confidentialité", href: pagesAVenir.politiqueConfidentialite },
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

/**
 * Partenaires du club.
 * Les liens restent vides tant que les adresses des partenaires ne sont pas connues.
 */
export const partenaires: { nom: string; logo: string; url?: string }[] = [
  { nom: "Les Masques", logo: "/images/logo1.png" },
  { nom: "Golf d'Aix-en-Provence — Set Club", logo: "/images/logo2.png" },
  { nom: "La Cabre d'Or Golf", logo: "/images/logo3.png" },
  { nom: "Le Club Golf", logo: "/images/logo4.png" },
  { nom: "Les Alchimistes", logo: "/images/logo5.png" },
  { nom: "Golf des Marques", logo: "/images/logo6.png" },
  { nom: "Autosprinter Toyota Aix-en-Provence", logo: "/images/logo7.png" },
];

/** Pages publiques existantes (statistiques et ciblage de la pop-up dans le back-office). */
export const routesPubliques: NavItem[] = [
  ...headerNav,
  { label: "Nous contacter", href: "/contact" },
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
];
