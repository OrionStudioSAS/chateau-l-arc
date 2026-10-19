import { NextResponse, type NextRequest } from "next/server";

import { COOKIE_SESSION, lireJeton } from "@/lib/admin/jeton";
import { codesLangues, LANGUE_PRINCIPALE } from "@/lib/i18n/langues";
import { aUnNomTraduit, cheminInterne, cheminLocal } from "@/lib/i18n/chemins";

const CHEMIN_CONNEXION = "/admin/connexion";

/** Back-office : sans session valide, retour à la connexion. */
function proxyAdmin(request: NextRequest) {
  const connecte = lireJeton(request.cookies.get(COOKIE_SESSION)?.value) !== null;
  const chemin = request.nextUrl.pathname;

  // La vérification complète (compte toujours déclaré) est refaite dans le
  // layout ; la page de connexion renvoie elle-même vers /admin un compte déjà
  // connecté (le faire ici bouclerait sur un compte retiré dont le cookie est
  // encore valide).
  if (!connecte && !chemin.startsWith(CHEMIN_CONNEXION)) {
    const url = request.nextUrl.clone();
    url.pathname = CHEMIN_CONNEXION;
    url.searchParams.set("suite", chemin);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

/**
 * Site public : les pages vivent sous app/[lang]. Le visiteur ne voit pas le
 * préfixe du français (« /tarifs » → réécrit en « /fr/tarifs ») ; les autres
 * langues ont leur préfixe et des adresses traduites (« /en/rates » →
 * « /en/tarifs »). Une adresse anglaise restée en français (« /en/tarifs »)
 * est redirigée vers sa version traduite, pour n'avoir qu'une URL par page.
 */
function proxySite(request: NextRequest) {
  const chemin = request.nextUrl.pathname;
  const [, premier = "", ...reste] = chemin.split("/");
  const url = request.nextUrl.clone();

  if (premier !== LANGUE_PRINCIPALE && codesLangues.includes(premier)) {
    const visible = `/${reste.join("/")}`;
    if (aUnNomTraduit(visible, premier)) {
      url.pathname = cheminLocal(visible, premier);
      return NextResponse.redirect(url, 301);
    }
    url.pathname = `/${premier}${cheminInterne(visible, premier).replace(/^\/$/, "")}`;
    return NextResponse.rewrite(url);
  }

  url.pathname = `/${LANGUE_PRINCIPALE}${chemin === "/" ? "" : chemin}`;
  return NextResponse.rewrite(url);
}

/** Next 16 : l'ancien « middleware » s'appelle désormais proxy. */
export function proxy(request: NextRequest) {
  return request.nextUrl.pathname.startsWith("/admin") ? proxyAdmin(request) : proxySite(request);
}

export const config = {
  // Tout sauf les fichiers (un point dans le nom : images, sitemap.xml,
  // llms.txt…), les routes techniques et les ressources de Next.
  matcher: ["/((?!_next|api|fichiers|.*\\..*).*)"],
};
