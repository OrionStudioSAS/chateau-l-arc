"use server";

import { randomUUID } from "node:crypto";
import { headers } from "next/headers";

import { getGrilleTarifs } from "@/lib/api/content";
import { formulesJuniors, formulesPrestige } from "@/lib/academie";
import { LONGUEUR_MAX_MESSAGE, typesDemande, type Demande, type TypeDemande } from "@/lib/demandes";
import { demandesDisponibles, enregistrerDemande, envoiAutorise } from "@/lib/demandes-stockage";
import { euros } from "@/lib/tarifs";
import { dictionnaire } from "@/lib/i18n/dictionnaires";
import { estLangue, formateurEuros, LANGUE_PRINCIPALE, localeIntl, traducteur, type Traducteur } from "@/lib/i18n";

/** Ce que le formulaire envoie ; tout est revérifié ici. */
export type EnvoiDemande = {
  type: TypeDemande;
  /** Réponses propres au formulaire choisi (cf. contruireDetails). */
  champs: Record<string, string | number | string[]>;
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  message: string;
  consentement: boolean;
  newsletter: boolean;
  /** Champ invisible : rempli, c'est un robot. */
  piege: string;
  /** Temps passé sur le formulaire, en millisecondes. */
  duree: number;
  /** Langue de la page : messages et récapitulatif dans cette langue (la demande reste en français). */
  langue?: string;
};

export type ResultatEnvoi =
  | {
      ok: true;
      prenom: string;
      email: string;
      equipe: string;
      recapitulatif: { libelle: string; valeur: string }[];
    }
  | { ok: false; message: string };

const texte = (valeur: unknown, max = 120) => String(valeur ?? "").trim().slice(0, max);
const liste = (valeur: unknown) =>
  (Array.isArray(valeur) ? valeur : []).map((v) => texte(v, 60)).filter(Boolean).slice(0, 12);
const majuscule = (texte: string) => texte.charAt(0).toUpperCase() + texte.slice(1);
const enumerer = (valeurs: string[]) =>
  valeurs.length <= 1 ? valeurs.join("") : `${valeurs.slice(0, -1).join(", ")} & ${valeurs.at(-1)}`;

