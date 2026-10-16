/**
 * Titres en capitales Butler Bold qui occupent toute la largeur de leur
 * conteneur (`@container`) : 11 % de la largeur, réduits si le texte est long
 * pour tenir sur sa ligne (bannières, pied de page).
 *
 * La largeur du texte est calculée côté serveur d'après la chasse des
 * lettres : la taille s'ajuste en CSS pur, sans script ni décalage à
 * l'hydratation.
 */

/** Chasse des capitales de Butler Bold, en em (mesurée dans le navigateur). */
const CHASSE: Record<string, number> = {
  A: 0.76, B: 0.76, C: 0.72, D: 0.83, E: 0.72, F: 0.67, G: 0.81, H: 0.91, I: 0.45,
  J: 0.6, K: 0.82, L: 0.69, M: 1.02, N: 0.84, O: 0.82, P: 0.7, Q: 0.82, R: 0.8,
  S: 0.65, T: 0.68, U: 0.83, V: 0.76, W: 1.13, X: 0.81, Y: 0.73, Z: 0.69,
  Œ: 1.1, Æ: 1.07, "'": 0.27, "’": 0.27, " ": 0.25, "-": 0.38, "·": 0.34, ".": 0.33,
  ",": 0.33, "&": 0.8, "0": 0.7, "1": 0.49, "2": 0.63, "3": 0.62, "4": 0.65,
  "5": 0.6, "6": 0.65, "7": 0.55, "8": 0.68, "9": 0.65,
};

/** Ligne la plus large du titre : largeur en em et nombre de caractères. */
function mesurer(titre: string) {
  let em = 0.5;
  let caracteres = 1;
  for (const ligne of titre.split("\n")) {
    const lettres = [...ligne.toLocaleUpperCase("fr")];
    // Lettres accentuées : même chasse que leur base (É → E).
    const largeur = lettres.reduce(
      (total, l) => total + (CHASSE[l] ?? CHASSE[l.normalize("NFD")[0]] ?? 0.8),
      0,
    );
    if (largeur > em) {
      em = largeur;
      caracteres = lettres.length;
    }
  }
  return { em, caracteres };
}

/**
 * Classe de taille : `--largeur-em`, largeur de la ligne la plus longue en em
 * (marge de 3 %) ; `--espacement`, ses espacements de 2 px (tracking-[2px]).
 */
export const TAILLE_PLEINE_LARGEUR =
  "text-[length:min(11cqw,calc((100cqw-var(--espacement))/var(--largeur-em)))]";

/** Variables CSS à poser sur le titre (style), avec TAILLE_PLEINE_LARGEUR. */
export function variablesPleineLargeur(titre: string) {
  const { em, caracteres } = mesurer(titre);
  return {
    "--largeur-em": (em * 1.03).toFixed(3),
    "--espacement": `${caracteres * 2}px`,
  } as React.CSSProperties;
}
