import { createHash, createHmac } from "node:crypto";

import { evenements } from "@/lib/analytics/evenements";
import {
  CLE_ACTIFS,
  CLE_POPUP,
  cleJour,
  clePages,
  cleVisiteurs,
  jourEtHeure,
} from "@/lib/analytics/cles";
import { redis, stockageConfigure, type Commande } from "@/lib/analytics/redis";

const NOMS = new Set<string>(Object.values(evenements));
const ROBOTS = /bot|crawl|spider|slurp|facebookexternalhit|preview|headless|lighthouse|pingdom|monitor/i;
const RECHERCHE = /(^|\.)(google|bing|duckduckgo|qwant|ecosia|yahoo|yandex|baidu|startpage|brave)\./i;
const RESEAUX =
  /(^|\.)(facebook|instagram|linkedin|twitter|x|t|tiktok|youtube|pinterest|snapchat|threads|whatsapp|lnkd)\.(com|co|net|fr|in)$|(^|\.)fb\.me$/i;

/** Famille de la source d'une visite, d'après le référent. */
function famille(referent: string, hote: string): string {
  if (!referent) return "direct";
  try {
    const source = new URL(referent).hostname.replace(/^www\./, "");
    if (source === hote.replace(/^www\./, "")) return "direct";
    if (RECHERCHE.test(source)) return "recherche";
    if (RESEAUX.test(source)) return "social";
    return "autres";
  } catch {
    return "direct";
  }
}

/**
 * Identifiant anonyme du visiteur pour la journée : empreinte de l'IP et du
 * navigateur, salée par une clé qui change chaque jour. Rien n'est stocké en
 * clair et l'identifiant ne permet pas de suivre quelqu'un d'un jour à l'autre
 * (principe de Plausible, conforme à l'exemption de la CNIL).
 */
function visiteur(requete: Request, jour: string): string {
  const ip = requete.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "";
  const navigateur = requete.headers.get("user-agent") ?? "";
  const sel = createHmac("sha256", process.env.SUIVI_SEL || process.env.ADMIN_SECRET_SESSION || "suivi")
    .update(jour)
    .digest();
  return createHash("sha256").update(sel).update(ip).update(navigateur).digest("hex").slice(0, 16);
}

type Charge = { t?: unknown; p?: unknown; r?: unknown; e?: unknown; n?: unknown; v?: unknown };

/**
 * Collecte du suivi d'audience (navigator.sendBeacon depuis le site public).
 * Ne compte que la production — les prévisualisations Vercel sont ignorées.
 */
export async function POST(requete: Request) {
  const enProduction = process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "development";
  if (!stockageConfigure || !enProduction) return new Response(null, { status: 204 });
  if (ROBOTS.test(requete.headers.get("user-agent") ?? "")) return new Response(null, { status: 204 });

  let charge: Charge;
  try {
    const texte = await requete.text();
    if (texte.length > 2000) return new Response(null, { status: 413 });
    charge = JSON.parse(texte) as Charge;
  } catch {
    return new Response(null, { status: 400 });
  }

  const chemin = typeof charge.p === "string" ? charge.p.split(/[?#]/)[0].slice(0, 200) : "";
  if (!chemin.startsWith("/") || /^\/(admin|api|fichiers)(\/|$)/.test(chemin)) {
    return new Response(null, { status: 204 });
  }

  const { jour, heure } = jourEtHeure();
  const commandes: Commande[] = [];

  if (charge.t === "vue") {
    const id = visiteur(requete, jour);
    commandes.push(
      ["HINCRBY", clePages(jour), chemin, 1],
      ["HINCRBY", cleJour(jour), "vues", 1],
      ["PFADD", cleVisiteurs(jour), id],
      ["ZADD", CLE_ACTIFS, Date.now(), id],
    );
    // Première page de la visite : on compte la visite, son heure et sa source.
    if (charge.e === 1) {
      const referent = typeof charge.r === "string" ? charge.r : "";
      const hote = new URL(requete.url).hostname;
      commandes.push(
        ["HINCRBY", cleJour(jour), "visites", 1],
        ["HINCRBY", cleJour(jour), `h${heure}`, 1],
        ["HINCRBY", cleJour(jour), `src:${famille(referent, hote)}`, 1],
      );
    }
  } else if (charge.t === "evt" && typeof charge.n === "string" && NOMS.has(charge.n)) {
    commandes.push(
      ["HINCRBY", cleJour(jour), `e:${charge.n}`, 1],
      ["HINCRBY", cleJour(jour), `e:${charge.n}:h${heure}`, 1],
    );
    if (charge.n === evenements.popupAffichage && typeof charge.v === "string" && charge.v.length <= 40) {
      commandes.push(["HINCRBY", CLE_POPUP, charge.v, 1]);
    }
  } else {
    return new Response(null, { status: 400 });
  }

  try {
    await redis(commandes);
  } catch (erreur) {
    console.error("Enregistrement du suivi impossible", erreur);
  }
  return new Response(null, { status: 204 });
}