const moisAnnee = new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric", timeZone: "UTC" });
const dateLongue = new Intl.DateTimeFormat("fr-FR", { weekday: "short", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

type Contenu = Pick<Demande, "objet" | "etiquette" | "details"> & { resume: { libelle: string; valeur: string }[] };

/** Titre, pastille et réponses lisibles de la demande, selon le formulaire. */
async function construire(
  type: TypeDemande,
  c: EnvoiDemande["champs"],
  tr: Traducteur,
  prix: (montant: number) => string,
  locale: string,
): Promise<Contenu | string> {
  const dateLocale = (date: Date) =>
    new Intl.DateTimeFormat(locale, { weekday: "short", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(date);
  if (type === "adhesion") {
    const grille = await getGrilleTarifs();
    const formule = grille.abonnements.find((a) => a.id === c.formule);
    if (!formule) return tr("Choisissez une formule d'abonnement.");
    const comptant = c.reglement === "comptant";
    const prixComptant = Math.round(formule.prix * (1 - grille.remiseComptant.taux));
    const details = [
      { libelle: "Formule", valeur: `${formule.libelle} · ${euros(formule.prix)} / an` },
      { libelle: "En comptant", valeur: euros(prixComptant) },
      { libelle: "Règlement", valeur: comptant ? "Comptant" : "En plusieurs fois" },
      { libelle: "Index", valeur: texte(c.index, 20) || "Débutant" },
      { libelle: "Licence FFGolf", valeur: texte(c.licence, 30) || "—" },
      { libelle: "Déjà joueur au club", valeur: texte(c.deja, 40) || "—" },
    ];
    return {
      objet: `Abonnement ${formule.libelle.toLowerCase()}`,
      etiquette: "Adhésion",
      details,
      resume: [
        { libelle: tr("Demande"), valeur: tr("Devenir membre") },
        { libelle: tr("Formule"), valeur: `${majuscule(tr("Abonnement {formule}").replace("{formule}", tr(formule.libelle).toLowerCase()))} · ${prix(formule.prix)}` },
        { libelle: tr("Règlement"), valeur: comptant ? tr("Comptant") : tr("En plusieurs fois") },
      ],
    };
  }

  if (type === "cours") {
    const enfant = c.public === "enfant";
    const formules = [
      ...(enfant ? formulesJuniors : formulesPrestige).map((f) => f.titre),
      ...(enfant ? [] : ["Initiation découverte", "Cours individuel"]),
    ];
    const formule = texte(c.formule, 60);
    if (!formule) return tr("Choisissez une formule.");
    const prix =
      (enfant ? formulesJuniors : formulesPrestige).find((f) => f.titre === formule)?.prix ?? null;
    const jours = liste(c.jours);
    const debut = /^\d{4}-\d{2}$/.test(String(c.debut)) ? moisAnnee.format(new Date(`${c.debut}-01T12:00:00Z`)) : "";
    const details = [
      { libelle: "Pour", valeur: enfant ? "Un enfant" : "Un adulte" },
      { libelle: "Formule", valeur: formules.includes(formule) && prix ? `${formule} · ${euros(prix)}${enfant ? " / an" : " / mois"}` : formule },
      { libelle: "Niveau", valeur: texte(c.niveau, 40) || "—" },
      { libelle: "Jours", valeur: enumerer(jours) || "—" },
      { libelle: "Début souhaité", valeur: debut || "—" },
      { libelle: "Enseignant", valeur: texte(c.enseignant, 60) || "Pas de préférence" },
    ];
    return {
      objet: `${formule}${enfant ? " pour un enfant" : ""}`,
      etiquette: "Académie",
      details,
      resume: [
        { libelle: tr("Demande"), valeur: tr("Cours & stages") },
        { libelle: tr("Formule"), valeur: tr(formule) },
        { libelle: tr("Jours"), valeur: enumerer(jours.map(tr)) || tr("À convenir") },
      ],
    };
  }

  if (type === "evenement") {
    const evenement = texte(c.evenement, 60);
    if (!evenement) return tr("Choisissez le type d'événement.");
    const participants = Math.max(1, Math.min(2000, Math.round(Number(c.participants) || 0)));
    const date = /^\d{4}-\d{2}-\d{2}$/.test(String(c.date)) ? new Date(`${c.date}T12:00:00Z`) : null;
    const prestations = liste(c.prestations);
    const societe = texte(c.societe, 80);
    if (c.facturation === "Société" && !societe) return tr("Indiquez le nom de la société.");
    const details = [
      { libelle: "Événement", valeur: evenement },
      { libelle: "Date souhaitée", valeur: date ? dateLongue.format(date) : "À définir" },
      { libelle: "Participants", valeur: String(participants) },
      { libelle: "Moment", valeur: texte(c.moment, 30) || "—" },
      { libelle: "Prestations", valeur: enumerer(prestations) || "—" },
      { libelle: "Budget", valeur: texte(c.budget, 40) || "Non défini" },
      { libelle: "Facture au nom de", valeur: c.facturation === "Société" ? `Société${societe ? ` · ${societe}` : ""}` : "Particulier" },
      ...(texte(c.fonction, 60) ? [{ libelle: "Fonction", valeur: texte(c.fonction, 60) }] : []),
    ];
    return {
      objet: `${evenement} de ${participants} personne${participants > 1 ? "s" : ""}${date ? ` en ${moisAnnee.format(date)}` : ""}`,
      etiquette: evenement.split(" ")[0] === "Journée" ? "Golf entreprise" : evenement,
      details,
      resume: [
        { libelle: tr("Demande"), valeur: tr("Séminaire & privatisation") },
        { libelle: tr("Événement"), valeur: `${tr(evenement)} · ${participants} ${participants > 1 ? tr("personnes") : tr("personne")}` },
        { libelle: tr("Date"), valeur: date ? dateLocale(date) : tr("À définir") },
      ],
    };
  }

  const sujet = texte(c.sujet, 60) || "Question";
  return {
    objet: sujet,
    etiquette: "Contact",
    details: [{ libelle: "Sujet", valeur: sujet }],
    resume: [
      { libelle: tr("Demande"), valeur: tr("Autre question") },
      { libelle: tr("Sujet"), valeur: tr(sujet) },
    ],
  };
}

/** Enregistre une demande de la page Contact (consultée dans le back-office › Demandes). */
export async function envoyerDemande(envoi: EnvoiDemande): Promise<ResultatEnvoi> {
  const type = envoi.type;
  const langue = estLangue(envoi.langue) ? envoi.langue : LANGUE_PRINCIPALE;
  const tr = traducteur(dictionnaire(langue));
  const locale = localeIntl(langue);
  if (!(type in typesDemande)) return { ok: false, message: tr("Choisissez le type de demande.") };

  const prenom = texte(envoi.prenom, 60);
  const nom = texte(envoi.nom, 60);
  const email = texte(envoi.email, 120).toLowerCase();
  const telephone = texte(envoi.telephone, 30);
  const message = String(envoi.message ?? "").trim().slice(0, LONGUEUR_MAX_MESSAGE);

  if (!prenom || !nom) return { ok: false, message: tr("Indiquez votre prénom et votre nom.") };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, message: tr("Votre adresse e-mail semble incomplète.") };
  if (type === "autre" && !message) return { ok: false, message: tr("Écrivez votre question dans le message.") };
  if (!envoi.consentement) return { ok: false, message: tr("Cochez la case d'accord pour que le club puisse vous répondre.") };

  const contenu = await construire(type, envoi.champs ?? {}, tr, formateurEuros(langue), locale);
  if (typeof contenu === "string") return { ok: false, message: contenu };

  const maintenant = new Date();
  const reussite: ResultatEnvoi = {
    ok: true,
    prenom,
    email,
    equipe: tr(typesDemande[type].equipe),
    recapitulatif: [
      ...contenu.resume,
      {
        libelle: tr("Envoyée le"),
        valeur: new Intl.DateTimeFormat(locale, { day: "numeric", month: "long", year: "numeric", hour: "numeric", minute: "2-digit", timeZone: "Europe/Paris" })
          .format(maintenant)
          .replace(/(\d{1,2}):(\d{2})$/, langue === LANGUE_PRINCIPALE ? "$1h$2" : "$1:$2"),
      },
    ],
  };

  // Robot (champ piège rempli, ou envoi en moins de 3 secondes) : on fait
  // comme si tout allait bien, sans rien enregistrer.
  if (envoi.piege || Number(envoi.duree) < 3000) return reussite;

  if (!demandesDisponibles) {
    return { ok: false, message: `${tr("L'envoi est momentanément indisponible. Appelez l'accueil au")} 04 42 29 83 41.` };
  }

  try {
    const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "inconnue";
    if (!(await envoiAutorise(ip))) {
      return { ok: false, message: tr("Trop de demandes envoyées depuis votre connexion. Réessayez dans une heure.") };
    }

    await enregistrerDemande({
      id: randomUUID(),
      type,
      etiquette: contenu.etiquette,
      objet: contenu.objet,
      recueLe: maintenant.toISOString(),
      statut: "a-traiter",
      assignee: null,
      lueLe: null,
      traiteeLe: null,
      prenom,
      nom,
      email,
      telephone: telephone || null,
      societe: texte(envoi.champs?.societe, 80) || null,
      message,
      details: contenu.details,
      newsletter: Boolean(envoi.newsletter),
    });
  } catch (erreur) {
    console.error("Enregistrement de la demande impossible", erreur);
    return { ok: false, message: `${tr("L'envoi a échoué. Réessayez dans un instant ou appelez l'accueil au")} 04 42 29 83 41.` };
  }

  return reussite;
}
