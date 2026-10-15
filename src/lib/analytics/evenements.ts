/**
 * Événements suivis sur le site public, lus par l'accueil du back-office.
 * Un élément porte `data-suivi="<nom>"` pour être compté au clic ; les liens
 * `tel:` et la réservation en ligne le sont automatiquement.
 */
export const evenements = {
  inscription: "inscription",
  popupAffichage: "popup-affichage",
  popupClic: "popup-clic",
  appel: "appel",
  reservation: "reservation",
  /** Formulaire envoyé (`data-suivi-envoi="demande"` sur le <form>). */
  demande: "demande",
} as const;

export type NomEvenement = (typeof evenements)[keyof typeof evenements];

/** Mode édition du CMS (iframe d'Orion) : rien n'est compté. */
const enEdition = () => new URLSearchParams(window.location.search).has("edit");

/** Envoie une mesure à /api/suivi, sans bloquer la navigation (sendBeacon). */
export function envoyerSuivi(donnees: Record<string, string | number>) {
  if (enEdition()) return;
  const corps = JSON.stringify(donnees);
  if (!navigator.sendBeacon?.("/api/suivi", corps)) {
    fetch("/api/suivi", { method: "POST", body: corps, keepalive: true }).catch(() => {});
  }
}

/** Compte un événement ; `version` sert aux affichages de la pop-up. */
export function suivre(nom: NomEvenement, version?: string) {
  envoyerSuivi({ t: "evt", n: nom, p: window.location.pathname, ...(version ? { v: version } : {}) });
}
