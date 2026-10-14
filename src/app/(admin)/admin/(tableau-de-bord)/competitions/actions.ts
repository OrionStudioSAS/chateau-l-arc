"use server";

import { updateTag } from "next/cache";

import { tags } from "@/lib/api/content";
import {
  slugifier,
  TAILLE_MAX_RESULTATS,
  type EtatCompetitionFormulaire,
  type EtatResultats,
} from "@/lib/admin/formulaire-competition";
import { exigerUtilisateur } from "@/lib/admin/session";
import { libellesCategorie } from "@/lib/competitions";
import { commiter } from "@/lib/contenu/depot";
import {
  cheminsContenu,
  DOSSIER_FICHIERS,
  lireDans,
  versJson,
  type FicheCompetition,
} from "@/lib/contenu/stockage";

const texte = (formData: FormData, champ: string): string =>
  String(formData.get(champ) ?? "").trim();

const texteOuNull = (formData: FormData, champ: string): string | null =>
  texte(formData, champ) || null;

/**
 * Un champ `datetime-local` n'a pas de fuseau : sans cela, « 18h00 » serait
 * enregistré en UTC et reviendrait à 20h00 côté client.
 */
const isoDepuisParis = (valeurLocale: string): string => {
  const [date, heure = "00:00"] = valeurLocale.split("T");
  const reference = new Date(`${date}T${heure}:00Z`);
  const decalage =
    new Intl.DateTimeFormat("en-US", {
      timeZone: "Europe/Paris",
      timeZoneName: "longOffset",
    })
      .formatToParts(reference)
      .find((partie) => partie.type === "timeZoneName")
      ?.value.replace("GMT", "") || "+00:00";

  return `${date}T${heure}:00${decalage}`;
};

const nombreOuNull = (formData: FormData, champ: string): number | null => {
  const valeur = texte(formData, champ);
  if (!valeur) return null;
  const nombre = Number(valeur);
  return Number.isFinite(nombre) ? nombre : null;
};

/** Ajoute un suffixe tant que l'identifiant d'URL est déjà pris. */
function slugDisponible(
  fiches: FicheCompetition[],
  base: string,
  idActuel: string | null,
): string {
  const pris = new Set(fiches.filter((f) => f.id !== idActuel).map((f) => f.slug));
  let candidat = base;
  for (let suffixe = 2; pris.has(candidat); suffixe += 1) candidat = `${base}-${suffixe}`;
  return candidat;
}

/**
 * Crée ou met à jour une compétition, puis rafraîchit le site public.
 * Le bouton utilisé détermine le statut : publication ou brouillon.
 */
export async function enregistrerCompetition(
  _etat: EtatCompetitionFormulaire,
  formData: FormData,
): Promise<EtatCompetitionFormulaire> {
  const nom = texte(formData, "nom");
  const dateDebut = texte(formData, "dateDebut");
  const statut = texte(formData, "statut") === "publie" ? "publie" : "brouillon";
  const id = texteOuNull(formData, "id");

  if (!nom) return { statut: "erreur", message: "Le nom est obligatoire." };
  if (!dateDebut) return { statut: "erreur", message: "La date est obligatoire." };

  const categorie = texte(formData, "categorie");
  if (!Object.hasOwn(libellesCategorie, categorie)) {
    return { statut: "erreur", message: "Choisissez le type de compétition." };
  }

  await exigerUtilisateur();

  const valeurs = {
    nom,
    dateDebut,
    dateFin: texteOuNull(formData, "dateFin"),
    formule: texte(formData, "formule") || "À préciser",
    depart: texte(formData, "depart") || "À préciser",
    trous: texte(formData, "trous") || "18 trous",
    indexMaximum: texteOuNull(formData, "indexMaximum"),
    categories: texteOuNull(formData, "categories"),
    sponsor: texteOuNull(formData, "sponsor"),
    inscriptionOuverture: texteOuNull(formData, "inscriptionOuverture"),
    inscriptionCloture: (() => {
      const valeur = texteOuNull(formData, "inscriptionCloture");
      return valeur ? isoDepuisParis(valeur) : null;
    })(),
    places: nombreOuNull(formData, "places"),
    modeInscription: texteOuNull(formData, "modeInscription"),
    droitJeuMembres: texteOuNull(formData, "droitJeuMembres"),
    droitJeuVisiteurs: texteOuNull(formData, "droitJeuVisiteurs"),
    inclus: texteOuNull(formData, "inclus"),
    description: texteOuNull(formData, "description"),
    categorie: categorie as FicheCompetition["categorie"],
    ouverteVisiteurs: formData.get("ouverteVisiteurs") === "on",
    statut,
  } satisfies Partial<FicheCompetition>;

  let introuvable = false as boolean;

  try {
    await commiter(`Back-office : compétition « ${nom} »`, async (lire) => {
      const fiches = await lireDans(lire, "competitions");
      const slug = slugDisponible(fiches, slugifier(nom), id);
      const existante = id ? fiches.find((fiche) => fiche.id === id) : undefined;

      if (id && !existante) {
        introuvable = true;
        return null;
      }

      const fiche: FicheCompetition = existante
        ? { ...existante, ...valeurs, slug }
        : {
            id: crypto.randomUUID(),
            ...valeurs,
            slug,
            inscrits: 0,
            afficheUrl: null,
            vainqueurs: null,
            resultatsUrl: null,
            resultatsPublies: false,
          };

      const suivantes = existante
        ? fiches.map((f) => (f.id === fiche.id ? fiche : f))
        : [...fiches, fiche];
      suivantes.sort((a, b) => a.dateDebut.localeCompare(b.dateDebut));

      return [{ chemin: cheminsContenu.competitions, contenu: versJson(suivantes) }];
    });
  } catch (erreur) {
    console.error("Enregistrement de la compétition impossible", erreur);
    return {
      statut: "erreur",
      message: "L'enregistrement a échoué. Réessayez dans un instant.",
    };
  }

  if (introuvable) {
    return { statut: "erreur", message: "Cette compétition n'existe plus. Rechargez la page." };
  }

  updateTag(tags.competitions);

  return {
    statut: "succes",
    message:
      statut === "publie"
        ? "Compétition publiée sur le site."
        : "Brouillon enregistré.",
  };
}

