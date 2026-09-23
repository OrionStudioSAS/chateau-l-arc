import { createClient } from "@supabase/supabase-js";

/**
 * Client sans session, pour le contenu public.
 * Ne touche pas aux cookies : il peut donc être appelé dans un scope
 * « use cache » (cf. src/lib/api/content.ts).
 */
/** Vrai lorsque les deux variables d'environnement Supabase sont renseignées. */
export const supabaseConfigure = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
);

export function creerClientPublic() {
  if (!supabaseConfigure) {
    throw new Error(
      "Supabase n'est pas configuré : renseignez NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
    );
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
