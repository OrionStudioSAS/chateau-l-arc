"use server";

import { emailsComptes, exigerUtilisateur } from "@/lib/admin/session";
import type { Demande, StatutDemande } from "@/lib/demandes";
import { modifierDemande } from "@/lib/demandes-stockage";

export type ResultatDemande = { ok: true; demande: Demande } | { ok: false; message: string };

const statuts: StatutDemande[] = ["a-traiter", "en-cours", "traitee"];

async function appliquer(id: string, modifier: (d: Demande) => Demande): Promise<ResultatDemande> {
  await exigerUtilisateur();
  try {
    const demande = await modifierDemande(String(id), modifier);
    return demande ? { ok: true, demande } : { ok: false, message: "Cette demande n'existe plus." };
  } catch (e) {
    console.error("Mise à jour de la demande impossible", e);
    return { ok: false, message: "La mise à jour a échoué. Réessayez dans un instant." };
  }
}

/** Change le statut (« Marquer comme traitée » compris). */
export async function changerStatut(id: string, statut: StatutDemande): Promise<ResultatDemande> {
  if (!statuts.includes(statut)) return { ok: false, message: "Statut inconnu." };
  return appliquer(id, (d) => ({
    ...d,
    statut,
    lueLe: d.lueLe ?? new Date().toISOString(),
    traiteeLe: statut === "traitee" ? (d.traiteeLe ?? new Date().toISOString()) : null,
  }));
}

/** Confie la demande à un compte du back-office (ou à personne). */
export async function assigner(id: string, email: string | null): Promise<ResultatDemande> {
  if (email && !emailsComptes().includes(email)) return { ok: false, message: "Compte inconnu." };
  return appliquer(id, (d) => ({ ...d, assignee: email || null }));
}

/** Demande ouverte pour la première fois : elle n'apparaît plus comme nouvelle. */
export async function marquerLue(id: string): Promise<ResultatDemande> {
  return appliquer(id, (d) => (d.lueLe ? d : { ...d, lueLe: new Date().toISOString() }));
}
