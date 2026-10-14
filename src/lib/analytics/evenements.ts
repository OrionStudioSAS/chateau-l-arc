/**
 * Événements suivis sur le site public (Umami), lus par l'accueil du
 * back-office. Un élément porte `data-suivi="<nom>"` pour être compté au clic ;
 * les liens `tel:` et la réservation en ligne le sont automatiquement.
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

type Umami = { track: (nom: string, donnees?: Record<string, string>) => void };

/**
 * Envoie un événement. Le script de suivi se charge après la page : un
 * événement très précoce (affichage de la pop-up) attend jusqu'à 10 s qu'il
 * soit prêt. Sans script (suivi désactivé), rien n'est envoyé.
 */
export function suivre(nom: NomEvenement, donnees?: Record<string, string>, essai = 0) {
  const umami = (window as unknown as { umami?: Umami }).umami;
  if (umami) return umami.track(nom, donnees);
  if (essai < 20) window.setTimeout(() => suivre(nom, donnees, essai + 1), 500);
}