/**
 * Dépose le PDF des résultats d'une compétition terminée, puis le publie sur
 * le site : le fichier et la fiche partent dans le même commit, le PDF dans
 * contenu/fichiers/resultats/ (servi par /fichiers/…).
 */
export async function publierResultats(
  _etat: EtatResultats,
  formData: FormData,
): Promise<EtatResultats> {
  const id = String(formData.get("id") ?? "");
  const slug = String(formData.get("slug") ?? "");
  const fichier = formData.get("fichier");
  const vainqueurs = String(formData.get("vainqueurs") ?? "").trim() || null;

  if (vainqueurs && vainqueurs.length > 120) {
    return { statut: "erreur", message: "Les vainqueurs dépassent 120 caractères." };
  }

  if (!id || !(fichier instanceof File) || fichier.size === 0) {
    return { statut: "erreur", message: "Choisissez un fichier PDF." };
  }

  if (fichier.type !== "application/pdf") {
    return { statut: "erreur", message: "Le fichier doit être un PDF." };
  }

  if (fichier.size > TAILLE_MAX_RESULTATS) {
    return { statut: "erreur", message: "Le fichier dépasse 4 Mo." };
  }

  await exigerUtilisateur();

  // Horodatage dans le nom : un nouveau dépôt ne heurte pas le cache du CDN
  // sur l'ancienne URL.
  const nomFichier = `resultats/${slug || id}-${Date.now()}.pdf`;
  const contenuPdf = new Uint8Array(await fichier.arrayBuffer());
  let introuvable = false as boolean;

  try {
    await commiter("Back-office : résultats de compétition", async (lire) => {
      const fiches = await lireDans(lire, "competitions");
      const fiche = fiches.find((f) => f.id === id);

      if (!fiche) {
        introuvable = true;
        return null;
      }

      const ancien = fiche.resultatsUrl?.startsWith("/fichiers/")
        ? `${DOSSIER_FICHIERS}/${fiche.resultatsUrl.slice("/fichiers/".length)}`
        : null;

      const suivantes = fiches.map((f) =>
        f.id === id
          ? { ...f, resultatsUrl: `/fichiers/${nomFichier}`, resultatsPublies: true, vainqueurs }
          : f,
      );

      return [
        { chemin: `${DOSSIER_FICHIERS}/${nomFichier}`, contenu: contenuPdf },
        { chemin: cheminsContenu.competitions, contenu: versJson(suivantes) },
        // L'ancien PDF, remplacé, quitte le dépôt (il reste dans l'historique).
        ...(ancien ? [{ chemin: ancien, contenu: null }] : []),
      ];
    });
  } catch (erreur) {
    console.error("Publication des résultats impossible", erreur);
    return { statut: "erreur", message: "L'envoi a échoué. Réessayez dans un instant." };
  }

  if (introuvable) {
    return { statut: "erreur", message: "Cette compétition n'existe plus. Rechargez la page." };
  }

  updateTag(tags.competitions);

  return { statut: "succes", message: "Résultats publiés sur le site." };
}
