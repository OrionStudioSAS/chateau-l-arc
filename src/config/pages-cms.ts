/**
 * Pages modifiables dans l'éditeur visuel du back-office (rubrique « Pages »).
 * L'ordre est celui de la liste ; la vignette reprend la bannière de la page.
 */
export type PageCms = { cle: string; titre: string; chemin: string; vignette: string | null };

export const pagesCms: PageCms[] = [
  { cle: "accueil", titre: "Accueil", chemin: "/", vignette: "/images/banner.jpg" },
  { cle: "parcours", titre: "Le parcours", chemin: "/le-parcours", vignette: "/images/parcours.png" },
  { cle: "histoire", titre: "Histoire", chemin: "/histoire", vignette: "/images/notre-histoire.png" },
  { cle: "competitions", titre: "Compétitions", chemin: "/competitions", vignette: "/images/competitions.png" },
  { cle: "tarifs", titre: "Tarifs", chemin: "/tarifs", vignette: "/images/tarifs.png" },
  { cle: "academie", titre: "L'Académie", chemin: "/academie", vignette: "/images/academie.png" },
  { cle: "restaurant", titre: "Restaurant Le Club House", chemin: "/restaurant", vignette: "/images/hp-dejeuner.png" },
  { cle: "devenir-membre", titre: "Devenir membre", chemin: "/devenir-membre", vignette: "/images/hp-join.png" },
  { cle: "mentions-legales", titre: "Mentions légales", chemin: "/mentions-legales", vignette: null },
];
