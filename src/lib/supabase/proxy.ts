import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const CHEMIN_CONNEXION = "/admin/connexion";

/**
 * Rafraîchit la session Supabase et protège le back-office.
 * Le client est recréé à chaque requête (jamais mis en variable globale).
 */
export async function actualiserSession(request: NextRequest) {
  let reponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          reponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            reponse.cookies.set(name, value, options),
          );
          Object.entries(headers).forEach(([cle, valeur]) =>
            reponse.headers.set(cle, valeur),
          );
        },
      },
    },
  );

  // Ne rien intercaler entre createServerClient et getClaims() : c'est la
  // vérification de signature du JWT, la seule fiable côté serveur.
  const { data } = await supabase.auth.getClaims();
  const connecte = Boolean(data?.claims);

  const chemin = request.nextUrl.pathname;
  const surLaConnexion = chemin.startsWith(CHEMIN_CONNEXION);

  if (!connecte && !surLaConnexion) {
    const url = request.nextUrl.clone();
    url.pathname = CHEMIN_CONNEXION;
    url.searchParams.set("suite", chemin);
    return NextResponse.redirect(url);
  }

  if (connecte && surLaConnexion) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return reponse;
}
