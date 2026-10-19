import "server-only";

import { redis, stockageConfigure } from "@/lib/analytics/redis";
import type { Demande } from "@/lib/demandes";

/**
 * Demandes de contact dans Redis (Upstash, la base des statistiques) : une
 * clé JSON par demande, et un index trié par date de réception.
 *
 * Données personnelles : chaque demande s'efface d'elle-même au bout de
 * 13 mois (RGPD : rien n'est gardé au-delà du besoin de suivi).
 */
const INDEX = "demandes";
const cle = (id: string) => `demande:${id}`;
const CONSERVATION_S = 400 * 24 * 3600;

export const demandesDisponibles = stockageConfigure;

export async function enregistrerDemande(demande: Demande): Promise<void> {
  await redis([
    ["SET", cle(demande.id), JSON.stringify(demande), "EX", CONSERVATION_S],
    ["ZADD", INDEX, Date.parse(demande.recueLe), demande.id],
  ]);
}

/** Les 500 dernières demandes, de la plus récente à la plus ancienne. */
export async function listerDemandes(): Promise<Demande[]> {
  const [ids] = (await redis([["ZREVRANGE", INDEX, 0, 499]])) as [string[]];
  if (!ids?.length) return [];

  const [valeurs] = (await redis([["MGET", ...ids.map(cle)]])) as [(string | null)[]];
  // Demandes expirées : on retire leur trace de l'index.
  const expirees = ids.filter((_, i) => !valeurs[i]);
  if (expirees.length) await redis([["ZREM", INDEX, ...expirees]]);

  return valeurs.flatMap((valeur) => (valeur ? [JSON.parse(valeur) as Demande] : []));
}

export async function lireDemande(id: string): Promise<Demande | null> {
  const [valeur] = (await redis([["GET", cle(id)]])) as [string | null];
  return valeur ? (JSON.parse(valeur) as Demande) : null;
}

/** Modifie une demande en gardant sa date d'expiration d'origine. */
export async function modifierDemande(
  id: string,
  modifier: (demande: Demande) => Demande,
): Promise<Demande | null> {
  const demande = await lireDemande(id);
  if (!demande) return null;
  const suivante = modifier(demande);
  const restant = Math.max(60, CONSERVATION_S - Math.round((Date.now() - Date.parse(demande.recueLe)) / 1000));
  await redis([["SET", cle(id), JSON.stringify(suivante), "EX", restant]]);
  return suivante;
}

/**
 * Limite d'envoi par adresse IP (anti-abus) : `max` demandes par heure.
 * Vrai si l'envoi est autorisé.
 */
export async function envoiAutorise(ip: string, max = 5): Promise<boolean> {
  const compteur = `demandes:ip:${ip}:${new Date().toISOString().slice(0, 13)}`;
  const [nombre] = (await redis([
    ["INCR", compteur],
    ["EXPIRE", compteur, 3600],
  ])) as [number];
  return nombre <= max;
}
