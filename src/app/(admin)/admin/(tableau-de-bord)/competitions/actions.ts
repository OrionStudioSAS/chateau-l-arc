"use server";

import { updateTag } from "next/cache";

import { tags } from "@/lib/api/content";
import {
  libellesPublics,
  manquantsPourPublier,
  type BrouillonCompetition,
} from "@/lib/admin/brouillon-competition";
import {
  slugifier,
  TAILLE_MAX_RESULTATS,
  type EtatResultats,
} from "@/lib/admin/formulaire-competition";
import { TYPES_AFFICHE } from "@/lib/admin/popup";
import { exigerUtilisateur } from "@/lib/admin/session";
import { libellesCategorie } from "@/lib/competitions";
import { commiter, type Changement } from "@/lib/contenu/depot";
import {
  cheminsContenu,
  DOSSIER_FICHIERS,
  lireDans,
  versJson,
  type FicheCompetition,
} from "@/lib/contenu/stockage";

/** Affiche (redimensionnée dans le navigateur) et règlement : 2 Mo chacun. */
const TAILLE_MAX_PIECE = 2 * 1024 * 1024;

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

const nombreOuNull = (valeur: string): number | null => {
  if (!valeur.trim()) return null;
  const nombre = Number(valeur);
  return Number.isFinite(nombre) && nombre >= 0 ? Math.round(nombre) : null;
};

const ouNull = (valeur: string) => valeur.trim() || null;

/** Chemin dans le dépôt d'un fichier servi par /fichiers/…, ou null. */
const cheminDansDepot = (url: string | null | undefined) =>
  url?.startsWith("/fichiers/") ? `${DOSSIER_FICHIERS}/${url.slice("/fichiers/".length)}` : null;

/** Ajoute un suffixe tant que l'identifiant d'URL est déjà pris. */
function slugDisponible(fiches: FicheCompetition[], base: string, idActuel: string | null): string {
  const pris = new Set(fiches.filter((f) => f.id !== idActuel).map((f) => f.slug));
  let candidat = base || "competition";
  for (let suffixe = 2; pris.has(candidat); suffixe += 1) candidat = `${base}-${suffixe}`;
  return candidat;
}

export type ResultatCompetition =
  | { ok: true; message: string; id: string }
  | { ok: false; message: string };

async function piece(
  fichier: FormDataEntryValue | null,
  types: string[],
  libelle: string,
): Promise<{ contenu: Uint8Array; extension: string } | string | null> {
  if (!(fichier instanceof File) || fichier.size === 0) return null;
  if (!types.includes(fichier.type)) return `${libelle} : format non accepté.`;
  if (fichier.size > TAILLE_MAX_PIECE) return `${libelle} : 2 Mo maximum.`;
  return {
    contenu: new Uint8Array(await fichier.arrayBuffer()),
    extension: fichier.type === "application/pdf" ? "pdf" : fichier.type.split("/")[1].replace("jpeg", "jpg"),
  };
}

/**
 * Enregistre une compétition depuis l'assistant (création ou modification),
 * en brouillon ou publiée, avec son affiche et son règlement : tout part dans
 * un seul commit, les fichiers remplacés quittent le dépôt.
 */
