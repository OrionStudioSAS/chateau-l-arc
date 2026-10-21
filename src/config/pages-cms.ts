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
  { cle: "faq", titre: "FAQ", chemin: "/faq", vignette: "/images/parcours.png" },
  { cle: "contact", titre: "Contact", chemin: "/contact", vignette: "/images/academie.png" },
];

/**
 * Listes dont le back-office peut ajouter ou retirer des éléments. Les autres
 * gardent leur nombre d'éléments : leur mise en page en dépend (pictos, grilles).
 */
export const listesExtensibles: Record<
  string,
  { element: string; ajout: string; min: number; max: number; modele: Record<string, string> }
> = {
  ACADEMIE_ENSEIGNANTS: {
    element: "Enseignant",
    ajout: "Ajouter un enseignant",
    min: 1,
    max: 12,
    modele: { nom: "", titre: "Enseignant diplômé d'État", photo: "" },
  },
};

/** Clés d'objets qui portent une image, même vide (photo facultative). */
export const clesImage = ["photo", "image"];
