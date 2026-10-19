import { routesPubliques, site } from "@/config/site";

/** Constantes et fonctions partagées par l'écran de pop-up, son action et le site. */

export const TYPES_AFFICHE = ["image/jpeg", "image/png", "image/webp"];
/** L'image est recadrée et réduite dans le navigateur (1600 × 1067) : 2 Mo suffisent. */
export const TAILLE_MAX_AFFICHE = 2 * 1024 * 1024;

export const LONGUEUR_MAX_TITRE = 60;
export const LONGUEUR_MAX_TEXTE = 160;

/** Une pop-up fermée ne revient pas avant ce délai (sauf nouvelle publication). */
export const JOURS_AVANT_RETOUR = 30;

/**
 * Le lien du bouton est rendu tel quel dans un `href` du site public : seuls
 * les chemins internes, le web, le téléphone et l'e-mail sont acceptés, ce qui
 * écarte notamment `javascript:`.
 */
export function lienAutorise(lien: string): boolean {
  return /^(\/(?!\/)|https?:\/\/|tel:|mailto:)/i.test(lien);
}

const libellesPropres: Record<string, string> = {
  "/": "Accueil",
  "/academie": "L'Académie",
  "/le-parcours": "Le parcours",
};

/** Pages proposées comme lien du bouton (et nom affiché dans le sélecteur). */
export const pagesDuSite: { href: string; libelle: string }[] = [
  { href: "/", libelle: "Accueil" },
  ...routesPubliques
    .filter((route) => !/^\/(cgv|mentions|politique)/.test(route.href))
    .map((route) => ({ href: route.href, libelle: libellesPropres[route.href] ?? route.label })),
].filter((page, i, liste) => liste.findIndex((p) => p.href === page.href) === i);

/** Liens rapides : l'accueil téléphonique du club. */
export const liensRapides = [{ href: site.contact.telephoneLien, libelle: `Appeler l'accueil` }];

export function libelleLien(lien: string): string | null {
  return (
    pagesDuSite.find((p) => p.href === lien)?.libelle ??
    liensRapides.find((l) => l.href === lien)?.libelle ??
    null
  );
}

const saisons = ["Hiver", "Hiver", "Printemps", "Printemps", "Printemps", "Été", "Été", "Été", "Automne", "Automne", "Automne", "Hiver"];

/**
 * Surtitre de la pop-up, déduit de la page visée et de la saison de début :
 * « Académie · Été 2026 ». Rien à saisir pour le club.
 */
export function surtitrePopup(
  lien: string | undefined | null,
  debut: string | undefined | null,
  tr: (francais: string) => string = (x) => x,
): string {
  const page = lien?.startsWith("/") ? pagesDuSite.find((p) => p.href === lien)?.libelle : undefined;
  const rubrique = page && page !== "Accueil" ? tr(page.replace(/^(L'|Le |La |Les )/, "")) : null;
  const date = debut ? new Date(`${debut}T12:00:00Z`) : null;
  const saison = date ? `${tr(saisons[date.getUTCMonth()])} ${date.getUTCFullYear()}` : null;
  return [rubrique, saison].filter(Boolean).join(" · ");
}
