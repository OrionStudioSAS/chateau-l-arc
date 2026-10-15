import "server-only";

/**
 * Stockage des compteurs de visites : Redis via l'API REST d'Upstash (offre
 * gratuite, ajoutée depuis Vercel → Storage → Upstash for Redis, qui renseigne
 * seul les variables ci-dessous). Une seule requête HTTP par lot de commandes.
 *
 * En développement, sans ces variables, un stockage en mémoire (perdu au
 * redémarrage) permet de tester le suivi et l'accueil du back-office.
 */
const URL_REDIS = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const JETON = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

export type Commande = (string | number)[];

export const stockageConfigure =
  Boolean(URL_REDIS && JETON) || process.env.NODE_ENV === "development";

/** Exécute les commandes dans l'ordre et renvoie leurs résultats. */
export async function redis(commandes: Commande[]): Promise<unknown[]> {
  if (commandes.length === 0) return [];
  if (!URL_REDIS || !JETON) return memoire(commandes);

  const reponse = await fetch(`${URL_REDIS.replace(/\/$/, "")}/pipeline`, {
    method: "POST",
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
    headers: { Authorization: `Bearer ${JETON}`, "Content-Type": "application/json" },
    body: JSON.stringify(commandes.map((commande) => commande.map(String))),
  });
  if (!reponse.ok) throw new Error(`Redis ${reponse.status}`);

  const resultats = (await reponse.json()) as { result?: unknown; error?: string }[];
  const erreur = resultats.find((r) => r.error);
  if (erreur) throw new Error(`Redis : ${erreur.error}`);
  return resultats.map((r) => r.result);
}

/* ─── Stockage en mémoire (développement) ─────────────────────────────── */

type Valeur = Map<string, number> | Set<string>;
const globale = globalThis as unknown as { __suiviMemoire?: Map<string, Valeur> };
const cles = (globale.__suiviMemoire ??= new Map());

function hash(cle: string) {
  if (!cles.has(cle)) cles.set(cle, new Map<string, number>());
  return cles.get(cle) as Map<string, number>;
}
function ensemble(cle: string) {
  if (!cles.has(cle)) cles.set(cle, new Set<string>());
  return cles.get(cle) as Set<string>;
}

/** Sous-ensemble des commandes Redis utilisées par le suivi. */
function memoire(commandes: Commande[]): unknown[] {
  return commandes.map(([nom, ...args]) => {
    const [cle, a, b] = args.map(String);
    switch (String(nom).toUpperCase()) {
      case "HINCRBY": {
        const h = hash(cle);
        h.set(a, (h.get(a) ?? 0) + Number(b));
        return h.get(a);
      }
      case "HGET":
        return hash(cle).has(a) ? String(hash(cle).get(a)) : null;
      case "HGETALL":
        return [...hash(cle)].flatMap(([champ, v]) => [champ, String(v)]);
      case "PFADD":
        args.slice(1).forEach((membre) => ensemble(cle).add(String(membre)));
        return 1;
      case "PFCOUNT": {
        const union = new Set<string>();
        args.forEach((k) => ensemble(String(k)).forEach((m) => union.add(m)));
        return union.size;
      }
      case "ZADD":
        hash(cle).set(b, Number(a));
        return 1;
      case "ZREMRANGEBYSCORE": {
        const z = hash(cle);
        for (const [membre, score] of z) if (score >= Number(a) && score <= Number(b)) z.delete(membre);
        return 0;
      }
      case "ZCARD":
        return hash(cle).size;
      case "EXPIRE":
        return 1;
      default:
        throw new Error(`Commande non simulée : ${nom}`);
    }
  });
}
