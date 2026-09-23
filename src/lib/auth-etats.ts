/** États partagés entre les formulaires du back-office et leurs actions serveur. */
export type EtatConnexion = { statut: "vide" } | { statut: "erreur"; message: string };
