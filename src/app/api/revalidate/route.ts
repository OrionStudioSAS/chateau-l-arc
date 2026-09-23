import { revalidateTag } from "next/cache";

/**
 * Webhook d'invalidation : l'API/CMS appelle cette route après une publication.
 *   POST /api/revalidate  { "tags": ["actualites", "actualite:mon-slug"] }
 *   En-tête : x-revalidate-secret: $REVALIDATE_SECRET
 */
export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;

  if (!secret || request.headers.get("x-revalidate-secret") !== secret) {
    return Response.json({ error: "Non autorisé" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Corps JSON invalide" }, { status: 400 });
  }

  const tags = (body as { tags?: unknown })?.tags;
  if (!Array.isArray(tags) || tags.some((tag) => typeof tag !== "string")) {
    return Response.json(
      { error: "Champ « tags » attendu : tableau de chaînes" },
      { status: 400 },
    );
  }

  for (const tag of tags as string[]) {
    // « max » : le contenu périmé reste servi pendant la revalidation en arrière-plan.
    revalidateTag(tag, "max");
  }

  return Response.json({ revalidated: tags, at: Date.now() });
}
