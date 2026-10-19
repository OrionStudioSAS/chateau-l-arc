/**
 * Demandes envoyées depuis la page Contact (adhésion, cours, événement,
 * autre question). Types et libellés partagés par le site, les actions
 * serveur et l'écran « Demandes » du back-office.
 */

export type TypeDemande = "adhesion" | "cours" | "evenement" | "autre";
export type StatutDemande = "a-traiter" | "en-cours" | "traitee";

export type Demande = {
  id: string;
  type: TypeDemande;
  /** Pastille de la liste : « Séminaire », « Académie »… */
  etiquette: string;
  /** Titre de la demande : « Séminaire de 40 personnes en mai 2027 ». */
  objet: string;
  recueLe: string;
  statut: StatutDemande;
  /** E-mail du compte du back-office chargé de la demande. */
  assignee: string | null;
  lueLe: string | null;
  traiteeLe: string | null;
  prenom: string;
  nom: string;
  email: string;
  telephone: string | null;
  societe: string | null;
  message: string;
  /** Réponses du formulaire, dans l'ordre (« Participants : 40 »). */
  details: { libelle: string; valeur: string }[];
  newsletter: boolean;
};

export const typesDemande: Record<
  TypeDemande,
  { libelle: string; formulaire: string; equipe: string; ton: "vert" | "bleu" | "or" | "gris" }
> = {
  adhesion: { libelle: "Adhésion", formulaire: "Formulaire Devenir membre", equipe: "la direction du club", ton: "vert" },
  cours: { libelle: "Académie", formulaire: "Formulaire Cours & stages", equipe: "l'Académie", ton: "bleu" },
  evenement: { libelle: "Événement", formulaire: "Formulaire Séminaires", equipe: "l'équipe événements", ton: "or" },
  autre: { libelle: "Contact", formulaire: "Formulaire Contact", equipe: "l'accueil golf", ton: "gris" },
};

export const statutsDemande: { cle: StatutDemande; libelle: string }[] = [
  { cle: "a-traiter", libelle: "À traiter" },
  { cle: "en-cours", libelle: "En cours" },
  { cle: "traitee", libelle: "Traitée" },
];

export const LONGUEUR_MAX_MESSAGE = 2000;

/** « Sophie Marchand » → « SM ». */
export const initiales = (d: Pick<Demande, "prenom" | "nom">) =>
  `${d.prenom.charAt(0)}${d.nom.charAt(0)}`.toUpperCase();

/** « c.martin@golf.fr » → « C. Martin » (assignation). */
export function nomCompte(email: string): string {
  return email
    .split("@")[0]
    .split(/[._-]+/)
    .filter(Boolean)
    .map((morceau, i, liste) =>
      morceau.length === 1 && i < liste.length - 1
        ? `${morceau.toUpperCase()}.`
        : morceau.charAt(0).toUpperCase() + morceau.slice(1),
    )
    .join(" ");
}

/**
 * Brouillon de réponse proposé dans le back-office, à copier dans sa
 * messagerie : il reprend la demande pour gagner du temps, rien n'est envoyé.
 */
export function brouillonReponse(d: Demande): string {
  const bonjour = `Bonjour ${d.prenom} ${d.nom},`;
  const fin = "\n\nBien cordialement,\nL'équipe du Château l'Arc Golf Club";
  switch (d.type) {
    case "adhesion":
      return `${bonjour}\n\nMerci pour votre demande d'adhésion (${d.objet.toLowerCase()}). Je vous propose un appel cette semaine pour finaliser votre abonnement et répondre à vos questions.${fin}`;
    case "cours":
      return `${bonjour}\n\nMerci pour votre demande auprès de l'Académie (${d.objet}). Nous vérifions les places disponibles sur vos jours et revenons vers vous avec une date de démarrage.${fin}`;
    case "evenement":
      return `${bonjour}\n\nMerci pour votre demande. Nous accueillerons volontiers votre événement. Je vous propose un appel cette semaine pour préciser le programme (${d.details.find((x) => x.libelle === "Prestations")?.valeur.toLowerCase() ?? "salle, restauration, golf"}) et vous envoyer une proposition chiffrée.${fin}`;
    default:
      return `${bonjour}\n\nMerci pour votre message. [Votre réponse]${fin}`;
  }
}
