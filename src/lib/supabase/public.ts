import { createClient } from "@supabase/supabase-js";

/**
 * Client sans session, pour le contenu public.
 * Ne touche pas aux cookies : il peut donc être appelé dans un scope
 * « use cache » (cf. src/lib/api/content.ts).
 */
export function creerClientPublic() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