export async function sauvegarderCompetition(formData: FormData): Promise<ResultatCompetition> {
  await exigerUtilisateur();

  let b: BrouillonCompetition;
  try {
    b = JSON.parse(String(formData.get("donnees") ?? "")) as BrouillonCompetition;
  } catch {
    return { ok: false, message: "Données illisibles. Rechargez la page." };
  }
  const statut = formData.get("statut") === "publie" ? "publie" : "brouillon";

  if (!b.nom?.trim()) return { ok: false, message: "Donnez un nom à la compétition." };
  if (!Object.hasOwn(libellesCategorie, b.categorie)) {
    return { ok: false, message: "Choisissez le type de compétition." };
  }
  const manquants = manquantsPourPublier(b);
  if (statut === "publie" && manquants.length) {
    return { ok: false, message: `Pour publier, renseignez ${manquants.join(", ")}.` };
  }
  if (statut === "brouillon" && !b.dateDebut) {
    return { ok: false, message: "Indiquez au moins une date, même provisoire." };
  }
  if (b.dateFin && b.dateFin < b.dateDebut) {
    return { ok: false, message: "La date de fin précède la date de début." };
  }

  const affiche = await piece(formData.get("affiche"), TYPES_AFFICHE, "Affiche");
  const reglement = await piece(formData.get("reglement"), ["application/pdf"], "Règlement");
  if (typeof affiche === "string") return { ok: false, message: affiche };
  if (typeof reglement === "string") return { ok: false, message: reglement };

  const publics = libellesPublics(b);
  let id = b.id;
  let introuvable = false as boolean;

  try {
    await commiter(`Back-office : compétition « ${b.nom.trim()} »`, async (lire) => {
      const fiches = await lireDans(lire, "competitions");
      const existante = id ? fiches.find((f) => f.id === id) : undefined;
      if (id && !existante) {
        introuvable = true;
        return null;
      }
      id ??= crypto.randomUUID();
      const slug = slugDisponible(fiches, slugifier(b.nom), id);
      const horodatage = Date.now();
      const changements: Changement[] = [];

      let afficheUrl = b.afficheUrl;
      if (affiche) {
        const chemin = `affiches/${slug}-${horodatage}.${affiche.extension}`;
        changements.push({ chemin: `${DOSSIER_FICHIERS}/${chemin}`, contenu: affiche.contenu });
        afficheUrl = `/fichiers/${chemin}`;
      }
      let reglementUrl = b.reglementUrl;
      if (reglement) {
        const chemin = `reglements/${slug}-${horodatage}.pdf`;
        changements.push({ chemin: `${DOSSIER_FICHIERS}/${chemin}`, contenu: reglement.contenu });
        reglementUrl = `/fichiers/${chemin}`;
      }
      // Fichiers remplacés ou retirés : ils quittent le dépôt (restent dans l'historique).
      for (const [avant, apres] of [
        [existante?.afficheUrl, afficheUrl],
        [existante?.reglementUrl, reglementUrl],
      ]) {
        const ancien = cheminDansDepot(avant);
        if (ancien && avant !== apres) changements.push({ chemin: ancien, contenu: null });
      }

      const fiche: FicheCompetition = {
        ...(existante ?? {
          inscrits: 0,
          vainqueurs: null,
          resultatsUrl: null,
          resultatsPublies: false,
        }),
        id,
        slug,
        nom: b.nom.trim(),
        dateDebut: b.dateDebut,
        dateFin: ouNull(b.dateFin ?? ""),
        formule: b.formule.trim() || "À préciser",
        depart: publics.depart,
        trous: publics.trous,
        indexMaximum: publics.indexMaximum,
        categories: publics.categories,
        sponsor: ouNull(b.sponsor),
        inscriptionOuverture: ouNull(b.inscriptionOuverture),
        inscriptionCloture: b.inscriptionCloture ? isoDepuisParis(b.inscriptionCloture) : null,
        places: nombreOuNull(b.places),
        inscrits: nombreOuNull(b.inscrits) ?? existante?.inscrits ?? 0,
        modeInscription: ouNull(b.modeInscription),
        droitJeuMembres: ouNull(b.droitJeuMembres),
        droitJeuVisiteurs: ouNull(b.droitJeuVisiteurs),
        inclus: ouNull(b.inclus),
        description: ouNull(b.description),
        afficheUrl,
        reglementUrl,
        categorie: b.categorie,
        ouverteVisiteurs: Boolean(b.ouverteVisiteurs),
        miseEnAvant: Boolean(b.miseEnAvant),
        annonceBandeau: Boolean(b.annonceBandeau),
        statut,
      };

      const suivantes = existante ? fiches.map((f) => (f.id === id ? fiche : f)) : [...fiches, fiche];
      suivantes.sort((a, c) => a.dateDebut.localeCompare(c.dateDebut));
      changements.push({ chemin: cheminsContenu.competitions, contenu: versJson(suivantes) });
      return changements;
    });
  } catch (erreur) {
    console.error("Enregistrement de la compétition impossible", erreur);
    return { ok: false, message: "L'enregistrement a échoué. Réessayez dans un instant." };
  }

  if (introuvable || !id) {
    return { ok: false, message: "Cette compétition n'existe plus. Rechargez la page." };
  }

  updateTag(tags.competitions);
  updateTag(tags.bandeau);
  return {
    ok: true,
    id,
    message: statut === "publie" ? "Compétition publiée sur le site." : "Brouillon enregistré.",
  };
}

/** Publie une compétition ou la repasse en brouillon (retirée du site). */
export async function changerStatutCompetition(
  id: string,
  statut: "publie" | "brouillon",
): Promise<{ ok: boolean; message: string }> {
  await exigerUtilisateur();
  let erreur = null as string | null;

  try {
    await commiter("Back-office : statut d'une compétition", async (lire) => {
      const fiches = await lireDans(lire, "competitions");
      const fiche = fiches.find((f) => f.id === id);
      if (!fiche) {
        erreur = "Cette compétition n'existe plus.";
        return null;
      }
      if (fiche.statut === statut) return null;
      if (statut === "publie" && (!fiche.dateDebut || fiche.formule === "À préciser")) {
        erreur = "Complétez la date et la formule avant de publier.";
        return null;
      }
      const suivantes = fiches.map((f) => (f.id === id ? { ...f, statut } : f));
      return [{ chemin: cheminsContenu.competitions, contenu: versJson(suivantes) }];
    });
  } catch (e) {
    console.error("Changement de statut impossible", e);
    return { ok: false, message: "L'opération a échoué. Réessayez dans un instant." };
  }
  if (erreur) return { ok: false, message: erreur };

  updateTag(tags.competitions);
  updateTag(tags.bandeau);
  return {
    ok: true,
    message: statut === "publie" ? "Compétition publiée sur le site." : "Compétition repassée en brouillon.",
  };
}

/** Supprime une compétition et ses fichiers (affiche, règlement, résultats). */
export async function supprimerCompetition(id: string): Promise<{ ok: boolean; message: string }> {
  await exigerUtilisateur();

  try {
    await commiter("Back-office : suppression d'une compétition", async (lire) => {
      const fiches = await lireDans(lire, "competitions");
      const fiche = fiches.find((f) => f.id === id);
      if (!fiche) return null;
      const fichiers = [fiche.afficheUrl, fiche.reglementUrl, fiche.resultatsUrl]
        .map(cheminDansDepot)
        .filter((c): c is string => Boolean(c));
      return [
        { chemin: cheminsContenu.competitions, contenu: versJson(fiches.filter((f) => f.id !== id)) },
        ...fichiers.map((chemin) => ({ chemin, contenu: null })),
      ];
    });
  } catch (e) {
    console.error("Suppression de la compétition impossible", e);
    return { ok: false, message: "La suppression a échoué. Réessayez dans un instant." };
  }

  updateTag(tags.competitions);
  updateTag(tags.bandeau);
  return { ok: true, message: "Compétition supprimée." };
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
