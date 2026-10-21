"use server";

import { randomUUID } from "node:crypto";
import { updateTag } from "next/cache";

import { tags } from "@/lib/api/content";
import { exigerUtilisateur } from "@/lib/admin/session";
import { commiter } from "@/lib/contenu/depot";
import { cheminsContenu, lireDans, versJson } from "@/lib/contenu/stockage";
import {
  LONGUEUR_MAX_DESCRIPTION_EVENEMENT,
  LONGUEUR_MAX_TITRE_EVENEMENT,
  typesEvenement,
  type EvenementCalendrier,
  type TypeEvenement,
} from "@/lib/evenements";

export type ResultatEvenement =
  | { ok: true; message: string; evenement: EvenementCalendrier }
  | { ok: false; message: string };

const estDate = (valeur: unknown): valeur is string =>
  typeof valeur === "string" && /^\d{4}-\d{2}-\d{2}$/.test(valeur) && !Number.isNaN(Date.parse(valeur));

const texte = (valeur: unknown, max: number) => String(valeur ?? "").trim().slice(0, max) || null;

/**
 * Ajoute ou modifie une date du calendrier (entretien, fermeture, animation…).
 * Sans `id` : création. Le site se met à jour dès l'enregistrement.
 */
export async function enregistrerEvenement(saisie: Partial<EvenementCalendrier>): Promise<ResultatEvenement> {
  await exigerUtilisateur();

  const titre = texte(saisie.titre, LONGUEUR_MAX_TITRE_EVENEMENT);
  if (!titre) return { ok: false, message: "Donnez un titre (« Tonte des greens »…)." };
  const type: TypeEvenement = saisie.type && saisie.type in typesEvenement ? saisie.type : "autre";
  if (!estDate(saisie.dateDebut)) return { ok: false, message: "Choisissez la date." };
  const dateFin = estDate(saisie.dateFin) && saisie.dateFin > saisie.dateDebut ? saisie.dateFin : null;

  const evenement: EvenementCalendrier = {
    id: typeof saisie.id === "string" && saisie.id ? saisie.id : randomUUID(),
    titre,
    type,
    dateDebut: saisie.dateDebut,
    dateFin,
    horaires: texte(saisie.horaires, 40),
    description: texte(saisie.description, LONGUEUR_MAX_DESCRIPTION_EVENEMENT),
    public: saisie.public !== false,
  };

  let introuvable = false;
  try {
    await commiter(`Back-office : calendrier, ${titre}`, async (lire) => {
      const evenements = await lireDans(lire, "evenements");
      const rang = evenements.findIndex((e) => e.id === evenement.id);
      if (saisie.id && rang === -1) {
        introuvable = true;
        return null;
      }
      const suite = rang === -1 ? [...evenements, evenement] : evenements.map((e, i) => (i === rang ? evenement : e));
      suite.sort((a, b) => a.dateDebut.localeCompare(b.dateDebut));
      return [{ chemin: cheminsContenu.evenements, contenu: versJson(suite) }];
    });
  } catch (erreur) {
    console.error("Enregistrement de l'événement impossible", erreur);
    return { ok: false, message: "L'enregistrement a échoué. Réessayez dans un instant." };
  }
  if (introuvable) return { ok: false, message: "Cette date a été supprimée entre-temps. Rechargez la page." };

  updateTag(tags.evenements);
  return {
    ok: true,
    message: evenement.public ? "Enregistré : visible dans le calendrier du site." : "Enregistré (visible seulement dans le back-office).",
    evenement,
  };
}

export async function supprimerEvenement(id: string): Promise<{ ok: boolean; message: string }> {
  await exigerUtilisateur();
  try {
    await commiter("Back-office : calendrier, suppression d'une date", async (lire) => {
      const evenements = await lireDans(lire, "evenements");
      if (!evenements.some((e) => e.id === id)) return null;
      return [{ chemin: cheminsContenu.evenements, contenu: versJson(evenements.filter((e) => e.id !== id)) }];
    });
  } catch (erreur) {
    console.error("Suppression de l'événement impossible", erreur);
    return { ok: false, message: "La suppression a échoué. Réessayez dans un instant." };
  }
  updateTag(tags.evenements);
  return { ok: true, message: "Date retirée du calendrier." };
}
