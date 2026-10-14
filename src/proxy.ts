import { NextResponse, type NextRequest } from "next/server";

import { COOKIE_SESSION, lireJeton } from "@/lib/admin/jeton";

const CHEMIN_CONNEXION = "/admin/connexion";

/**
 * Next 16 : l'ancien « middleware » s'appelle désormais proxy.
 * Limité au back-office : sans session valide, retour à la connexion. La
 * vérification complète (compte toujours déclaré) est refaite dans le layout ;
 * la page de connexion renvoie elle-même vers /admin un compte déjà connecté
 * (le faire ici bouclerait sur un compte retiré dont le cookie est encore valide).
 */
export function proxy(request: NextRequest) {
  const connecte = lireJeton(request.cookies.get(COOKIE_SESSION)?.value) !== null;
  const chemin = request.nextUrl.pathname;
  const surLaConnexion = chemin.startsWith(CHEMIN_CONNEXION);

  if (!connecte && !surLaConnexion) {
    const url = request.nextUrl.clone();
    url.pathname = CHEMIN_CONNEXION;
    url.searchParams.set("suite", chemin);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
