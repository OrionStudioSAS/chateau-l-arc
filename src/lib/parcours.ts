import type { CleRepere } from "@/lib/reperes";

export type Trou = {
  numero: number;
  par: number;
  hcp: number;
  /** Distances en mètres, par repère de départ. */
  distances: Record<CleRepere, number>;
  description: string;
  conseilDuPro?: string;
  /** Position de la pastille sur map.png, en % de l'image. */
  position: { x: number; y: number };
  /** Identifiant de la vidéo YouTube fournie pour ce trou. */
  videoYoutubeId: string;
};

/**
 * TODO : seul le trou n°1 provient de la maquette du club. Les autres portent
 * des pars, index et distances cohérents (total 5 817 m, par 70) mais
 * provisoires, en attendant la carte de score officielle. Leur description est
 * à rédiger et aucun conseil du pro n'est renseigné : le bloc correspondant
 * ne s'affiche donc pas, ce qui rend le manque visible.
 */
const DESCRIPTION_A_COMPLETER =
  "Description à compléter à partir de la fiche du club.";

/** Distances des autres repères, dérivées du départ blanc. */
function distancesDepuisBlanc(blanc: number): Trou["distances"] {
  return {
    blanc,
    jaune: Math.round((blanc * 0.93) / 5) * 5,
    bleu: Math.round((blanc * 0.89) / 5) * 5,
    rouge: Math.round((blanc * 0.81) / 5) * 5,
    violet: Math.round((blanc * 0.81) / 5) * 5,
    orange: Math.round((blanc * 0.62) / 5) * 5,
  };
}

export const TROUS: Trou[] = [
  {
    numero: 1,
    videoYoutubeId: "t-nUT2nJ-Oc",
    par: 5,
    hcp: 15,
    distances: { blanc: 546, jaune: 470, bleu: 458, rouge: 383, violet: 383, orange: 240 },
    description:
      "Nous commençons par un long par 5 donnant sur la Sainte-Victoire, avec de nombreux bunkers. Idéal pour débuter votre partie.",
    conseilDuPro:
      "Jouez à droite des bunkers de fairway, le deuxième coup s'ouvre naturellement vers le green.",
    position: { x: 79.8, y: 35.8 },
  },
  { numero: 2, videoYoutubeId: "HUVRhyXntSI", par: 4, hcp: 7, distances: distancesDepuisBlanc(340), description: DESCRIPTION_A_COMPLETER, position: { x: 79.2, y: 43.8 } },
  { numero: 3, videoYoutubeId: "C5VbGSh3RUc", par: 3, hcp: 17, distances: distancesDepuisBlanc(160), description: DESCRIPTION_A_COMPLETER, position: { x: 67.7, y: 43.1 } },
  { numero: 4, videoYoutubeId: "lfU7b3PpZJg", par: 4, hcp: 5, distances: distancesDepuisBlanc(355), description: DESCRIPTION_A_COMPLETER, position: { x: 51.7, y: 56.8 } },
  { numero: 5, videoYoutubeId: "XMC7NVNznv8", par: 4, hcp: 9, distances: distancesDepuisBlanc(350), description: DESCRIPTION_A_COMPLETER, position: { x: 29.4, y: 34.9 } },
  { numero: 6, videoYoutubeId: "EnF5CDGqUhc", par: 3, hcp: 13, distances: distancesDepuisBlanc(175), description: DESCRIPTION_A_COMPLETER, position: { x: 17.7, y: 22.6 } },
  { numero: 7, videoYoutubeId: "3lOCbNPGRxs", par: 4, hcp: 3, distances: distancesDepuisBlanc(330), description: DESCRIPTION_A_COMPLETER, position: { x: 28.5, y: 14.4 } },
  { numero: 8, videoYoutubeId: "NerKO-rIUhk", par: 3, hcp: 11, distances: distancesDepuisBlanc(145), description: DESCRIPTION_A_COMPLETER, position: { x: 37.8, y: 9.0 } },
  { numero: 9, videoYoutubeId: "AGJdI-XN2AQ", par: 4, hcp: 1, distances: distancesDepuisBlanc(365), description: DESCRIPTION_A_COMPLETER, position: { x: 50.7, y: 15.5 } },
  { numero: 10, videoYoutubeId: "EEnTKkZaA18", par: 4, hcp: 8, distances: distancesDepuisBlanc(360), description: DESCRIPTION_A_COMPLETER, position: { x: 48.7, y: 34.1 } },
  { numero: 11, videoYoutubeId: "r-BsA0Dx4Is", par: 5, hcp: 14, distances: distancesDepuisBlanc(450), description: DESCRIPTION_A_COMPLETER, position: { x: 41.9, y: 44.9 } },
  { numero: 12, videoYoutubeId: "YOIC04HLOLk", par: 4, hcp: 6, distances: distancesDepuisBlanc(325), description: DESCRIPTION_A_COMPLETER, position: { x: 34.5, y: 83.8 } },
  { numero: 13, videoYoutubeId: "2rx7I3LykMU", par: 3, hcp: 18, distances: distancesDepuisBlanc(170), description: DESCRIPTION_A_COMPLETER, position: { x: 31.9, y: 71.8 } },
  { numero: 14, videoYoutubeId: "TEZdM6T2Q9A", par: 4, hcp: 4, distances: distancesDepuisBlanc(355), description: DESCRIPTION_A_COMPLETER, position: { x: 31.3, y: 63.7 } },
  { numero: 15, videoYoutubeId: "8ylbyR_rzsQ", par: 4, hcp: 10, distances: distancesDepuisBlanc(350), description: DESCRIPTION_A_COMPLETER, position: { x: 48.1, y: 76.6 } },
  { numero: 16, videoYoutubeId: "6uvBnRj29HM", par: 4, hcp: 16, distances: distancesDepuisBlanc(320), description: DESCRIPTION_A_COMPLETER, position: { x: 47.4, y: 84.4 } },
  { numero: 17, videoYoutubeId: "zcBpWoW5jFc", par: 4, hcp: 12, distances: distancesDepuisBlanc(345), description: DESCRIPTION_A_COMPLETER, position: { x: 36.7, y: 36.5 } },
  { numero: 18, videoYoutubeId: "NflcvVfp7LM", par: 4, hcp: 2, distances: distancesDepuisBlanc(376), description: DESCRIPTION_A_COMPLETER, position: { x: 41.2, y: 22.3 } },
];
