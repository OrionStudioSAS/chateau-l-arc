import "server-only";

/**
 * Stockage des compteurs de visites : Redis via l'API REST d'Upstash (offre
 * gratuite, ajoutée depuis Vercel → Storage → Upstash for Redis, qui renseigne
 * seul les variables ci-dessous). Une seule requête HTTP par lot de commandes.
 *
 * En développement, sans ces variables, un stockage en mémoire (perdu au
 * redémarrage) permet de tester le suivi et l'accueil du back-office.
 */
/**
 * L'intégration Vercel nomme les variables selon le préfixe choisi à la
 * création (KV_REST_API_URL par défaut, STORAGE_REST_API_URL…) : on prend la
 * première paire URL + jeton trouvée.
 */
function identifiants(): { url?: string; jeton?: string } {
  const env = process.env;
  if (env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) {
    return { url: env.UPSTASH_REDIS_REST_URL, jeton: env.UPSTASH_REDIS_REST_TOKEN };
  }
  for (const cle of Object.keys(env)) {
    const prefixe = cle.match(/^(.*)REST_API_URL$/)?.[1];
    if (prefixe !== undefined && env[cle] && env[`${prefixe}REST_API_TOKEN`]) {
      return { url: env[cle], jeton: env[`${prefixe}REST_API_TOKEN`] };
    }
  }
  return {};
}

const { url: URL_REDIS, jeton: JETON } = identifiants();

/** Vrai si une base Redis est reliée (hors stockage en mémoire de développement). */
export const redisRelie = Boolean(URL_REDIS && JETON);

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
const globale = globalThis as unknown as { __suiviMemoire?: Map<string, Valeur>; __texteMemoire?: Map<string, string> };
const cles = (globale.__suiviMemoire ??= new Map());

function hash(cle: string) {
  if (!cles.has(cle)) cles.set(cle, new Map<string, number>());
  return cles.get(cle) as Map<string, number>;
}
function ensemble(cle: string) {
  if (!cles.has(cle)) cles.set(cle, new Set<string>());
  return cles.get(cle) as Set<string>;
}

/** Valeurs texte (demandes de contact). */
const textes = (globale.__texteMemoire ??= new Map<string, string>());

/** Sous-ensemble des commandes Redis utilisées par le suivi et les demandes. */
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
      case "SET":
        textes.set(cle, a);
        return "OK";
      case "GET":
        return textes.get(cle) ?? null;
      case "MGET":
        return args.map((k) => textes.get(String(k)) ?? null);
      case "DEL":
        return args.filter((k) => textes.delete(String(k))).length;
      case "INCR": {
        const valeur = Number(textes.get(cle) ?? 0) + 1;
        textes.set(cle, String(valeur));
        return valeur;
      }
      case "ZREM":
        return args.slice(1).filter((membre) => hash(cle).delete(String(membre))).length;
      case "ZREVRANGE": {
        const tries = [...hash(cle)].sort((x, y) => y[1] - x[1]).map(([membre]) => membre);
        return tries.slice(Number(a), Number(b) === -1 ? undefined : Number(b) + 1);
      }
      default:
        throw new Error(`Commande non simulée : ${nom}`);
    }
  });
}
