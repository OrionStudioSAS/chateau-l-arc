import type { FormuleAccueil } from "@/lib/api/types";

/** Tarifs fournis par le club — remplacés par l'API dès qu'elle sera branchée. */
export const formulesMock: FormuleAccueil[] = [
  {
    id: "9-trous",
    titre: "9 trous",
    prix: "dès 45€",
    detail: "45€ basse saison · 55€ haute saison",
  },
  {
    id: "18-trous",
    titre: "18 trous",
    prix: "85€",
    detail: "Carnets : 5 green fees achetés = 6 (350€)",
  },
  {
    id: "voiturette",
    titre: "Voiturette",
    prix: "dès 33€",
    detail: "33€ (9 trous) · 40€ (18 trous)",
  },
];
