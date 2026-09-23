import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Client Supabase lié à la session de la requête (cookies).
 * À utiliser dans le back-office et les actions serveur, jamais dans un
 * scope « use cache » : la lecture des cookies y est interdite.
 */
export async function creerClientServeur() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Appelé depuis un Server Component : le rafraîchissement de session
            // est assuré par proxy.ts, on peut ignorer.
          }
        },
      },
    },
  );
}
